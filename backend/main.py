# main.py
from dotenv import load_dotenv
load_dotenv()  # <-- LOAD YOUR .env FILE AS THE FIRST CODE LINE

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.agent_router import router as agent_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(agent_router)
