# FoodWise RWP — Backend

Real FastAPI + SQLite (swappable to PostgreSQL) backend: signup/login with
hashed passwords and JWTs, a relational database for restaurants/menus/
users/reviews/history/favorites, and Python ports of the recommendation
engine, budget optimizer, diet-compatibility rules, behavior analyzer and
review sentiment analyzer.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed_data         # creates foodwise.db with 22 restaurants + full menus + a demo account
uvicorn app.main:app --reload --port 8000
```

Open **http://localhost:8000/docs** for interactive Swagger docs covering
every endpoint.

**Demo login:** `demo@foodwise.pk` / `password123` (created by the seed
script) — or sign up a new account through `/auth/signup`.

## Connecting the frontend

In the frontend project root, create `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

The frontend automatically detects whether the backend is reachable. If it
is, it uses real accounts/database data. If not (e.g. you're just running
`npm run dev` with no backend, or testing the built app offline), it falls
back to the bundled local mock dataset so the app still works standalone —
this dual mode matches the FYP proposal's requirement that the prototype
run without any backend, while also supporting the real database mode
you asked for.

## Switching to PostgreSQL

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/foodwise"
pip install psycopg2-binary
python -m app.seed_data
uvicorn app.main:app --reload
```

No other code changes are needed — every query goes through SQLAlchemy.

## Key files

| File | Purpose |
|---|---|
| `app/main.py` | FastAPI app, CORS, router registration |
| `app/models/db_models.py` | SQLAlchemy ORM models (the real schema) |
| `schema.sql` | Equivalent raw SQL DDL, for your report/ER diagram |
| `app/core/security.py` | bcrypt hashing + JWT auth |
| `app/ai/recommendation_engine.py` | Weighted scoring + scikit-learn content-similarity personalization |
| `app/ai/budget_optimizer.py` | Group meal / budget constraint solver |
| `app/ai/diet_engine.py` | Dietary rule checks |
| `app/ai/behavior_analyzer.py` | Repetition/variety detection |
| `app/ai/sentiment_analyzer.py` | Aspect-based review sentiment |
| `app/seed_data.py` | Populates the demo dataset |

## Notes for your FYP report

- The recommendation engine is **transparent weighted scoring** (documented
  in the module docstring) with a scikit-learn **TF-IDF + cosine similarity**
  component that builds a per-user "taste profile" from eating history —
  this is the personalization/"remembering" piece, and it's real, running
  code, not a placeholder.
- Admin endpoints are open (no separate admin login) to match the
  project's specified "simplified User/Admin demonstration mode." A
  production version would add an `is_admin` flag and a real auth check —
  noted directly in `admin_router.py`.
