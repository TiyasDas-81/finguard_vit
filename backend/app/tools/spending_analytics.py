from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Customer, Transaction

def analyze_spending(customer_id: str, db: Optional[Session] = None) -> dict:
    """
    Analyze customer spending statistics, comparing historical baseline against recent activity.
    """
    tool_name = "spending_analytics"
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

        txns = db.query(Transaction).filter(Transaction.customer_id == customer_id).all()
        if not txns:
            return {
                "tool": tool_name,
                "success": True,
                "data": {
                    "customer_id": customer.customer_id,
                    "historical_average": customer.avg_txn_amount,
                    "recent_highest_transaction": 0.0,
                    "anomaly_multiplier": 0.0,
                    "is_high_risk_amount": False
                },
                "error": None
            }

        amounts = [t.amount for t in txns]
        max_amount = max(amounts)
        historical_avg = customer.avg_txn_amount if customer.avg_txn_amount else 4300.0
        multiplier = round(max_amount / historical_avg, 2) if historical_avg > 0 else 0.0

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "customer_id": customer.customer_id,
                "historical_average": historical_avg,
                "highest_transaction_amount": max_amount,
                "anomaly_multiplier": multiplier,
                "multiplier_description": f"{multiplier}x normal historical average",
                "normal_transaction_window": f"{customer.normal_start_time}-{customer.normal_end_time}"
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
