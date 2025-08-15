import React from "react";
import "./wave.css";

const RecordingWave = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Wave Bars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="wave-bar bg-purple-400"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Recording Text */}
      <span className="text-purple-300 font-medium">Recording...</span>
    </div>
  );
};

export default RecordingWave;
