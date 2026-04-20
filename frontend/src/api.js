import axios from 'axios'

const API_BASE = 'http://localhost:8000'

export const generateOutline = async (genre, outline, characters, chapterCount = 20) => {
  const response = await axios.post(`${API_BASE}/api/generate-outline`, {
    genre,
    outline,
    characters,
    chapter_count: chapterCount
  })
  return response.data
}

export const generateChapter = async (novelTitle, genre, previousChapters, chapterNumber, title, summary) => {
  const response = await axios.post(`${API_BASE}/api/generate-chapter`, {
    novel_title: novelTitle,
    genre: genre,
    previous_chapters: previousChapters,
    chapter_number: chapterNumber,
    title: title,
    summary: summary
  })
  return response.data
}

export const regenerateChapter = async (novelTitle, genre, previousChapters, chapterNumber, title, originalSummary, newDirection) => {
  const response = await axios.post(`${API_BASE}/api/regenerate-chapter`, {
    novel_title: novelTitle,
    genre: genre,
    previous_chapters: previousChapters,
    chapter_number: chapterNumber,
    title: title,
    original_summary: originalSummary,
    new_direction: newDirection
  })
  return response.data
}
