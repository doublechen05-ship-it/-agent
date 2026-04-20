# 自动写小说 Agent

基于 AI 的网络小说创作助手，使用 React + FastAPI + Claude API 构建。

## 技术栈

- **前端**: React 18 + Vite
- **后端**: FastAPI + Python
- **AI**: Claude API (claude-sonnet-4-20250514)

## 项目结构

```
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── App.jsx           # 主应用组件
│   │   ├── main.jsx         # 入口文件
│   │   └── api.js           # API 调用
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  # FastAPI 后端
│   ├── main.py              # API 入口
│   ├── novel_agent.py       # 小说生成逻辑
│   ├── prompts.py           # Prompt 模板
│   └── requirements.txt
└── CLAUDE.md
```

## 启动方式

### 1. 后端启动

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 3. 环境变量

后端需要设置 `ANTHROPIC_API_KEY` 环境变量：

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

## API 端点

- `POST /api/generate-outline` - 生成大纲和目录
- `POST /api/generate-chapter` - 生成单章
- `POST /api/regenerate-chapter` - 重新生成（支持调整方向）
- `GET /api/novel-state` - 获取当前小说状态
- `POST /api/reset` - 重置小说状态
