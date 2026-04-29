```markdown


# CampusPulse Clark

### Your 3am study buddy.
**Clark University AI assistant that never sleeps, never judges, and always knows the answer.**

*Asked at 3am. Answered in 2 seconds. Cited from Clark's official website.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-C00000?style=for-the-badge)](https://campuspulse-les5oihbb-bhavethra2401-1876s-projects.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/BhavethraBaabu/campuspulse)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Monthly Cost](https://img.shields.io/badge/Monthly%20Cost-%240-22c55e?style=for-the-badge)](https://github.com/BhavethraBaabu/campuspulse)

</div>

---

## The Problem

You are a Clark student. It is 3am. Your thesis is due tomorrow.

You open Clark's website. You click 7 links. You find a PDF from 2019. You give up.

> I missed a Clark deadline because I could not find it on the website. 45 minutes searching. Answer buried 6 clicks deep in a PDF. I built CampusPulse so no Clark student ever does that again.

**Clark's website always had the answers. I just turned it from something you click through — into something you talk to.**

---

## What is CampusPulse?

CampusPulse is an AI-powered campus assistant built exclusively for Clark University students. It knows every Clark policy, deadline, office, and contact — and answers in plain English with a direct source link in under 2 seconds.

**Just ask. Get the answer. Move on.**

---

## Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | 285 Clark pages indexed · cited answers · under 2 seconds |
| 🎤 **Voice Input** | Speak your question, get your answer |
| 📅 **Live Deadlines** | Real-time countdowns for add/drop, OPT, graduation |
| 🎓 **Course Recommender** | AI-powered course matching based on your interests and goals |
| 📊 **GPA Calculator** | Clark official 4.0 scale · instant results |
| ✉️ **Email Templates** | Late withdrawal, grade appeal, OPT, financial aid |
| 📚 **Study Planner** | Finals, Registration, Graduation, OPT timelines |
| 🌍 **Multi-language** | English, Spanish, Hindi, Chinese, Arabic, French |
| 👥 **Staff Directory** | Every office, every person, every email |
| 🗺️ **Campus Map** | Every building with directions |
| 📈 **Analytics Dashboard** | Real-time usage stats and top questions |

---

## Live Stats

```
285     Clark pages indexed
< 2s    Average response time  
6       Languages supported
10      Tools built
$0      Monthly infrastructure cost
```

---

## Tech Stack

```
Frontend      Next.js 14 · TypeScript · Tailwind CSS · Framer Motion
AI Model      Groq Llama 3.1 8B Instant
Vector DB     Qdrant Cloud (384 dimensions, cosine similarity)
Embeddings    sentence-transformers all-MiniLM-L6-v2
Auth          Supabase + Google OAuth
Database      Supabase PostgreSQL
Deployment    Vercel (auto-deploy on every GitHub push)
Monthly Cost  $0
```

---

## How It Works

```
Clark Website (285 pages)
        ↓
   Python Scraper
        ↓
  Semantic Chunking
        ↓
 sentence-transformers
   (384-dim vectors)
        ↓
    Qdrant Cloud
   Vector Database
        ↓
  Student asks question
        ↓
  Cosine Similarity Search
  (Top 4 relevant chunks)
        ↓
   Groq Llama 3.1 8B
    (RAG generation)
        ↓
  Cited answer in ~1.8s
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+ (for data pipeline)
- Accounts: Supabase, Qdrant Cloud, Groq

### Installation

```bash
# Clone the repo
git clone https://github.com/BhavethraBaabu/campuspulse.git
cd campuspulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=clark_chunks
```

### Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### Data Pipeline (optional — already indexed)

```bash
cd backend
pip install -r requirements.txt

# Scrape Clark pages
python scraper.py

# Embed and index into Qdrant
python embed_and_index.py
```

---

## Project Structure

```
campuspulse/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Public landing page
│   │   ├── ask/               # AI chat interface
│   │   ├── home/              # Post-login dashboard
│   │   ├── courses/           # AI course recommender
│   │   ├── deadlines/         # Live countdown timers
│   │   ├── gpa/               # GPA calculator
│   │   ├── email/             # Email templates
│   │   ├── planner/           # Study planner
│   │   ├── directory/         # Staff directory
│   │   ├── map/               # Campus map
│   │   ├── dashboard/         # Analytics
│   │   ├── try/               # 3 free questions (no signup)
│   │   └── api/ask/           # RAG API endpoint
│   └── components/
│       └── ui/
│           ├── animated-ai-chat.tsx
│           ├── animated-footer.tsx
│           ├── neon-button.tsx
│           ├── sparkles.tsx
│           └── wireframe-dotted-globe.tsx
├── backend/
│   ├── scraper.py
│   └── embed_and_index.py
└── data/
    └── clark_chunks.json
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/ask` | AI chat with sidebar and voice input |
| `/try` | 3 free questions — no signup required |
| `/home` | Personalized dashboard after login |
| `/courses` | AI course recommender |
| `/deadlines` | Live deadline countdowns |
| `/gpa` | GPA calculator |
| `/email` | Email template generator |
| `/planner` | Study planner |
| `/directory` | Staff directory |
| `/map` | Campus map |
| `/dashboard` | Usage analytics |

---

## Origin Story

First semester. Registration opens at 7am. I'm at my desk at 6:45 — panicking.

I want to take Machine Learning. I don't know if my background qualifies. I don't know what else fits my goals.

I spend 40 minutes clicking through Clark's website and still don't have a clear answer.

That's not a content problem. Clark has the content. That's an interface problem.

**Interface problems are solvable. So I solved it.**

---

## Built By

**Bhavethra Baabu** · CS Grad Student · Clark University · Class of 2026

---

<div align="center">

**CampusPulse · Clark University · Not officially affiliated · Student project**

*Built with ❤️ at 3am because Clark's website made me do it*

</div>
```
