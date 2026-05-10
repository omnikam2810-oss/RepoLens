# RepoLens

RepoLens is an AI-powered GitHub repository analyzer. Paste a public GitHub repository URL and receive a structured, beginner-friendly explanation of the project, its architecture, tech stack, setup flow, features, and improvement opportunities.

## Architecture

- `frontend/` - React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide React
- `backend/` - Node.js, Express.js, GitHub REST API, Google Gemini API
- `docs/` - Product and technical notes

## Quick Start

1. Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Configure environment variables:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start both apps in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Required API Keys

- `GEMINI_API_KEY` is required for AI-generated analysis using `gemini-1.5-flash`.
- `GITHUB_TOKEN` is optional but recommended for higher GitHub API rate limits.
