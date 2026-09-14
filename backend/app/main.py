"""
Main FastAPI Application Entrypoint for FinGuard AI Financial Investigation Agent.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database.session import SessionLocal, engine, Base
from backend.app.models.seed import init_db
from backend.app.api.routes import router as api_router

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema and seed data on startup."""
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="FinGuard AI Financial Investigation Agent API",
    description="Backend API for FinGuard financial fraud investigation system with PRISM reliability layer.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
