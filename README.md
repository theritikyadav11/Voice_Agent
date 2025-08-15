# **AI VoxAgent**

An interactive voice-first AI application powered by **Murf AI**, **AssemblyAI**, and **Google Gemini API**, built with **FastAPI** for the backend and a lightweight HTML/CSS/JavaScript frontend. This agent enables real-time speech capture, transcription, AI-based conversation, and natural-sounding voice responses.

---

## 📑 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [What You'll Need](#what-youll-need)
- [Tools Used](#tools-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Special Thanks](#special-thanks)
- [License](#license)

---

## 📖 Introduction

The **AI Voice Agent** is designed to demonstrate the possibilities of voice-first AI applications.  
It listens to user speech, transcribes it in real time, processes it using Google Gemini for intelligent responses, and then delivers those responses back using high-quality text-to-speech synthesis via Murf AI.

This setup is ideal for building:

- AI assistants
- Customer service bots
- Interactive storytelling agents
- Educational voice tutors

---

## ✨ Features

- 🎙 **Real-time Speech Capture** using the browser's `MediaRecorder` API.
- 📝 **Speech-to-Text (STT)** powered by AssemblyAI.
- 🧠 **Conversational AI** using Google Gemini.
- 🗣 **Natural Text-to-Speech (TTS)** with Murf AI.
- ⚡ **FastAPI Backend** for speed and scalability.
- 🌐 **Lightweight Frontend** built React and TailwindCSS.
- 🔑 **Secure API Key Management** using `.env` files.

---

# My Project

Here is what the app looks like:

![App Screenshot](Images/screenshot1.png)
![App Screenshot](Images/screenshot2.png)

## 🛠 What You'll Need

- **FastAPI** (Python)
- **Murf AI API key**
- **AssemblyAI API key**
- **Google Gemini API key**
- **React** (Frontend)
- `.env` file to securely store API keys

---

## 🧩 Tools Used

| Tool               | Purpose                         |
| ------------------ | ------------------------------- |
| **Murf AI**        | Text-to-Speech (TTS)            |
| **FastAPI**        | Backend API server              |
| **React+Tailwind** | UI for interaction and playback |
| **MediaRecorder**  | Echo Bot mic capture + playback |

---

## 📂 Project Structure

```
Voice_Agent/
│
├── backend/
│   ├── __pycache__/
│   ├── myenv/                # Python virtual environment (ignored)
│   │   ├── .gitignore
│   │   └── pyvenv.cfg
│   ├── models/
│   │   └── schemas.py
│   ├── routers/
│   │   └── agent_router.py
│   ├── services/
│   │   ├── db_service.py
│   │   ├── llm_service.py
│   │   ├── stt_service.py
│   │   └── tts_service.py
│   ├── utils/
│   │   ├── helpers.py
│   │   └── logger.py
│   ├── .env
│   ├── .gitignore
│   └── main.py
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── chatHistory.jsx
│   │   │   ├── messageBox.jsx
│   │   │   └── sidebar.jsx
│   │   ├── pages/
│   │   │   └── hero.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── sub_components/
│   │   │   ├── chatHistory/
│   │   │   │   ├── chatHeader.jsx
│   │   │   │   └── chatMessage.jsx
│   │   │   ├── messageBox/
│   │   │   │   ├── mic.jsx
│   │   │   │   ├── recordingWave.jsx
│   │   │   │   ├── wave.css
│   │   │   │   └── wave.jsx
│   │   │   └── sidebar/
│   │   │       ├── newSession.jsx
│   │   │       └── recentSession.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── eslint.config.js
│
├── README.md
└── .gitignore


```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/theritikyadav11/Voice_Agent.git
cd Voice_Agent
```

### 2️⃣ Create and Activate Virtual Environment

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3️⃣ Configure API Keys

```bash
MURF_API_KEY=your_murf_api_key
ASSEMBLY_API_KEY=your_assemblyai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4️⃣ Run the FastAPI Server

```bash
uvicorn main:app --reload
```

## 🚀 Usage

1. Start the FastAPI server as described above.
2. Open `http://localhost:8000` in the browser.
3. Grant microphone access.
4. Speak into your mic — your speech will be transcribed, processed by **Gemini**, and played back with **Murf AI's** voice.

## 🙌 Special Thanks

Huge thanks to **Murf AI** for organizing this challenge and encouraging developers to explore the world of voice-first interfaces.  
Your tools are enabling the next generation of interactive agents 💜

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
