import sys
import os
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from sqlalchemy.orm import Session
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.orm import Customer, Merchant, Transaction, RiskEvent


def init_db(db: Session):
    """Initializes schema and populates demo seed records if missing."""
    Base.metadata.create_all(bind=engine)

    # Check if CUST458 already exists
    existing_cust = db.query(Customer).filter(Customer.customer_id == "CUST458").first()
    if existing_cust:
        return

    # 1. Main Demo Customer CUST458
    cust458 = Customer(
        customer_id="CUST458",
        name="Rahul Sharma",
        email="rahul.sharma@example.com",
        avg_txn_amount=4300.0,
        normal_start_time="08:00",
        normal_end_time="23:00",
        account_status="ACTIVE"
    )
    db.add(cust458)

    # 2. Merchants
    m1 = Merchant(
        merchant_id="MERCH_XYZ",
        name="XYZ Electronics",
        category="Electronics & Gadgets",
        risk_level="HIGH"
    )
    m2 = Merchant(
        merchant_id="MERCH_GROCERY",
        name="Daily Fresh Supermarket",
        category="Groceries",
        risk_level="LOW"
    )
    m3 = Merchant(
        merchant_id="MERCH_CAFE",
        name="Urban Coffee Roasters",
        category="Dining",
        risk_level="LOW"
    )
    db.add_all([m1, m2, m3])
    db.commit()

    # Target datetime: fixed reference time today at 02:17 AM
    now = datetime.now(timezone.utc).replace(hour=2, minute=17, second=0, microsecond=0)

    # 3. Main Suspicious Transaction TXN10291 (₹78,000 at XYZ Electronics, 02:17 AM)
    suspicious_txn = Transaction(
        transaction_id="TXN10291",
        customer_id="CUST458",
        merchant_id="MERCH_XYZ",
        amount=78000.0,
        status="SUSPICIOUS",
        risk_score=87.0,
        timestamp=now,
        location="Mumbai, IN",
        channel="ONLINE",
        recipient_account="ACC_UNKNOWN_99"
    )
    db.add(suspicious_txn)

    # 4. Rapid Related Transfers (3 transfers in ~7 mins, total ₹1,95,000)
    rapid_txns = [
        Transaction(
            transaction_id="TXN10288",
            customer_id="CUST458",
            merchant_id=None,
            amount=65000.0,
            status="COMPLETED",
            risk_score=72.0,
            timestamp=now - timedelta(minutes=7),
            location="Mumbai, IN",
            channel="ONLINE",
            recipient_account="ACC_REL_01"
        ),
        Transaction(
            transaction_id="TXN10289",
            customer_id="CUST458",
            merchant_id=None,
            amount=65000.0,
            status="COMPLETED",
            risk_score=75.0,
            timestamp=now - timedelta(minutes=4),
            location="Mumbai, IN",
            channel="ONLINE",
            recipient_account="ACC_REL_02"
        ),
        Transaction(
            transaction_id="TXN10290",
            customer_id="CUST458",
            merchant_id=None,
            amount=65000.0,
            status="COMPLETED",
            risk_score=78.0,
            timestamp=now - timedelta(minutes=2),
            location="Mumbai, IN",
            channel="ONLINE",
            recipient_account="ACC_REL_03"
        ),
    ]
    db.add_all(rapid_txns)

    # 5. Historical Normal Baseline Transactions for CUST458 (~₹4,300 average)
    hist_txns = [
        Transaction(
            transaction_id="TXN00101",
            customer_id="CUST458",
            merchant_id="MERCH_GROCERY",
            amount=4100.0,
            status="COMPLETED",
            risk_score=2.0,
            timestamp=now - timedelta(days=1, hours=-8),
            location="Mumbai, IN",
            channel="POS"
        ),
        Transaction(
            transaction_id="TXN00102",
            customer_id="CUST458",
            merchant_id="MERCH_CAFE",
            amount=4500.0,
            status="COMPLETED",
            risk_score=1.0,
            timestamp=now - timedelta(days=2, hours=-12),
            location="Mumbai, IN",
            channel="POS"
        ),
        Transaction(
            transaction_id="TXN00103",
            customer_id="CUST458",
            merchant_id="MERCH_GROCERY",
            amount=4300.0,
            status="COMPLETED",
            risk_score=3.0,
            timestamp=now - timedelta(days=3, hours=-10),
            location="Mumbai, IN",
            channel="POS"
        ),
    ]
    db.add_all(hist_txns)

    # 6. Risk Events for TXN10291
    risk_events = [
        RiskEvent(
            event_id="RE_101",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="HIGH_AMOUNT",
            severity="CRITICAL",
            description="Transaction amount ₹78,000 is ~18x customer's historical average of ₹4,300."
        ),
        RiskEvent(
            event_id="RE_102",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="UNUSUAL_TIME",
            severity="HIGH",
            description="Transaction occurred at 02:17 AM, outside normal window (08:00 AM - 11:00 PM)."
        ),
        RiskEvent(
            event_id="RE_103",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="UNSEEN_MERCHANT",
            severity="MEDIUM",
            description="Merchant XYZ Electronics has never been used by CUST458 previously."
        ),
        RiskEvent(
            event_id="RE_104",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="RAPID_TRANSFERS",
            severity="CRITICAL",
            description="Part of 3 rapid related transfers totaling ₹1,95,000 within 7 minutes."
        ),
    ]
    db.add_all(risk_events)

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    init_db(db)
    print("Database schema initialized and seed records created successfully.")
    db.close()
