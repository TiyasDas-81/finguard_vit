from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Customer, RiskEvent, Transaction

def get_risk_context(customer_id: str, db: Optional[Session] = None) -> dict:
    """
    Retrieve holistic risk assessment, normal behavioral rules, and risk flags for a customer.
    """
    tool_name = "risk_context"
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
        if not customer:
            return {
                "tool": tool_name,
                "success": False,
                "data": None,
                "error": f"Customer {customer_id} not found"
            }

        risk_events = db.query(RiskEvent).filter(RiskEvent.customer_id == customer_id).all()
        suspicious_txns = db.query(Transaction).filter(
            Transaction.customer_id == customer_id,
            Transaction.status == "SUSPICIOUS"
        ).all()

        max_risk_score = max([t.risk_score for t in suspicious_txns], default=0.0)

        events_summary = []
        for re in risk_events:
            events_summary.append({
                "event_id": re.event_id,
                "transaction_id": re.transaction_id,
                "event_type": re.event_type,
                "severity": re.severity,
                "description": re.description
            })

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "customer_id": customer.customer_id,
                "customer_name": customer.name,
                "account_status": customer.account_status,
                "overall_risk_score": max_risk_score,
                "historical_average_txn": customer.avg_txn_amount,
                "normal_transaction_window": f"{customer.normal_start_time}-{customer.normal_end_time}",
                "active_risk_events_count": len(events_summary),
                "risk_events": events_summary
            },
            "error": None
        }
    except Exception as e:
        return {
            "tool": tool_name,
            "success": False,
            "data": None,
            "error": str(e)
        }
    finally:
        if should_close:
            db.close()
