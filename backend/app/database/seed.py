from datetime import datetime, timedelta, timezone
from backend.app.database.database import SessionLocal, Base, engine
from backend.app.models.models import Customer, Merchant, Transaction, RiskEvent

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_cust = db.query(Customer).filter(Customer.customer_id == "CUST458").first()
        if existing_cust:
            return

        # 1. Main Demo Customer CUST458
        customer = Customer(
            customer_id="CUST458",
            name="Rahul Sharma",
            email="rahul.sharma@example.com",
            avg_txn_amount=4300.0,
            normal_start_time="08:00",
            normal_end_time="23:00",
            account_status="ACTIVE"
        )
        db.add(customer)

        # 2. Merchants
        xyz_merchant = Merchant(
            merchant_id="MERCH_XYZ",
            name="XYZ Electronics",
            category="Electronics & Gadgets",
            risk_level="HIGH"
        )
        grocery_merchant = Merchant(
            merchant_id="MERCH_GROCERY",
            name="Daily Fresh Supermarket",
            category="Groceries",
            risk_level="LOW"
        )
        cafe_merchant = Merchant(
            merchant_id="MERCH_CAFE",
            name="Urban Coffee Roasters",
            category="Dining",
            risk_level="LOW"
        )
        db.add_all([xyz_merchant, grocery_merchant, cafe_merchant])
        db.commit()

        # Target datetime for suspicious event: 02:17 AM today (UTC)
        now = datetime.now(timezone.utc).replace(hour=2, minute=17, second=0, microsecond=0)

        # 3. Main Suspicious Transaction TXN10291
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

        # 4. Rapid related transfers within ~7 mins leading up to 02:17 AM (Total ₹1,95,000)
        # Txn 1: 02:10 AM - ₹65,000
        rapid_1 = Transaction(
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
        )
        # Txn 2: 02:13 AM - ₹65,000
        rapid_2 = Transaction(
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
        )
        # Txn 3: 02:15 AM - ₹65,000
        rapid_3 = Transaction(
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
        )
        db.add_all([rapid_1, rapid_2, rapid_3])

        # 5. Historical Normal Transactions for CUST458 (~₹4,300 average, during normal hours)
        hist_1 = Transaction(
            transaction_id="TXN00101",
            customer_id="CUST458",
            merchant_id="MERCH_GROCERY",
            amount=4100.0,
            status="COMPLETED",
            risk_score=2.0,
            timestamp=now - timedelta(days=1, hours=-8), # ~10:00 AM yesterday
            location="Mumbai, IN",
            channel="POS"
        )
        hist_2 = Transaction(
            transaction_id="TXN00102",
            customer_id="CUST458",
            merchant_id="MERCH_CAFE",
            amount=4500.0,
            status="COMPLETED",
            risk_score=1.0,
            timestamp=now - timedelta(days=2, hours=-12), # ~02:00 PM 2 days ago
            location="Mumbai, IN",
            channel="POS"
        )
        hist_3 = Transaction(
            transaction_id="TXN00103",
            customer_id="CUST458",
            merchant_id="MERCH_GROCERY",
            amount=4300.0,
            status="COMPLETED",
            risk_score=3.0,
            timestamp=now - timedelta(days=3, hours=-10), # ~12:00 PM 3 days ago
            location="Mumbai, IN",
            channel="POS"
        )
        db.add_all([hist_1, hist_2, hist_3])

        # 6. Risk Events for TXN10291
        risk_event_1 = RiskEvent(
            event_id="RE_101",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="HIGH_AMOUNT",
            severity="CRITICAL",
            description="Transaction amount ₹78,000 is ~18x customer's historical average of ₹4,300."
        )
        risk_event_2 = RiskEvent(
            event_id="RE_102",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="UNUSUAL_TIME",
            severity="HIGH",
            description="Transaction occurred at 02:17 AM, outside normal window (08:00 AM - 11:00 PM)."
        )
        risk_event_3 = RiskEvent(
            event_id="RE_103",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="UNSEEN_MERCHANT",
            severity="MEDIUM",
            description="Merchant XYZ Electronics has never been used by CUST458 previously."
        )
        risk_event_4 = RiskEvent(
            event_id="RE_104",
            transaction_id="TXN10291",
            customer_id="CUST458",
            event_type="RAPID_TRANSFERS",
            severity="CRITICAL",
            description="Part of 3 rapid related transfers totaling ₹1,95,000 within 7 minutes."
        )
        db.add_all([risk_event_1, risk_event_2, risk_event_3, risk_event_4])

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
