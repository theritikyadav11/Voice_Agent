import React, { useState, useRef, useEffect } from "react";
import Mic from "../sub_components/messageBox/mic";
import { sendAudio } from "../services/api";

// Helper for modern bar-style waveform
function drawBarsWaveform(ctx, dataArray, width, height) {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, width, height);
  const barWidth = (width / dataArray.length) * 1.5;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * height * 0.7;
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);
    x += barWidth + 1;
  }
}

const MessageBox = ({ sessionId, addMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingBot, setIsPlayingBot] = useState(false);
  const [showIdle, setShowIdle] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const analyserRef = useRef(null);

  // Reset idle when not processing or playing
  useEffect(() => {
    if (!isProcessing && !isRecording && !isPlayingBot) {
      setShowIdle(true);
    }
  }, [isProcessing, isRecording, isPlayingBot]);

  // Waveform drawing
  const startWaveform = (sourceNode) => {
    const audioCtx = sourceNode.context;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      drawBarsWaveform(ctx, dataArray, canvas.width, canvas.height);
    };
    draw();
  };

  const stopWaveform = () => {
    cancelAnimationFrame(animationIdRef.current);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      if (!sessionId) return; // no active session to send to

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioCtx = new window.AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        startWaveform(source);
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stopWaveform();
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          if (audioBlob.size === 0) {
            setIsProcessing(false);
            return;
          }
          setIsProcessing(true);
          setShowIdle(false);

          try {
            // ✅ Use current sessionId prop here
            const response = await sendAudio(sessionId, audioBlob);

            if (response.transcription) {
              addMessage("user", response.transcription);
            }
            if (response.llm_text) {
              addMessage("bot", response.llm_text);
            }
            if (response.audio_url) {
              await playBotAudioWithWaveform(response.audio_url);
            }
          } catch (err) {
            console.error("Send audio error:", err);
          } finally {
            setIsProcessing(false);
          }
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setIsPlayingBot(false);
        setShowIdle(false);
      } catch (err) {
        console.error("Mic error:", err);
      }
    } else {
      setIsRecording(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const playBotAudioWithWaveform = async (audioUrl) => {
    try {
      setIsPlayingBot(true);
      setShowIdle(false);
      setIsProcessing(false);
      const audioCtx = new window.AudioContext();
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      startWaveform(source);
      source.start();
      source.onended = () => {
        setIsPlayingBot(false);
        stopWaveform();
        setShowIdle(true);
      };
    } catch (err) {
      setIsPlayingBot(false);
      stopWaveform();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-[#111] border border-purple-500 rounded-lg px-4 py-3"
      style={{
        minHeight: "128px",
        maxWidth: "500px",
        width: "100%",
        margin: "0 auto",
        boxShadow: "0 2px 12px rgba(168,85,247,0.14)",
        zIndex: 10,
      }}
    >
      <div className="flex flex-col items-center w-full">
        {/* Mic button */}
        <div className="flex flex-col items-center">
          <Mic
            isRecording={isRecording}
            onClick={handleMicClick}
            disabled={!sessionId || isProcessing}
          />

          {showIdle && (
            <span
              style={{
                color: "#d8b4fe",
                fontWeight: 600,
                marginTop: 8,
                fontSize: "1.1rem",
                letterSpacing: 0.2,
                transition: "opacity 0.2s",
              }}
            >
              Start Recording...
            </span>
          )}
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center w-full mt-2">
          <canvas
            ref={canvasRef}
            width={280}
            height={48}
            style={{
              display: isRecording || isPlayingBot ? "block" : "none",
              background: "#181022",
              borderRadius: 10,
              boxShadow: "0 2px 4px rgba(168,85,247,0.08)",
              transition: "opacity 0.11s",
            }}
          ></canvas>
        </div>

        {isProcessing && (
          <span
            className="text-purple-300 font-medium mt-3 tracking-wide"
            style={{
              fontSize: "1.08rem",
              transition: "opacity 0.2s",
            }}
          >
            Processing...
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
