from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Customer, Transaction, Merchant

def get_transaction_history(customer_id: str, limit: int = 50, db: Optional[Session] = None) -> dict:
    """
    Fetch customer transaction history, average transaction amount, and normal transaction window.
    """
    tool_name = "transaction_history"
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

        txns = db.query(Transaction).filter(Transaction.customer_id == customer_id)\
                 .order_by(Transaction.timestamp.desc()).limit(limit).all()

        txn_list = []
        for t in txns:
            merchant_name = t.merchant.name if t.merchant else "Direct Transfer / Unknown"
            txn_list.append({
                "transaction_id": t.transaction_id,
                "amount": t.amount,
                "status": t.status,
                "risk_score": t.risk_score,
                "timestamp": t.timestamp.isoformat(),
                "time": t.timestamp.strftime("%I:%M %p"),
                "merchant_id": t.merchant_id,
                "merchant_name": merchant_name,
                "channel": t.channel,
                "recipient_account": t.recipient_account
            })

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "customer_id": customer.customer_id,
                "customer_name": customer.name,
                "average_transaction": customer.avg_txn_amount,
                "normal_transaction_window": f"{customer.normal_start_time}-{customer.normal_end_time}",
                "total_transactions": len(txn_list),
                "transactions": txn_list
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
