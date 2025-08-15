from pydantic import BaseModel
from typing import List, Optional


class TTSRequest(BaseModel):
    text: str
    voiceId: str = "en-US-natalie"


class QueryRequest(BaseModel):
    text: str
    model: str = "gemini-2.5-flash"
    temperature: float = 0.7
    max_tokens: int = 1024


class Message(BaseModel):
    role: str
    text: str
    timestamp: str


class ChatResponse(BaseModel):
    session_id: str
    transcription: Optional[str]
    llm_text: Optional[str]
    audio_url: Optional[str]
    history: List[Message]


class SessionSummary(BaseModel):
    session_id: str
    created_at: Optional[str]  # made optional to prevent validation errors


class CreateSessionResponse(BaseModel):
    session_id: str
