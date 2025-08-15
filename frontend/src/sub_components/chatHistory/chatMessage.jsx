import React from "react";

const ChatMessage = ({ messages = [] }) => {
  return (
    <>
      {messages.map((msg, index) => {
        const sender = msg.sender || msg.role;
        const text = msg.text ?? "";
        return (
          <div
            key={index}
            className={`flex ${
              sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm shadow-md ${
                sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-[#1a1a1a] text-purple-200 border border-purple-500 rounded-bl-none"
              }`}
            >
              {text}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatMessage;
