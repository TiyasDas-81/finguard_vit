"""
Database session and engine management for FinGuard AI Agent.
Supports PostgreSQL via DATABASE_URL or SQLite fallback.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Default to local SQLite database file if PostgreSQL environment variable is not provided
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    db_path = os.path.join(BASE_DIR, "finguard.db")
    DATABASE_URL = f"sqlite:///{db_path}"

# SQLite requires check_same_thread=False for multithreaded FastAPI access
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for FastAPI endpoints to get DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
