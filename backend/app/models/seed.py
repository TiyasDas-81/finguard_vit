import sys
import os

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

    # 1. Customers
    cust458 = Customer(
        customer_id="CUST458",
        name="Aarav Sharma",
        email="aarav.sharma@example.com",
        risk_rating="HIGH",
        historical_avg_monthly_spend=4300.0,
        spending_profile={
            "avg_transaction": 4300.0,
            "monthly_baseline": 35000.0,
            "usual_categories": ["GROCERY", "UTILITIES", "DINING"]
        }
    )
    db.add(cust458)

    # 2. Merchants
    m1 = Merchant(merchant_id="MCH_XYZ", name="XYZ Electronics", category="ELECTRONICS", risk_tier="HIGH")
    m2 = Merchant(merchant_id="MCH_SUP", name="City Supermarket", category="GROCERY", risk_tier="LOW")
    db.add_all([m1, m2])

    # 3. Historical Baseline Transactions for CUST458 (Average ~ ₹4,300)
    hist_txns = [
        Transaction(transaction_id="TXN10001", customer_id="CUST458", amount=3500.0, merchant="City Supermarket", timestamp="10:30 AM", status="COMPLETED", type="PURCHASE"),
        Transaction(transaction_id="TXN10002", customer_id="CUST458", amount=4200.0, merchant="Power Utility Corp", timestamp="02:15 PM", status="COMPLETED", type="PURCHASE"),
        Transaction(transaction_id="TXN10003", customer_id="CUST458", amount=4800.0, merchant="Metro Fuel Station", timestamp="06:45 PM", status="COMPLETED", type="PURCHASE"),
        Transaction(transaction_id="TXN10004", customer_id="CUST458", amount=4700.0, merchant="Fresh Foods Mart", timestamp="08:20 PM", status="COMPLETED", type="PURCHASE"),
    ]
    db.add_all(hist_txns)

    # 4. Rapid Related Transfers (3 transfers in ~7 mins, total ₹1,95,000)
    rapid_txns = [
        Transaction(transaction_id="TXN10288", customer_id="CUST458", amount=65000.0, merchant="Internal Transfer", timestamp="02:10 AM", status="FLAGGED", type="TRANSFER", recipient="Account-901"),
        Transaction(transaction_id="TXN10289", customer_id="CUST458", amount=65000.0, merchant="Internal Transfer", timestamp="02:13 AM", status="FLAGGED", type="TRANSFER", recipient="Account-902"),
        Transaction(transaction_id="TXN10290", customer_id="CUST458", amount=65000.0, merchant="Internal Transfer", timestamp="02:15 AM", status="FLAGGED", type="TRANSFER", recipient="Account-903"),
    ]
    db.add_all(rapid_txns)

    # 5. Primary Suspicious Transaction TXN10291 (₹78,000 at XYZ Electronics, 02:17 AM)
    suspicious_txn = Transaction(
        transaction_id="TXN10291",
        customer_id="CUST458",
        amount=78000.0,
        merchant="XYZ Electronics",
        timestamp="02:17 AM",
        status="SUSPICIOUS",
        type="PURCHASE"
    )
    db.add(suspicious_txn)

    # 6. Risk Event Record for TXN10291
    risk_event = RiskEvent(
        event_id="RE_10291",
        transaction_id="TXN10291",
        customer_id="CUST458",
        risk_score=87,
        risk_level="HIGH",
        status="SUSPICIOUS",
        flags=["amount_anomaly_18x", "new_merchant", "off_hours_2am", "rapid_transfers_cluster"]
    )
    db.add(risk_event)

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    init_db(db)
    print("Database schema initialized and seed records created successfully.")
    db.close()
