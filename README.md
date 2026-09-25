# Vertexon Learning Technologies — LMS-AI (Learning Management System with AI Tutor)

![Vertexon LMS-AI](https://images.unsplash.com/photo-1516116211223-47a12980df96?w=1200&auto=format&fit=crop&q=80)

Vertexon LMS-AI is an enterprise-grade Learning Management System powered by Retrieval-Augmented Generation (RAG). It combines traditional LMS capabilities — course authoring, video streaming, quizzes, assignments, certification, and gamification — with a course-grounded AI tutor.

---

## 🌟 Key Features

### 🎓 Student Experience
- **Interactive Course Player**: Video playback with speed control (0.5x - 2x), timestamped notes, bookmarks, and downloadable resources.
- **Embedded AI Tutor (RAG)**: Course-scoped AI chat with source citations, explanation depth modes (*Beginner*, *Intermediate*, *Advanced*), transcript summaries, flashcard revision decks, and personalized adaptive study plans.
- **Assessment & Certification**: MCQ, multi-select, and short answer auto-grading quizzes, assignment file submissions, and downloadable PDF certificates upon 100% completion.
- **Gamification**: 7-day learning streaks, milestone badges (*First Milestone*, *Quiz Master*, *AI Scholar*), and leaderboard.

### 👨‍🏫 Instructor Experience
- **Instructor Dashboard**: Analytics on per-lecture learner drop-off, average quiz scores, and time-on-task.
- **Course Authoring Wizard**: Step-by-step metadata, module, and lecture management with video upload and transcript ingestion.
- **AI-Powered Quiz Generator**: Auto-generate quiz drafts from lecture transcripts with instructor review/approval modal.
- **Assignment Grading**: Rubric-based assignment evaluation and student feedback dispatch.

### 🛡️ Admin Governance
- **Platform Analytics**: Daily Active Users (DAU), total revenue, enrollment counts, and system health metrics.
- **User Management**: Role assignment (*Student*, *Instructor*, *Admin*) and account suspension toggles.
- **Course Approval Queue**: Review and approve/reject instructor course submissions before public listing.
- **Content Moderation**: Flagged post review and moderation actions.

---

## 🔑 Seed Demo Accounts

Quick persona switching bar is embedded in the top header. You can also log in directly using:

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Ananya Sharma | `ananya@example.com` | `SecurePass123` |
| **Instructor** | Rohit Verma | `rohit@example.com` | `SecurePass123` |
| **Admin** | Meera Patel | `meera@example.com` | `SecurePass123` |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+) & npm
- Python (3.11+)

### 1. Running Frontend & Backend Locally

```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm install
npm run dev

# Terminal 2: Frontend App (Port 3000)
cd frontend
npm install
npm run dev

# Terminal 3: AI Service (Port 8000)
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

To spin up PostgreSQL (with pgvector), Redis, MinIO, Backend, AI Service, and Frontend with Docker Compose:

```bash
docker-compose -f infra/docker-compose.yml up --build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Axios, React Router v6, Recharts, Lucide Icons.
- **Backend Core**: Node.js, Express, TypeScript, JWT (Access + Refresh), bcryptjs, Zod, Rate Limiter, Helmet.
- **AI Service**: Python, FastAPI, NumPy, Anthropic/OpenAI API abstraction, pgvector similarity search.
- **Infrastructure**: Docker, Docker Compose, NGINX, GitHub Actions CI.

---

## 📄 Documentation

- [PRD Document](docs/prd.md)
- [OpenAPI Specification](docs/api-spec.yaml)
- [System Architecture](docs/architecture.md)
