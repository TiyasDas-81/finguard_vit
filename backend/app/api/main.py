from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager

from backend.app.database.database import get_db, engine, Base
from backend.app.database.seed import seed_data
from backend.app.models.models import Transaction, Customer, Merchant, RiskEvent
from backend.app.models.schemas import CustomerResponse, TransactionResponse, AlertResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto db creation and seed synthetic data on startup
    Base.metadata.create_all(bind=engine)
    seed_data()
    yield

app = FastAPI(
    title="FinGuard Financial Backend API",
    description="Backend Foundation for FinGuard Risk & Fraud Detection",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/alerts", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    suspicious_txns = db.query(Transaction).filter(Transaction.status == "SUSPICIOUS").all()
    alerts = []
    for txn in suspicious_txns:
        customer = db.query(Customer).filter(Customer.customer_id == txn.customer_id).first()
        merchant = db.query(Merchant).filter(Merchant.merchant_id == txn.merchant_id).first() if txn.merchant_id else None
        risk_events = db.query(RiskEvent).filter(RiskEvent.transaction_id == txn.transaction_id).all()
        
        reasons = [re.description for re in risk_events]

        alerts.append(AlertResponse(
            transaction_id=txn.transaction_id,
            customer_id=txn.customer_id,
            customer_name=customer.name if customer else "Unknown",
            amount=txn.amount,
            merchant_name=merchant.name if merchant else "N/A",
            time=txn.timestamp.strftime("%I:%M %p"),
            risk_score=txn.risk_score,
            status=txn.status,
            reasons=reasons
        ))
    return alerts

@app.get("/api/alerts/{transaction_id}", response_model=AlertResponse)
def get_alert_by_id(transaction_id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(
        Transaction.transaction_id == transaction_id,
        Transaction.status == "SUSPICIOUS"
    ).first()
    
    if not txn:
        raise HTTPException(status_code=404, detail=f"Alert transaction {transaction_id} not found")

    customer = db.query(Customer).filter(Customer.customer_id == txn.customer_id).first()
    merchant = db.query(Merchant).filter(Merchant.merchant_id == txn.merchant_id).first() if txn.merchant_id else None
    risk_events = db.query(RiskEvent).filter(RiskEvent.transaction_id == txn.transaction_id).all()

    reasons = [re.description for re in risk_events]

    return AlertResponse(
        transaction_id=txn.transaction_id,
        customer_id=txn.customer_id,
        customer_name=customer.name if customer else "Unknown",
        amount=txn.amount,
        merchant_name=merchant.name if merchant else "N/A",
        time=txn.timestamp.strftime("%I:%M %p"),
        risk_score=txn.risk_score,
        status=txn.status,
        reasons=reasons
    )

@app.get("/api/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")

    return CustomerResponse(
        customer_id=customer.customer_id,
        name=customer.name,
        email=customer.email,
        avg_txn_amount=customer.avg_txn_amount,
        normal_transaction_window=f"{customer.normal_start_time}-{customer.normal_end_time}",
        account_status=customer.account_status
    )

@app.get("/api/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")

    merchant_name = txn.merchant.name if txn.merchant else None

    return TransactionResponse(
        transaction_id=txn.transaction_id,
        customer_id=txn.customer_id,
        merchant_id=txn.merchant_id,
        merchant_name=merchant_name,
        amount=txn.amount,
        status=txn.status,
        risk_score=txn.risk_score,
        timestamp=txn.timestamp,
        location=txn.location,
        channel=txn.channel,
        recipient_account=txn.recipient_account
    )
