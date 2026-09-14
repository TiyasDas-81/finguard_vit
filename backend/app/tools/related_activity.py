from typing import Optional
from datetime import timedelta
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Transaction

def find_related_activity(transaction_id: str, window_minutes: int = 15, db: Optional[Session] = None) -> dict:
    """
    Detect rapid consecutive/related transactions surrounding a given transaction.
    """
    tool_name = "related_activity"
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        target_txn = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
        if not target_txn:
            return {
                "tool": tool_name,
                "success": False,
                "data": None,
                "error": f"Transaction {transaction_id} not found"
            }

        start_time = target_txn.timestamp - timedelta(minutes=window_minutes)
        end_time = target_txn.timestamp + timedelta(minutes=window_minutes)

        related_txns = db.query(Transaction).filter(
            Transaction.customer_id == target_txn.customer_id,
            Transaction.timestamp >= start_time,
            Transaction.timestamp <= end_time
        ).order_by(Transaction.timestamp.asc()).all()

        rapid_transfers = [t for t in related_txns if t.transaction_id != transaction_id]
        total_rapid_amount = sum(t.amount for t in rapid_transfers)

        # Time range calculation
        if rapid_transfers:
            time_diff_seconds = abs((rapid_transfers[-1].timestamp - rapid_transfers[0].timestamp).total_seconds())
            time_span_minutes = round(time_diff_seconds / 60.0, 1)
        else:
            time_span_minutes = 0.0

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "target_transaction_id": transaction_id,
                "customer_id": target_txn.customer_id,
                "rapid_transfers_count": len(rapid_transfers),
                "total_rapid_transfers_amount": total_rapid_amount,
                "time_span_minutes": time_span_minutes,
                "summary": f"{len(rapid_transfers)} rapid related transfers totaling ₹{total_rapid_amount:,.2f} within approximately {time_span_minutes} minutes.",
                "related_transactions": [
                    {
                        "transaction_id": t.transaction_id,
                        "amount": t.amount,
                        "timestamp": t.timestamp.isoformat(),
                        "time": t.timestamp.strftime("%I:%M %p"),
                        "recipient_account": t.recipient_account
                    } for t in rapid_transfers
                ]
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
