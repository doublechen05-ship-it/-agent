# -*- coding: utf-8 -*-
"""
Novel generation agent - core logic for interacting with Claude API
"""
import json
import os
import httpx
from prompts import (
    OUTLINE_GENERATION_PROMPT,
    CHAPTER_GENERATION_PROMPT,
    CHAPTER_REGENERATION_PROMPT
)

API_ENDPOINT = os.getenv("ANTHROPIC_API_ENDPOINT", "https://api.anthropic.com")
API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def generate_outline(genre: str, outline: str, characters: str, chapter_count: int = 20) -> dict:
    """Generate novel outline and chapter list"""
    prompt = OUTLINE_GENERATION_PROMPT.format(
        genre=genre,
        outline=outline,
        characters=characters,
        chapter_count=chapter_count
    )

    response = httpx.post(
        f"{API_ENDPOINT}/v1/messages",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "api-key": API_KEY,
            "anthropic-version": "2023-06-01"
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=120.0,
        verify=False
    )

    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

    data = response.json()
    print(f"API Response: {data}")  # Debug
    # Find the text content (not thinking)
    content = ""
    for item in data.get("content", []):
        if item.get("type") == "text":
            content = item.get("text", "").strip()
            break
    if not content:
        raise Exception(f"No text content in response: {data}")

    try:
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        result = json.loads(content)
        return {
            "title": result.get("title"),
            "chapters": result.get("chapters", [])
        }
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}\nResponse: {content}")


def generate_chapter(novel_title: str, genre: str, previous_chapters: str, chapter_number: int, title: str, summary: str) -> dict:
    """Generate a single chapter"""
    prompt = CHAPTER_GENERATION_PROMPT.format(
        novel_title=novel_title,
        genre=genre,
        generated_chapters=previous_chapters,
        number=chapter_number,
        title=title,
        summary=summary
    )

    response = httpx.post(
        f"{API_ENDPOINT}/v1/messages",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "api-key": API_KEY,
            "anthropic-version": "2023-06-01"
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 8192,
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=120.0,
        verify=False
    )

    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

    data = response.json()
    print(f"API Response: {data}")  # Debug
    # Find the text content (not thinking)
    content = ""
    for item in data.get("content", []):
        if item.get("type") == "text":
            content = item.get("text", "").strip()
            break
    if not content:
        raise Exception(f"No text content in response: {data}")

    return {
        "number": chapter_number,
        "title": title,
        "summary": summary,
        "content": content
    }


def regenerate_chapter(novel_title: str, genre: str, previous_chapters: str, chapter_number: int, title: str, original_summary: str, new_direction: str) -> dict:
    """Regenerate a chapter with a new direction"""
    prompt = CHAPTER_REGENERATION_PROMPT.format(
        novel_title=novel_title,
        genre=genre,
        generated_chapters=previous_chapters,
        number=chapter_number,
        title=title,
        original_summary=original_summary,
        new_direction=new_direction
    )

    response = httpx.post(
        f"{API_ENDPOINT}/v1/messages",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "api-key": API_KEY,
            "anthropic-version": "2023-06-01"
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 8192,
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=120.0,
        verify=False
    )

    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

    data = response.json()
    print(f"API Response: {data}")  # Debug
    # Find the text content (not thinking)
    content = ""
    for item in data.get("content", []):
        if item.get("type") == "text":
            content = item.get("text", "").strip()
            break
    if not content:
        raise Exception(f"No text content in response: {data}")

    return {
        "number": chapter_number,
        "title": title,
        "summary": original_summary,
        "content": content,
        "direction_hint": new_direction
    }
