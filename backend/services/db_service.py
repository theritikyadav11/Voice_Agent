from pymongo import MongoClient
from datetime import datetime


class DBService:
    def __init__(self, mongo_uri):
        self.client = MongoClient(mongo_uri)
        self.db = self.client["voice_agent_db"]
        self.sessions = self.db["sessions"]

    def save_message(self, session_id, role, text):
        self.sessions.update_one(
            {"session_id": session_id},
            {
                "$push": {"history": {"role": role, "text": text, "timestamp": datetime.utcnow()}},
                "$setOnInsert": {"created_at": datetime.utcnow()}
            },
            upsert=True
        )

    def get_session_history(self, session_id):
        session = self.sessions.find_one({"session_id": session_id})
        history = session["history"] if session else []
        # Convert all timestamps to ISO format string
        converted_history = []
        for item in history:
            ts = item.get("timestamp")
            if hasattr(ts, "isoformat"):
                ts_str = ts.isoformat()
            elif ts is not None:
                ts_str = str(ts)
            else:
                ts_str = None
            converted_history.append({
                "role": item.get("role"),
                "text": item.get("text"),
                "timestamp": ts_str
            })
        return converted_history

    def delete_session(self, session_id):
        self.sessions.delete_one({"session_id": session_id})

    def list_sessions(self):
        sessions = self.sessions.find({}, {"_id": 0, "session_id": 1, "created_at": 1})
        # Normalize each session dict to ensure 'created_at' exists (or None)
        return [
            {
                "session_id": session.get("session_id"),
                "created_at": session.get("created_at").isoformat() if hasattr(session.get("created_at"), "isoformat") else None
            }
            for session in sessions
        ]

    def create_new_session(self, session_id, greeting):
        self.sessions.insert_one({
            "session_id": session_id,
            "history": [greeting],
            "created_at": datetime.utcnow()
        })
