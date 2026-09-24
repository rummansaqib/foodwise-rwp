"""
Database connection setup.

Uses SQLite by default (zero-config, file-based) so the backend runs with
no external services -- exactly what's needed to test locally / on a phone
emulator. To move to PostgreSQL for production, just change DATABASE_URL,
e.g.:

    DATABASE_URL=postgresql://user:pass@localhost:5432/foodwise

No other code needs to change because everything goes through SQLAlchemy.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./foodwise.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
