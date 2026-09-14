import pytest
from fastapi.testclient import TestClient
from backend.app.api.main import app
from backend.app.database.database import Base, engine, SessionLocal
from backend.app.database.seed import seed_data

from backend.app.tools.transaction_history import get_transaction_history
from backend.app.tools.spending_analytics import analyze_spending
from backend.app.tools.merchant_analysis import analyze_merchant
from backend.app.tools.related_activity import find_related_activity
from backend.app.tools.risk_context import get_risk_context

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    seed_data()

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

# 1. API Endpoints Tests
def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_get_alerts(client):
    res = client.get("/api/alerts")
    assert res.status_code == 200
    alerts = res.json()
    assert isinstance(alerts, list)
    assert len(alerts) >= 1
    txn_ids = [a["transaction_id"] for a in alerts]
    assert "TXN10291" in txn_ids

def test_get_alert_by_id(client):
    res = client.get("/api/alerts/TXN10291")
    assert res.status_code == 200
    data = res.json()
    assert data["transaction_id"] == "TXN10291"
    assert data["customer_id"] == "CUST458"
    assert data["amount"] == 78000.0
    assert data["status"] == "SUSPICIOUS"
    assert data["risk_score"] == 87.0

def test_get_customer(client):
    res = client.get("/api/customers/CUST458")
    assert res.status_code == 200
    data = res.json()
    assert data["customer_id"] == "CUST458"
    assert data["avg_txn_amount"] == 4300.0
    assert data["normal_transaction_window"] == "08:00-23:00"

def test_get_transaction(client):
    res = client.get("/api/transactions/TXN10291")
    assert res.status_code == 200
    data = res.json()
    assert data["transaction_id"] == "TXN10291"
    assert data["amount"] == 78000.0
    assert data["merchant_name"] == "XYZ Electronics"

# 2. Financial Tools Tests (checking standard response contract)
def test_tool_transaction_history():
    res = get_transaction_history("CUST458")
    assert res["tool"] == "transaction_history"
    assert res["success"] is True
    assert res["error"] is None
    data = res["data"]
    assert data["customer_id"] == "CUST458"
    assert data["average_transaction"] == 4300.0
    assert len(data["transactions"]) >= 1

def test_tool_spending_analytics():
    res = analyze_spending("CUST458")
    assert res["tool"] == "spending_analytics"
    assert res["success"] is True
    assert res["error"] is None
    data = res["data"]
    assert data["historical_average"] == 4300.0
    assert data["highest_transaction_amount"] == 78000.0
    assert data["anomaly_multiplier"] > 15.0

def test_tool_merchant_analysis():
    res = analyze_merchant("CUST458", "MERCH_XYZ")
    assert res["tool"] == "merchant_analysis"
    assert res["success"] is True
    assert res["error"] is None
    data = res["data"]
    assert data["merchant_id"] == "MERCH_XYZ"
    assert data["merchant_name"] == "XYZ Electronics"
    assert data["is_first_time_merchant"] is True
    assert data["prior_transactions_count"] == 0

def test_tool_related_activity():
    res = find_related_activity("TXN10291")
    assert res["tool"] == "related_activity"
    assert res["success"] is True
    assert res["error"] is None
    data = res["data"]
    assert data["target_transaction_id"] == "TXN10291"
    assert data["rapid_transfers_count"] == 3
    assert data["total_rapid_transfers_amount"] == 195000.0

def test_tool_risk_context():
    res = get_risk_context("CUST458")
    assert res["tool"] == "risk_context"
    assert res["success"] is True
    assert res["error"] is None
    data = res["data"]
    assert data["customer_id"] == "CUST458"
    assert data["overall_risk_score"] == 87.0
    assert data["active_risk_events_count"] == 4

# 3. Dynamic Data-Driven & Edge Cases Tests (proving no hardcoding)
def test_dynamic_spending_analytics_mutation():
    from backend.app.models.models import Transaction
    db = SessionLocal()
    try:
        # Add a new high-value transaction
        new_txn = Transaction(
            transaction_id="TXN_TEST_DYNAMIC",
            customer_id="CUST458",
            merchant_id="MERCH_GROCERY",
            amount=86000.0,
            status="COMPLETED",
            risk_score=10.0
        )
        db.add(new_txn)
        db.commit()

        # Spending analytics should now dynamically compute against the new amount
        res = analyze_spending("CUST458", transaction_id="TXN_TEST_DYNAMIC", db=db)
        assert res["success"] is True
        assert res["data"]["target_transaction_amount"] == 86000.0
        assert res["data"]["anomaly_multiplier"] == 20.0
    finally:
        # Cleanup
        db.query(Transaction).filter(Transaction.transaction_id == "TXN_TEST_DYNAMIC").delete()
        db.commit()
        db.close()

def test_dynamic_merchant_analysis_mutation():
    from backend.app.models.models import Transaction
    db = SessionLocal()
    try:
        # Add a prior transaction with XYZ Electronics
        prior_txn = Transaction(
            transaction_id="TXN_PRIOR_MERCH",
            customer_id="CUST458",
            merchant_id="MERCH_XYZ",
            amount=5000.0,
            status="COMPLETED",
            risk_score=5.0
        )
        db.add(prior_txn)
        db.commit()

        # Merchant analysis should now reflect known merchant
        res = analyze_merchant("CUST458", "MERCH_XYZ", db=db)
        assert res["success"] is True
        assert res["data"]["is_first_time_merchant"] is False
        assert res["data"]["prior_transactions_count"] == 1
        assert res["data"]["risk_flag"] == "KNOWN_MERCHANT"
    finally:
        db.query(Transaction).filter(Transaction.transaction_id == "TXN_PRIOR_MERCH").delete()
        db.commit()
        db.close()

def test_tool_error_handling_non_existent():
    # Customer not found
    res1 = get_transaction_history("NON_EXISTENT_CUST")
    assert res1["success"] is False
    assert res1["data"] is None
    assert "not found" in res1["error"]

    # Transaction not found in related activity
    res2 = find_related_activity("NON_EXISTENT_TXN")
    assert res2["success"] is False
    assert res2["data"] is None
    assert "not found" in res2["error"]

def test_api_404_error_handling(client):
    res_alert = client.get("/api/alerts/NON_EXISTENT_ALERT")
    assert res_alert.status_code == 404
    assert "not found" in res_alert.json()["detail"]

    res_cust = client.get("/api/customers/NON_EXISTENT_CUST")
    assert res_cust.status_code == 404

    res_txn = client.get("/api/transactions/NON_EXISTENT_TXN")
    assert res_txn.status_code == 404

