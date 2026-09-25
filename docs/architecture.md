# System Architecture Document — Vertexon LMS-AI

## Overview
Vertexon LMS-AI is an AI-augmented Learning Management System architected for enterprise SaaS scalability. It integrates conventional video lecture hosting and quiz assessment workflows with an embedded RAG (Retrieval-Augmented Generation) AI Tutor.

## High-Level Architecture Diagram

```
 +-------------------------------------------------------+
 |                     React 18 SPA                      |
 |  (Student Workspace / Instructor / Admin Governance)  |
 +---------------------------+---------------------------+
                             | HTTPS / REST
                             v
 +-------------------------------------------------------+
 |               Node.js Express Core Service            |
 |    (Auth, Courses, Progress, Quizzes, Gamification)   |
 +-------------+-----------------------------+-----------+
               |                             |
               v                             v
 +--------------------------+  +--------------------------+
 | PostgreSQL + pgvector    |  | Python FastAPI AI        |
 | (Relational System of    |  | (RAG Pipeline,           |
 |  Record & Embeddings)    |  |  Summaries, Flashcards)  |
 +--------------------------+  +--------------------------+
```

## Core Modules & Data Flow

1. **Authentication & RBAC**: JWT access & refresh token rotation with strict role middleware (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
2. **AI Tutor RAG Engine**: Course-scoped document chunking & similarity search using 1536-dimensional vector embeddings, grounded responses, and source citation badges.
3. **Course Player**: Progressive video delivery with playback speed adjustments (0.5x-2x), timestamped notes, bookmarks, and automated certificate PDF generation upon 100% completion.
4. **Gamification & Analytics**: 7-day learning streaks, milestone badges, per-lecture drop-off tracking, and course performance charts.
