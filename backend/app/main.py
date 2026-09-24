"""
FoodWise RWP backend entrypoint.

Run locally:
    cd backend
    python -m venv venv && source venv/bin/activate   # Windows: venv\\Scripts\\activate
    pip install -r requirements.txt
    python -m app.seed_data      # creates foodwise.db with demo data (run once)
    uvicorn app.main:app --reload --port 8000

Then open http://localhost:8000/docs for interactive API docs, or point
the frontend's VITE_API_BASE_URL at http://localhost:8000.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import auth_router, restaurants_router, recommend_router, history_router, reviews_router, admin_router

Base.metadata.create_all(bind=engine)  # creates tables if seed_data.py hasn't been run yet

app = FastAPI(
    title="FoodWise RWP API",
    description="AI-powered personalized food discovery and recommendation system for Rawalpindi (FYP backend).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # relaxed for local dev / Android emulator / any static host testing this prototype
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(restaurants_router.router)
app.include_router(recommend_router.router)
app.include_router(history_router.router)
app.include_router(reviews_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "FoodWise RWP API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}
