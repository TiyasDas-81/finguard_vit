from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.models import Customer, Merchant, Transaction

def analyze_merchant(customer_id: str, merchant_id: str, db: Optional[Session] = None) -> dict:
    """
    Check customer's prior transaction history with a specific merchant.
    """
    tool_name = "merchant_analysis"
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

        merchant = db.query(Merchant).filter(Merchant.merchant_id == merchant_id).first()
        merchant_name = merchant.name if merchant else merchant_id

        # Query past transactions prior to current suspicious txn or all completed
        prior_txns = db.query(Transaction).filter(
            Transaction.customer_id == customer_id,
            Transaction.merchant_id == merchant_id,
            Transaction.status != "SUSPICIOUS"
        ).all()

        prior_count = len(prior_txns)
        is_first_time = (prior_count == 0)

        return {
            "tool": tool_name,
            "success": True,
            "data": {
                "customer_id": customer_id,
                "merchant_id": merchant_id,
                "merchant_name": merchant_name,
                "merchant_category": merchant.category if merchant else "Unknown",
                "prior_transactions_count": prior_count,
                "is_first_time_merchant": is_first_time,
                "risk_flag": "NEW_MERCHANT_FOR_CUSTOMER" if is_first_time else "KNOWN_MERCHANT"
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
