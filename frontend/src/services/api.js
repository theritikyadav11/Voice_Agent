// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:8000"; // Backend base URL

// Create a new session
export const createSession = async () => {
  const res = await axios.post(`${API_BASE}/agent/session/new`);
  return res.data; // { session_id: "..." }
};

// Send audio to backend
export const sendAudio = async (sessionId, audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  const res = await axios.post(
    `${API_BASE}/agent/chat/${sessionId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// Get chat history of a session
export const getChatHistory = async (sessionId) => {
  const res = await axios.get(`${API_BASE}/agent/chat/${sessionId}`);
  return res.data;
};

// List all sessions
export const listSessions = async () => {
  const res = await axios.get(`${API_BASE}/agent/sessions`);
  return res.data;
};

// Delete a session
export const deleteSession = async (sessionId) => {
  const res = await axios.delete(`${API_BASE}/agent/chat/${sessionId}`);
  return res.data;
};

export const saveMessage = async (sessionId, role, text) => {
  await axios.post(`${API_BASE}/agent/chat/${sessionId}/message`, {
    role,
    text,
  });
};
