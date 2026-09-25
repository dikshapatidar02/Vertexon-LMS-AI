from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.rag.retriever import retrieve_relevant_chunks

app = FastAPI(
    title="Vertexon LMS AI Service",
    description="RAG-based AI Tutor, Lesson Summarization, Flashcard Generator, & Quiz Generator Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    course_id: str
    mode: str = "intermediate"
    message: str

class ChatResponse(BaseModel):
    reply: str
    sources: List[dict]
    mode: str

@app.get("/health")
def health():
    return {"status": "healthy", "service": "Vertexon AI Service"}

@app.post("/ai/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest):
    chunks = retrieve_relevant_chunks(req.message, req.course_id, top_k=2)
    
    primary_source = chunks[0] if chunks else {
        "lecture_id": "lec-dsa-101",
        "lecture_title": "Course Overview",
        "timestamp_seconds": 120
    }
    
    sources = [{
        "lecture_id": primary_source.get("lecture_id"),
        "lecture_title": primary_source.get("lecture_title"),
        "timestamp_seconds": primary_source.get("timestamp_seconds", 120)
    }]

    if req.mode == "beginner":
        reply = f"[Beginner Explanation]\nThink of this concept like dividing a stack of cards into smaller piles. Based on {primary_source.get('lecture_title')}: {primary_source.get('content')}"
    elif req.mode == "advanced":
        reply = f"[Advanced Analysis]\nEvaluating asymptotic properties and vector boundaries: Grounded in {primary_source.get('lecture_title')}, {primary_source.get('content')}"
    else:
        reply = f"Based on your course materials ({primary_source.get('lecture_title')}): {primary_source.get('content')}"

    return ChatResponse(reply=reply, sources=sources, mode=req.mode)
