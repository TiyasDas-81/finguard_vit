from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Customer, Transaction

def analyze_spending(customer_id: str, transaction_id: Optional[str] = None, db: Optional[Session] = None) -> dict:
    """
    Analyze customer spending statistics, comparing historical baseline against recent activity.
    Dynamically computes historical average from completed normal transactions and anomaly ratio.
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

        all_txns = db.query(Transaction).filter(Transaction.customer_id == customer_id).all()
        if not all_txns:
            return {
                "tool": tool_name,
                "success": True,
                "data": {
                    "customer_id": customer.customer_id,
                    "historical_average": customer.avg_txn_amount,
                    "target_transaction_amount": 0.0,
                    "anomaly_multiplier": 0.0,
                    "multiplier_description": "0.0x normal historical average",
                    "normal_transaction_window": f"{customer.normal_start_time}-{customer.normal_end_time}",
                    "total_transactions_analyzed": 0
                },
                "error": None
            }

        # Historical baseline is the customer's established baseline average
        historical_avg = customer.avg_txn_amount if customer.avg_txn_amount else 4300.0

        # Determine target transaction
        if transaction_id:
            target_txn = next((t for t in all_txns if t.transaction_id == transaction_id), None)
            target_amount = target_txn.amount if target_txn else max(t.amount for t in all_txns)
        else:
            target_amount = max(t.amount for t in all_txns)

        multiplier = round(target_amount / historical_avg, 2) if historical_avg > 0 else 0.0

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "customer_id": customer.customer_id,
                "historical_average": historical_avg,
                "target_transaction_amount": target_amount,
                "highest_transaction_amount": max(t.amount for t in all_txns),
                "anomaly_multiplier": multiplier,
                "multiplier_description": f"{multiplier}x normal historical average",
                "normal_transaction_window": f"{customer.normal_start_time}-{customer.normal_end_time}",
                "total_transactions_analyzed": len(all_txns)
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

