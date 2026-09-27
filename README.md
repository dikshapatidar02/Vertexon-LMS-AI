# Vertexon Learning Technologies — LMS-AI (Frontend Application)

Vertexon LMS-AI is an enterprise-grade Learning Management System with an integrated course-grounded AI Tutor.

---

## 🌟 Key Features

### 🎓 Student Workspace
- **Interactive Course Player**: Video playback, speed controls (0.5x - 2x), timestamped notes, bookmarks, and resource downloads.
- **Embedded AI Tutor (RAG)**: Course-scoped AI chat with grounded source citations, explanation depth modes (*Beginner*, *Intermediate*, *Advanced*), lecture transcript summaries, flashcards, and personalized study plans.
- **Assessment & Certification**: Interactive quizzes, assignment file submissions, and downloadable PDF certificates.
- **Gamification**: 7-day learning streaks, milestone badges (*First Milestone*, *Quiz Master*, *AI Scholar*), and leaderboard.

### 👨‍🏫 Instructor Workspace
- **Instructor Dashboard**: Analytics on per-lecture drop-off, average quiz scores, and learner progress.
- **Course Authoring Wizard**: Module & lecture management with video upload and transcript ingestion.
- **AI Quiz Generator**: Auto-generate quiz drafts from lecture transcripts.

### 🛡️ Admin Governance
- **Platform Analytics**: Daily Active Users (DAU), enrollment counts, and system metrics.
- **User Management**: Role assignment (*Student*, *Instructor*, *Admin*).
- **Course Approval Queue**: Review and approve/reject instructor course submissions.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+) & npm

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:3000` in your browser.

---

## 🤖 AI Service Architecture

The application uses a modular AI service abstraction located at `src/services/ai/`:

- **`LocalRagProvider`**: Default intelligent local RAG engine performing semantic keyword search over lecture transcripts with grounded academic citations and depth-level control (Beginner, Intermediate, Advanced).
- **`OpenAIProvider` & `AnthropicProvider`**: Configurable client-side providers that directly connect to OpenAI or Anthropic API keys if configured in environment variables or user settings.
