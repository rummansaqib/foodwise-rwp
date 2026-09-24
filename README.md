# FoodWise RWP

**AI-Powered Personalized Food Discovery & Recommendation System for Rawalpindi**
*Final Year Project prototype*

FoodWise helps a user decide what to eat based on budget, group size,
preferences, dietary goals, health restrictions, eating history, restaurant
ratings, distance, and context — not just a restaurant directory.

This repository contains three things:

```
foodwise-rwp/
├── src/            React + TypeScript + Vite + Tailwind frontend (works standalone, no backend needed)
├── backend/        FastAPI + SQLite (or PostgreSQL) backend — real accounts, real database, real AI modules
├── capacitor.config.ts, ANDROID_SETUP.md   Wraps the frontend as a native Android app
```

## Quick start (web app only — zero setup)

```bash
npm install
npm run dev
```

Open the printed localhost URL. Everything works immediately with a
bundled demo dataset (22 restaurants, 180+ menu items, seeded reviews and
history) stored in your browser's localStorage — no backend, no database,
no API keys required. Use the **Prototype Demo Mode** switch in the top
nav to flip between the User app and the Admin dashboard.

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

## Publishing it live (GitHub Pages)

See `GITHUB_DEPLOY.md` for the exact copy-paste steps — a GitHub Actions
workflow (`.github/workflows/deploy.yml`) is already included, so once the
repo is pushed and Pages is turned on, every `git push` auto-deploys to a
shareable `https://<username>.github.io/<repo-name>/` link.

## Adding the real backend (real accounts, real database)

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed_data
uvicorn app.main:app --reload --port 8000
```

Then, in the project root, create `.env` (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8000
```

Restart `npm run dev`. The app detects the backend automatically:
- **Signed in** (via the Account page) → real accounts, real database,
  real saved history/favorites/reviews (backend/app/routers, SQLite by default).
- **Not signed in, or backend unreachable** → falls back to the local demo
  dataset automatically, so the app never breaks.

Demo login once seeded: `demo@foodwise.pk` / `password123`.

Full backend details: `backend/README.md`. Raw SQL schema: `backend/schema.sql`.

## Running it on Android / Android Studio

See `ANDROID_SETUP.md` for the exact commands (`npx cap add android` etc.).
This wraps the same web app into a real Android project you open and run
directly in Android Studio, with or without the backend connected.

## What's real vs. what's a documented simplification

Being upfront about this matters for an FYP defense:

| Area | What it actually is |
|---|---|
| Recommendation engine | Real, running weighted-scoring code (`src/ai/recommendationEngine.ts`, ported 1:1 to `backend/app/ai/recommendation_engine.py`), not a mock. Documented as rules + optimization + a scikit-learn TF-IDF/cosine-similarity personalization signal, structured so a trained ranking model could replace the scoring step later. |
| Budget optimizer | Real greedy constructive algorithm, not hardcoded results — try different budgets/persons and it recomputes. |
| Auth | Real bcrypt password hashing + JWT when the backend is connected. Demo Mode (User/Admin switch) intentionally has no login, matching the project's stated "simplified demonstration mode" scope. |
| Database | Real SQLite (swap `DATABASE_URL` for PostgreSQL any time — see `backend/README.md`) when connected; localStorage when running standalone. |
| Sentiment analysis | Real rule-based aspect sentiment (lexicon + keyword matching), not a trained transformer — documented as swappable for one later. |
| Restaurant dataset | Demo data, clearly labeled as such throughout the UI — not a claim of covering every real Rawalpindi restaurant. |
| Nutrition figures | Demonstration data, labeled as such — not verified nutritional facts. |

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, React
Router — frontend. FastAPI, SQLAlchemy, SQLite/PostgreSQL, scikit-learn,
python-jose, passlib — backend. Capacitor — Android packaging.

## Project structure

```
src/
├── ai/                 Recommendation engine, budget optimizer, diet engine, behavior analyzer, sentiment analyzer
├── components/         Reusable UI (cards, modals, filter panel, nav, etc.)
├── context/            AppContext — role switching, auth, profile, favorites, history, reviews, toasts
├── data/                Demo dataset generators (restaurants, menu items, users, reviews, history)
├── pages/
│   ├── user/            Home, Find Food, Restaurants, Restaurant Details, Health & Diet, History, Favorites, Account, About
│   └── admin/            Dashboard, Restaurants, Menus, Users, Reviews, Analytics, Data Management, Settings
├── services/            storageService (localStorage), apiClient (backend + fallback detection)
└── types/               Shared TypeScript interfaces

backend/
├── app/
│   ├── ai/               Python ports of the same recommendation/budget/diet/behavior/sentiment logic
│   ├── core/             Database engine, security (JWT/bcrypt)
│   ├── models/            SQLAlchemy ORM models
│   ├── routers/           auth, restaurants, recommend, history/favorites, reviews, admin
│   └── seed_data.py       Populates the demo dataset into the real database
└── schema.sql            Raw SQL DDL (for your ER diagram / report)
```

## Deploying to other static hosts

The `VITE_BASE_PATH` build-time variable controls the app's base path for
any static host (GitHub Pages, Netlify, Vercel, S3, etc.):

```bash
VITE_BASE_PATH=/your-sub-path/ npm run build
```

Leave it unset (defaults to `/`) when deploying to your own domain's root.
