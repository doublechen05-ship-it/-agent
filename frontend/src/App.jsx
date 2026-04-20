import React, { useState } from 'react'
import { generateOutline, generateChapter, regenerateChapter } from './api'

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px'
  },
  panel: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '20px'
  },
  panelTitle: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    paddingBottom: '8px'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#aaa'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0f0f23',
    color: '#fff',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0f0f23',
    color: '#fff',
    fontSize: '14px'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    width: '100%'
  },
  secondaryButton: {
    background: '#333',
    color: '#fff',
    marginRight: '10px'
  },
  chapterButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    background: '#333',
    color: '#fff',
    marginRight: '8px',
    marginBottom: '8px'
  },
  chapterButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  chapterList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  contentArea: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8',
    fontSize: '15px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#667eea'
  },
  error: {
    color: '#ff6b6b',
    padding: '10px',
    borderRadius: '8px',
    background: 'rgba(255,107,107,0.1)',
    marginTop: '10px'
  },
  regenerateSection: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #333'
  }
}

function App() {
  const [genre, setGenre] = useState('')
  const [outline, setOutline] = useState('')
  const [characters, setCharacters] = useState('')
  const [chapterCount, setChapterCount] = useState(20)

  const [novelTitle, setNovelTitle] = useState('')
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [chapterContent, setChapterContent] = useState('')
  const [regenerateDirection, setRegenerateDirection] = useState('')
  const [generatedChapters, setGeneratedChapters] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getPreviousChaptersText = (currentChapterNum) => {
    const chaptersText = []
    for (let i = 1; i < currentChapterNum; i++) {
      if (generatedChapters[i]) {
        const ch = generatedChapters[i]
        const preview = ch.content.length > 500 ? ch.content.substring(0, 500) + '...' : ch.content
        chaptersText.push(`第${i}章 ${ch.title}:\n${preview}`)
      }
    }
    return chaptersText.length > 0 ? chaptersText.join('\n\n') : '（暂无前文）'
  }

  const handleGenerateOutline = async () => {
    if (!genre || !outline || !characters) {
      setError('请填写所有必填项')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await generateOutline(genre, outline, characters, chapterCount)
      setNovelTitle(result.title)
      setChapters(result.chapters)
      setSelectedChapter(null)
      setChapterContent('')
      setGeneratedChapters({})
    } catch (err) {
      setError(err.response?.data?.detail || '生成大纲失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChapter = async (chapterNum) => {
    setSelectedChapter(chapterNum)
    setError('')

    // 如果章节已经生成过，直接显示缓存内容
    if (generatedChapters[chapterNum]) {
      setChapterContent(generatedChapters[chapterNum].content)
      return
    }

    setLoading(true)
    try {
      const chapterInfo = chapters.find(c => c.number === chapterNum)
      const previousText = getPreviousChaptersText(chapterNum)
      const result = await generateChapter(
        novelTitle,
        genre,
        previousText,
        chapterNum,
        chapterInfo.title,
        chapterInfo.summary
      )
      setChapterContent(result.content)
      setGeneratedChapters(prev => ({ ...prev, [chapterNum]: result }))
    } catch (err) {
      setError(err.response?.data?.detail || '生成章节失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!regenerateDirection.trim()) {
      setError('请输入新的方向描述')
      return
    }
    setLoading(true)
    setError('')
    try {
      const chapterInfo = chapters.find(c => c.number === selectedChapter)
      const previousText = getPreviousChaptersText(selectedChapter)
      const result = await regenerateChapter(
        novelTitle,
        genre,
        previousText,
        selectedChapter,
        chapterInfo.title,
        chapterInfo.summary,
        regenerateDirection
      )
      setChapterContent(result.content)
      setGeneratedChapters(prev => ({ ...prev, [selectedChapter]: result }))
      setRegenerateDirection('')
    } catch (err) {
      setError(err.response?.data?.detail || '重新生成失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNovelTitle('')
    setChapters([])
    setSelectedChapter(null)
    setChapterContent('')
    setRegenerateDirection('')
    setGeneratedChapters({})
    setError('')
  }

  const selectedChapterInfo = chapters.find(c => c.number === selectedChapter)

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>自动写小说 Agent</h1>
        <p>基于 AI 的网络小说创作助手</p>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.mainLayout}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>小说设定</h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>小说类型</label>
            <select
              style={styles.select}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">请选择...</option>
              <option value="科幻">科幻</option>
              <option value="奇幻">奇幻</option>
              <option value="都市">都市</option>
              <option value="悬疑">悬疑</option>
              <option value="武侠">武侠</option>
              <option value="言情">言情</option>
              <option value="历史">历史</option>
              <option value="军事">军事</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>故事大纲 *</label>
            <textarea
              style={styles.textarea}
              placeholder="描述故事的主要背景、情节和冲突..."
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>角色设定 *</label>
            <textarea
              style={styles.textarea}
              placeholder="介绍主要角色：姓名、性格、背景..."
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>章节数量</label>
            <select
              style={styles.select}
              value={chapterCount}
              onChange={(e) => setChapterCount(Number(e.target.value))}
            >
              <option value={10}>10章</option>
              <option value={15}>15章</option>
              <option value={20}>20章</option>
              <option value={25}>25章</option>
              <option value={30}>30章</option>
            </select>
          </div>

          <button
            style={{...styles.button, ...styles.primaryButton, opacity: loading ? 0.6 : 1}}
            onClick={handleGenerateOutline}
            disabled={loading}
          >
            {loading ? '生成中...' : '生成大纲'}
          </button>

          {novelTitle && (
            <button
              style={{...styles.button, ...styles.secondaryButton, marginTop: '10px', width: '100%'}}
              onClick={handleReset}
            >
              重置
            </button>
          )}

          {novelTitle && (
            <div style={{marginTop: '20px'}}>
              <h3 style={{color: '#667eea', marginBottom: '10px'}}>{novelTitle}</h3>
              <div style={styles.chapterList}>
                {chapters.map((ch) => (
                  <button
                    key={ch.number}
                    style={{
                      ...styles.chapterButton,
                      ...(selectedChapter === ch.number ? styles.chapterButtonActive : {}),
                      ...(generatedChapters[ch.number] ? {background: '#2d5a3d'} : {})
                    }}
                    onClick={() => handleSelectChapter(ch.number)}
                  >
                    第{ch.number}章
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>
            {selectedChapterInfo ? `第${selectedChapter}章 ${selectedChapterInfo.title}` : '章节内容'}
          </h2>

          {selectedChapterInfo && (
            <div style={{marginBottom: '15px', color: '#888', fontSize: '14px'}}>
              <strong>本章概述：</strong>{selectedChapterInfo.summary}
            </div>
          )}

          {loading ? (
            <div style={styles.loading}>
              <p>AI 正在创作中，请稍候...</p>
            </div>
          ) : chapterContent ? (
            <>
              <div style={styles.contentArea}>{chapterContent}</div>

              <div style={styles.regenerateSection}>
                <h3 style={{color: '#667eea', marginBottom: '10px'}}>重新生成</h3>
                <textarea
                  style={styles.textarea}
                  placeholder="输入新的方向提示，如：让主角发现敌人的弱点..."
                  value={regenerateDirection}
                  onChange={(e) => setRegenerateDirection(e.target.value)}
                />
                <button
                  style={{...styles.button, ...styles.secondaryButton, marginTop: '10px'}}
                  onClick={handleRegenerate}
                  disabled={loading}
                >
                  重新生成本章
                </button>
              </div>
            </>
          ) : (
            <div style={styles.loading}>
              <p>点击左侧章节开始阅读和创作</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
