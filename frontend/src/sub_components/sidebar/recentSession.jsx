import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

const RecentSession = ({
  recentSessions,
  onSessionSelect,
  onSessionDelete,
  currentSessionId,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(null);

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  return (
    <div className="border border-purple-400 rounded-lg p-3 relative">
      <h2 className="text-purple-300 text-lg mb-2">Recent Sessions</h2>
      <ul className="space-y-2">
        {recentSessions.map((session, index) => {
          const isActive = session.session_id === currentSessionId;
          return (
            <li
              key={session.session_id}
              className={`flex justify-between items-center text-purple-200 px-2 py-1 rounded hover:bg-purple-700 transition duration-300 relative ${
                isActive ? "bg-purple-700 font-semibold" : ""
              }`}
            >
              <span
                onClick={() => onSessionSelect(session.session_id)}
                className="truncate cursor-pointer"
              >
                {session.session_id}
              </span>

              <button
                aria-expanded={menuOpen === index}
                onClick={() => toggleMenu(index)}
                className="p-1 rounded hover:bg-purple-600 transition"
              >
                <HiOutlineDotsVertical size={20} />
              </button>

              {menuOpen === index && (
                <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-purple-400 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onSessionDelete(session.session_id);
                      setMenuOpen(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentSession;
