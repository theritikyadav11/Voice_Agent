import React from "react";
import { HiMenu } from "react-icons/hi"; // ✅ Import hamburger icon

const ChatHeader = ({ openSidebar, currentSessionId }) => {
  return (
    <div className="flex items-center justify-between bg-[#111] p-3 border-b border-purple-500">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden text-purple-300 hover:text-white"
        onClick={openSidebar}
      >
        <HiMenu size={28} /> {/* ✅ Icon restored */}
      </button>

      {/* Title and current session id */}
      <h1 className="text-purple-300 text-lg font-semibold text-center flex-1">
        AI Voice Agent
        {currentSessionId && (
          <span className="block text-xs text-purple-400 mt-1">
            Session: {currentSessionId}
          </span>
        )}
      </h1>

      {/* Placeholder element for spacing symmetry */}
      <div className="w-7" />
    </div>
  );
};

export default ChatHeader;
