from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import tempfile
import os
from datetime import datetime
from uuid import uuid4

from models.schemas import TTSRequest, QueryRequest, ChatResponse, SessionSummary, CreateSessionResponse
from services.stt_service import STTService
from services.tts_service import TTSService
from services.llm_service import LLMService
from services.db_service import DBService
from utils.logger import setup_logger
from utils.helpers import convert_history_item  

router = APIRouter()
logger = setup_logger(__name__)

# Setup environment keys and services
MURF_API_KEY = os.getenv("MURF_API_KEY")
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")

stt_service = STTService(ASSEMBLYAI_API_KEY)
tts_service = TTSService(MURF_API_KEY)
llm_service = LLMService()
db_service = DBService(MONGO_URI)


@router.get("/")
def hello():
    return {"message": "Hello G kaise ho"}


@router.post("/agent/session/new", response_model=CreateSessionResponse)
async def create_new_session():
    session_id = str(uuid4())
    greeting = {
        "role": "assistant",
        "text": "Hello! How can I assist you today?",
        "timestamp": datetime.utcnow().isoformat()
    }
    db_service.create_new_session(session_id, greeting)
    return {"session_id": session_id}


@router.get("/agent/sessions", response_model=list[SessionSummary])
async def get_all_sessions():
    return db_service.list_sessions()


@router.get("/agent/chat/{session_id}", response_model=ChatResponse)
async def get_chat_session(session_id: str):
    history = db_service.get_session_history(session_id)
    if not history:
        raise HTTPException(status_code=404, detail="Session not found")
    # Normalize timestamps in history
    normalized_history = [convert_history_item(item) for item in history]
    return {
        "session_id": session_id,
        "history": normalized_history,
        "transcription": None,
        "llm_text": None,
        "audio_url": None
    }


@router.delete("/agent/chat/{session_id}")
async def delete_chat_session(session_id: str):
    db_service.delete_session(session_id)
    return {"message": "Session deleted successfully"}


@router.post("/agent/chat/{session_id}", response_model=ChatResponse)
async def agent_chat(session_id: str, file: UploadFile = File(...)):
    user_message, bot_reply, audio_url = "", "", "/static/tts_fallback.wav"

    # Step 1: Speech-to-text
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name
        logger.info(f"Audio received: {tmp_path} ({os.path.getsize(tmp_path)} bytes)")
        user_message = await stt_service.transcribe(tmp_path)
        if not user_message:
            logger.warning("No speech detected in audio")
            return JSONResponse(status_code=400, content={"error": "No speech detected."})
    except Exception as e:
        logger.error(f"STT Error: {e}")
        bot_reply = "I'm having trouble understanding you right now."
    finally:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)

    # Step 2: Save user message
    if user_message:
        db_service.save_message(session_id, "user", user_message)

    # Step 3: LLM Generation
    if user_message:
        try:
            history = db_service.get_session_history(session_id)
            prompt = "\n".join([f"{m['role']}: {m['text']}" for m in history])
            logger.info(f"LLM Prompt: {prompt}")
            bot_reply = llm_service.generate_content(prompt)
            if not bot_reply:
                bot_reply = "I'm having trouble forming a response right now."
        except Exception as e:
            logger.error(f"LLM Error: {e}")
            bot_reply = "I'm having trouble connecting right now."
    else:
        bot_reply = "I'm having trouble understanding you right now."

    # Step 4: Save bot reply
    db_service.save_message(session_id, "assistant", bot_reply)

    # Step 5: TTS with Murf
    if bot_reply.strip():
        try:
            audio_url = await tts_service.tts(bot_reply)
        except Exception as e:
            logger.warning(f"TTS Error: {e}")

    # Step 6: Return final response with normalized history timestamps
    normalized_history = [convert_history_item(item) for item in db_service.get_session_history(session_id)]
    
    return {
        "session_id": session_id,
        "transcription": user_message,
        "llm_text": bot_reply,
        "audio_url": audio_url,
        "history": normalized_history
    }
