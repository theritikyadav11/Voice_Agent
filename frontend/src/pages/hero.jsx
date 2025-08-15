import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import ChatHistory from "../components/chatHistory";
import MessageBox from "../components/messageBox";
import {
  createSession,
  getChatHistory,
  listSessions,
  deleteSession,
} from "../services/api";

const Hero = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  // On mount, fetch sessions and set one active session (fixes Problem 3)
  useEffect(() => {
    const initializeSessions = async () => {
      try {
        const sessions = await listSessions();
        setRecentSessions(sessions || []);
        if (sessions && sessions.length > 0) {
          const firstSession = sessions[0];
          setCurrentSessionId(firstSession.session_id);
          const historyResponse = await getChatHistory(firstSession.session_id);
          setChatHistory(historyResponse.history || []);
        } else {
          // No existing sessions; create one upfront
          const newSession = await createSession();
          setCurrentSessionId(newSession.session_id);
          setChatHistory([]); // empty for new session
          setRecentSessions([]);
        }
      } catch (err) {
        console.error("Error initializing sessions:", err);
      }
    };
    initializeSessions();
  }, []);

  const fetchAndSetChatHistory = async (session_id) => {
    try {
      const data = await getChatHistory(session_id);
      setChatHistory(data.history || []);
    } catch (error) {
      console.error(
        "Failed to fetch chat history for session:",
        session_id,
        error
      );
      setChatHistory([]);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      const newSession = await createSession();

      // Move old active session to recent list
      if (currentSessionId) {
        setRecentSessions((prev) => [
          { session_id: currentSessionId },
          ...prev.filter((s) => s.session_id !== currentSessionId),
        ]);
      }

      // Set new session as active
      setCurrentSessionId(newSession.session_id);

      // Fetch chat history from backend (will contain greeting already)
      try {
        const historyRes = await getChatHistory(newSession.session_id);
        setChatHistory(historyRes.history || []);
      } catch (err) {
        console.error("Failed to fetch new session history:", err);
        setChatHistory([]);
      }

      // Add new session to top of recents
      setRecentSessions((prev) => [
        { session_id: newSession.session_id },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to create new session:", err);
    }
  };

  const handleLoadSession = async (session_id) => {
    if (!session_id) return;

    // Set current active session
    setCurrentSessionId(session_id);

    // Fetch history for that session only
    try {
      const data = await getChatHistory(session_id);
      setChatHistory(data.history || []);
    } catch (err) {
      console.error("Failed to load session history:", err);
      setChatHistory([]);
    }

    // Move this session to top in recent list
    setRecentSessions((prev) => {
      const withoutSelected = prev.filter((s) => s.session_id !== session_id);
      return [{ session_id }, ...withoutSelected];
    });
  };

  const handleDeleteSession = async (session_id) => {
    try {
      await deleteSession(session_id);

      // Remove from recent sessions
      const updatedRecents = recentSessions.filter(
        (s) => s.session_id !== session_id
      );
      setRecentSessions(updatedRecents);

      // If we deleted the active session
      if (session_id === currentSessionId) {
        if (updatedRecents.length > 0) {
          // Switch to the first available recent session
          const newActive = updatedRecents[0].session_id;
          setCurrentSessionId(newActive);
          const historyRes = await getChatHistory(newActive);
          setChatHistory(historyRes.history || []);
        } else {
          // No session exists → create a new one
          const newSession = await createSession();
          setCurrentSessionId(newSession.session_id);
          const historyRes = await getChatHistory(newSession.session_id);
          setChatHistory(historyRes.history || []);
        }
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const addMessage = (sender, text) => {
    setChatHistory((prev) => [
      ...prev,
      { role: sender === "bot" ? "assistant" : "user", text },
    ]);
  };

  return (
    <div className="w-full h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-1/2 md:w-1/5 bg-[#0d0d0d] border-r border-purple-500 p-2 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <Sidebar
          closeSidebar={() => setSidebarOpen(false)}
          onCreateNewSession={handleCreateNewSession}
          recentSessions={recentSessions}
          onSessionSelect={handleLoadSession}
          onSessionDelete={handleDeleteSession}
          currentSessionId={currentSessionId}
        />
      </div>

      {/* Chat + Message Section */}
      <div className="flex flex-col flex-1">
        {/* Chat History */}
        <div className="flex-1 p-2 overflow-y-auto">
          <ChatHistory
            chatHistory={chatHistory}
            openSidebar={() => setSidebarOpen(true)}
            currentSessionId={currentSessionId}
          />
        </div>

        {/* Message Box */}
        <div className="h-32 md:h-24 p-2 flex items-center justify-center mb-6">
          <MessageBox sessionId={currentSessionId} addMessage={addMessage} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
