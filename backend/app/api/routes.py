"""
FastAPI Router exposing FinGuard AI Agent endpoints & Database resource queries.
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

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
    # Group by transaction_id
    txn_ids = list(set([re.transaction_id for re in risk_events]))
    results = []
    
    for tid in txn_ids:
        re_list = [r for r in risk_events if r.transaction_id == tid]
        first_re = re_list[0]
        txn = db.query(Transaction).filter(Transaction.transaction_id == tid).first()
        cust = db.query(Customer).filter(Customer.customer_id == first_re.customer_id).first()
        m_name = txn.merchant.name if (txn and txn.merchant) else "XYZ Electronics"
        t_time = txn.timestamp.strftime("%I:%M %p") if (txn and isinstance(txn.timestamp, datetime)) else "02:17 AM"
        t_iso = txn.timestamp.isoformat() if (txn and isinstance(txn.timestamp, datetime)) else "2026-09-14T02:17:00"

        results.append({
            "transaction_id": tid,
            "customer_id": first_re.customer_id,
            "customer_name": cust.name if cust else "Rahul Sharma",
            "amount": txn.amount if txn else 78000.0,
            "merchant_name": m_name,
            "merchant": m_name,
            "time": t_time,
            "timestamp": t_iso,
            "risk_score": txn.risk_score if txn else 87.0,
            "risk_level": first_re.severity if first_re else "HIGH",
            "status": txn.status if txn else "SUSPICIOUS",
            "flags": [r.event_type for r in re_list],
            "reasons": [r.description for r in re_list]
        })

    return {"alerts": results, "count": len(results)}


@router.get("/alerts/{transaction_id}")
def get_alert_detail(transaction_id: str, db: Session = Depends(get_db)):
    """Get details for a specific suspicious alert."""
    re_list = db.query(RiskEvent).filter(RiskEvent.transaction_id == transaction_id).all()
    txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    
    if not re_list and not txn:
        raise HTTPException(status_code=404, detail=f"Alert {transaction_id} not found")

    first_re = re_list[0] if re_list else None
    cust_id = first_re.customer_id if first_re else (txn.customer_id if txn else "CUST458")
    cust = db.query(Customer).filter(Customer.customer_id == cust_id).first()
    m_name = txn.merchant.name if (txn and txn.merchant) else "XYZ Electronics"
    t_time = txn.timestamp.strftime("%I:%M %p") if (txn and isinstance(txn.timestamp, datetime)) else "02:17 AM"
    t_iso = txn.timestamp.isoformat() if (txn and isinstance(txn.timestamp, datetime)) else "2026-09-14T02:17:00"

    return {
        "transaction_id": transaction_id,
        "customer_id": cust_id,
        "customer_name": cust.name if cust else "Rahul Sharma",
        "amount": txn.amount if txn else 78000.0,
        "merchant_name": m_name,
        "merchant": m_name,
        "time": t_time,
        "timestamp": t_iso,
        "risk_score": txn.risk_score if txn else 87.0,
        "risk_level": first_re.severity if first_re else "HIGH",
        "status": txn.status if txn else "SUSPICIOUS",
        "flags": [r.event_type for r in re_list] if re_list else ["HIGH_AMOUNT", "UNUSUAL_TIME", "UNSEEN_MERCHANT", "RAPID_TRANSFERS"],
        "reasons": [r.description for r in re_list] if re_list else [
            "Transaction amount ₹78,000 is ~18x customer's historical average of ₹4,300.",
            "Transaction occurred at 02:17 AM, outside normal window (08:00 AM - 11:00 PM).",
            "Merchant XYZ Electronics has never been used by CUST458 previously.",
            "Part of 3 rapid related transfers totaling ₹1,95,000 within 7 minutes."
        ]
    }


@router.get("/customers/{customer_id}")
def get_customer_profile(customer_id: str, db: Session = Depends(get_db)):
    """Get profile and historical spending data for a customer."""
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")

    norm_window = f"{customer.normal_start_time}-{customer.normal_end_time}"
    return {
        "customer_id": customer.customer_id,
        "name": customer.name,
        "email": customer.email,
        "avg_txn_amount": customer.avg_txn_amount,
        "normal_transaction_window": norm_window,
        "normal_start_time": customer.normal_start_time,
        "normal_end_time": customer.normal_end_time,
        "account_status": customer.account_status,
        "risk_rating": "HIGH",
        "historical_avg_monthly_spend": customer.avg_txn_amount,
        "spending_profile": {
            "avg_transaction": customer.avg_txn_amount,
            "monthly_baseline": customer.avg_txn_amount * 8,
            "usual_categories": ["GROCERY", "UTILITIES", "DINING"]
        }
    }


@router.get("/transactions/{transaction_id}")
def get_transaction_detail(transaction_id: str, db: Session = Depends(get_db)):
    """Get transaction details."""
    txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")

    m_name = txn.merchant.name if txn.merchant else (txn.recipient_account or "Direct Transfer")
    t_iso = txn.timestamp.isoformat() if isinstance(txn.timestamp, datetime) else str(txn.timestamp)
    t_type = "TRANSFER" if txn.recipient_account and not txn.merchant_id else "PURCHASE"

    return {
        "transaction_id": txn.transaction_id,
        "customer_id": txn.customer_id,
        "merchant_id": txn.merchant_id,
        "merchant_name": m_name,
        "merchant": m_name,
        "amount": txn.amount,
        "status": txn.status,
        "risk_score": txn.risk_score,
        "timestamp": t_iso,
        "location": txn.location,
        "channel": txn.channel,
        "recipient_account": txn.recipient_account,
        "recipient": txn.recipient_account,
        "type": t_type
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

