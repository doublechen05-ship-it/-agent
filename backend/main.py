# -*- coding: utf-8 -*-
"""
FastAPI backend for Novel Writing Agent
"""
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from novel_agent import generate_outline, generate_chapter, regenerate_chapter

app = FastAPI(title="Novel Writing Agent API")

app.mount("/", StaticFiles(directory="dist", html=True), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OutlineRequest(BaseModel):
    genre: str
    outline: str
    characters: str
    chapter_count: int = 20


class ChapterRequest(BaseModel):
    novel_title: str
    genre: str
    previous_chapters: str
    chapter_number: int
    title: str
    summary: str


class RegenerateRequest(BaseModel):
    novel_title: str
    genre: str
    previous_chapters: str
    chapter_number: int
    title: str
    original_summary: str
    new_direction: str


@app.get("/")
async def root():
    return {"message": "Novel Writing Agent API", "status": "running"}


@app.post("/api/generate-outline")
async def api_generate_outline(req: OutlineRequest):
    """Generate novel outline and chapter list"""
    try:
        print(f"Received request: genre={req.genre}, chapter_count={req.chapter_count}")
        result = generate_outline(
            genre=req.genre,
            outline=req.outline,
            characters=req.characters,
            chapter_count=req.chapter_count
        )
        print(f"Success: {result}")
        return result
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-chapter")
async def api_generate_chapter(req: ChapterRequest):
    """Generate a single chapter"""
    try:
        result = generate_chapter(
            novel_title=req.novel_title,
            genre=req.genre,
            previous_chapters=req.previous_chapters,
            chapter_number=req.chapter_number,
            title=req.title,
            summary=req.summary
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/regenerate-chapter")
async def api_regenerate_chapter(req: RegenerateRequest):
    """Regenerate a chapter with new direction"""
    try:
        result = regenerate_chapter(
            novel_title=req.novel_title,
            genre=req.genre,
            previous_chapters=req.previous_chapters,
            chapter_number=req.chapter_number,
            title=req.title,
            original_summary=req.original_summary,
            new_direction=req.new_direction
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
