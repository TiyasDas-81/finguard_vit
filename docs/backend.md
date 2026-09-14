# FinGuard Backend Foundation Guide (`aryan` branch)

Welcome to the FinGuard Backend Foundation documentation.

## Architecture
The backend is built with Python, FastAPI, SQLAlchemy 2.0, PostgreSQL (with SQLite fallback for zero-config local testing), and Pydantic V2.

```
backend/
├── app/
│   ├── api/
│   │   └── main.py          # FastAPI server routes & CORS configuration
│   ├── database/
│   │   ├── database.py      # SQLAlchemy Engine & SessionLocal setup
│   │   └── seed.py          # Automatic synthetic dataset seeder
│   ├── models/
│   │   ├── models.py        # Customer, Merchant, Transaction, RiskEvent ORM models
│   │   └── schemas.py       # Pydantic schemas & ToolResult standard wrapper
│   └── tools/
│       ├── transaction_history.py
│       ├── spending_analytics.py
│       ├── merchant_analysis.py
│       ├── related_activity.py
│       └── risk_context.py
```

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Database Connection (`.env` or environment variables)**
   - **PostgreSQL**:
     ```bash
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finguard
     ```
   - **SQLite (Default fallback)**:
     ```bash
     DATABASE_URL=sqlite:///./finguard.db
     ```

3. **Run FastAPI Development Server**
   ```bash
   uvicorn backend.app.api.main:app --reload --port 8000
   ```

4. **Database Initialization & Seeding**
   The database tables and demo synthetic financial dataset (`CUST458`, `TXN10291`, etc.) are automatically initialized and seeded on FastAPI application startup.

5. **Running Unit Tests**
   ```bash
   pytest
   ```

