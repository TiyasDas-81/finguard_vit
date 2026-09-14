# FinGuard Backend Foundation Guide (`aryan` branch)

Welcome to the FinGuard Backend Foundation documentation.

## Architecture
The backend is built with Python, FastAPI, SQLAlchemy, and SQLite.

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

2. **Run FastAPI Development Server**
   ```bash
   uvicorn backend.app.api.main:app --reload --port 8000
   ```

3. **Database Initialization**
   The SQLite database (`finguard.db`) is automatically initialized and seeded with synthetic data upon server startup.

4. **Running Unit Tests**
   ```bash
   pytest
   ```
