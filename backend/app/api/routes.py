"""
FastAPI Router exposing FinGuard AI Agent endpoints & Database resource queries.
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database.session import get_db, SessionLocal
from backend.app.models.orm import Customer, Merchant, Transaction, RiskEvent
from backend.app.models.seed import init_db as seed_init_db
from backend.app.agents.finguard_agent import FinGuardAgent
from backend.app.agents.tool_adapter import ToolAdapter

router = APIRouter(prefix="/api", tags=["FinGuard AI Agent"])


class InvestigateRequest(BaseModel):
    transaction_id: Optional[str] = "TXN10291"
    customer_id: Optional[str] = "CUST458"
    amount: Optional[float] = 78000.0
    merchant: Optional[str] = "XYZ Electronics"
    timestamp: Optional[str] = "02:17 AM"
    risk_score: Optional[int] = 87
    use_mock_tools: Optional[bool] = False
    force_wrong_tool: Optional[bool] = False


@router.get("/health")
def health_check():
    """Health status check endpoint."""
    return {
        "status": "healthy",
        "service": "FinGuard Financial Investigation Agent API",
        "version": "1.0.0"
    }


@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """List all suspicious risk alert events."""
    risk_events = db.query(RiskEvent).all()
    results = []
    for re in risk_events:
        txn = db.query(Transaction).filter(Transaction.transaction_id == re.transaction_id).first()
        results.append({
            "transaction_id": re.transaction_id,
            "customer_id": re.customer_id,
            "risk_score": re.risk_score,
            "risk_level": re.risk_level,
            "status": re.status,
            "amount": txn.amount if txn else 78000.0,
            "merchant": txn.merchant if txn else "XYZ Electronics",
            "timestamp": txn.timestamp if txn else "02:17 AM",
            "flags": re.flags
        })
    return {"alerts": results, "count": len(results)}


@router.get("/alerts/{transaction_id}")
def get_alert_detail(transaction_id: str, db: Session = Depends(get_db)):
    """Get details for a specific suspicious alert."""
    re = db.query(RiskEvent).filter(RiskEvent.transaction_id == transaction_id).first()
    txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not re and not txn:
        raise HTTPException(status_code=404, detail=f"Alert {transaction_id} not found")

    return {
        "transaction_id": transaction_id,
        "customer_id": re.customer_id if re else (txn.customer_id if txn else "CUST458"),
        "risk_score": re.risk_score if re else 87,
        "risk_level": re.risk_level if re else "HIGH",
        "status": re.status if re else "SUSPICIOUS",
        "amount": txn.amount if txn else 78000.0,
        "merchant": txn.merchant if txn else "XYZ Electronics",
        "timestamp": txn.timestamp if txn else "02:17 AM",
        "flags": re.flags if re else []
    }


@router.get("/customers/{customer_id}")
def get_customer_profile(customer_id: str, db: Session = Depends(get_db)):
    """Get profile and historical spending data for a customer."""
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")

    return {
        "customer_id": customer.customer_id,
        "name": customer.name,
        "email": customer.email,
        "risk_rating": customer.risk_rating,
        "historical_avg_monthly_spend": customer.historical_avg_monthly_spend,
        "spending_profile": customer.spending_profile
    }


@router.get("/transactions/{transaction_id}")
def get_transaction_detail(transaction_id: str, db: Session = Depends(get_db)):
    """Get transaction details."""
    txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")

    return {
        "transaction_id": txn.transaction_id,
        "customer_id": txn.customer_id,
        "amount": txn.amount,
        "merchant": txn.merchant,
        "timestamp": txn.timestamp,
        "status": txn.status,
        "type": txn.type,
        "recipient": txn.recipient
    }


@router.post("/investigate")
def run_investigation_endpoint(req: InvestigateRequest, db: Session = Depends(get_db)):
    """Triggers complete FinGuard AI Agent investigation for an alert."""
    alert_data = {
        "transaction_id": req.transaction_id,
        "customer_id": req.customer_id,
        "amount": req.amount,
        "merchant": req.merchant,
        "timestamp": req.timestamp,
        "risk_score": req.risk_score
    }

    tool_adapter = ToolAdapter(use_mock=req.use_mock_tools)
    agent = FinGuardAgent(tool_adapter=tool_adapter)

    trace = agent.run_investigation(
        alert_data=alert_data,
        force_wrong_tool=req.force_wrong_tool
    )

    return {
        "success": True,
        "trace": trace.to_dict()
    }
