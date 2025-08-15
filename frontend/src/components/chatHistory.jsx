import React from "react";
import ChatHeader from "../sub_components/chatHistory/chatHeader";
import ChatMessage from "../sub_components/chatHistory/chatMessage";

const ChatHistory = ({ openSidebar, chatHistory, currentSessionId }) => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        openSidebar={openSidebar}
        currentSessionId={currentSessionId}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        <ChatMessage messages={chatHistory} />
      </div>
    </div>
  );
};

export default ChatHistory;
