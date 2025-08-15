import React from "react";
import { HiMicrophone } from "react-icons/hi";

const Mic = ({ isRecording, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-full transition duration-300 ${
        isRecording
          ? "bg-red-600 hover:bg-red-500"
          : "bg-purple-700 hover:bg-purple-600"
      } text-white`}
    >
      <HiMicrophone size={24} />
    </button>
  );
};

export default Mic;
