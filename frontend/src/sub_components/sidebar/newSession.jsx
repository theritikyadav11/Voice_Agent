import React from "react";

const NewSession = ({ onCreateNewSession }) => {
  return (
    <button
      onClick={onCreateNewSession}
      className="w-full bg-transparent border border-purple-400 text-purple-300 rounded-lg py-3 px-4 text-lg hover:bg-purple-700 hover:text-white transition duration-300"
    >
      New Session
    </button>
  );
};

export default NewSession;
