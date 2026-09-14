import json
from fastapi.testclient import TestClient
from backend.app.api.main import app
from backend.app.tools.transaction_history import get_transaction_history
from backend.app.tools.spending_analytics import analyze_spending
from backend.app.tools.merchant_analysis import analyze_merchant
from backend.app.tools.related_activity import find_related_activity
from backend.app.tools.risk_context import get_risk_context

def main():
    print("=" * 60)
    print("VERIFYING TXN10291 & FINANCIAL TOOLS DIRECT INVOCATION")
    print("=" * 60)

    # 1. Tool 1: transaction_history
    t1 = get_transaction_history("CUST458")
    print("\n--- 1. transaction_history('CUST458') ---")
    print(json.dumps(t1, indent=2))

    # 2. Tool 2: spending_analytics
    t2 = analyze_spending("CUST458", transaction_id="TXN10291")
    print("\n--- 2. spending_analytics('CUST458', 'TXN10291') ---")
    print(json.dumps(t2, indent=2))

    # 3. Tool 3: merchant_analysis
    t3 = analyze_merchant("CUST458", "MERCH_XYZ")
    print("\n--- 3. merchant_analysis('CUST458', 'MERCH_XYZ') ---")
    print(json.dumps(t3, indent=2))

    # 4. Tool 4: related_activity
    t4 = find_related_activity("TXN10291")
    print("\n--- 4. related_activity('TXN10291') ---")
    print(json.dumps(t4, indent=2))

    # 5. Tool 5: risk_context
    t5 = get_risk_context("CUST458")
    print("\n--- 5. risk_context('CUST458') ---")
    print(json.dumps(t5, indent=2))

    # 6. Test FastAPI endpoints
    print("\n" + "=" * 60)
    print("VERIFYING FASTAPI API ENDPOINTS VIA HTTP CLIENT")
    print("=" * 60)
    with TestClient(app) as client:
        # GET /api/health
        r_health = client.get("/api/health")
        print(f"\nGET /api/health -> Status: {r_health.status_code}")
        print(r_health.json())

        # GET /api/alerts
        r_alerts = client.get("/api/alerts")
        print(f"\nGET /api/alerts -> Status: {r_alerts.status_code}")
        print(json.dumps(r_alerts.json(), indent=2))

        # GET /api/alerts/TXN10291
        r_alert_id = client.get("/api/alerts/TXN10291")
        print(f"\nGET /api/alerts/TXN10291 -> Status: {r_alert_id.status_code}")
        print(json.dumps(r_alert_id.json(), indent=2))

        # GET /api/customers/CUST458
        r_cust = client.get("/api/customers/CUST458")
        print(f"\nGET /api/customers/CUST458 -> Status: {r_cust.status_code}")
        print(json.dumps(r_cust.json(), indent=2))

        # GET /api/transactions/TXN10291
        r_txn = client.get("/api/transactions/TXN10291")
        print(f"\nGET /api/transactions/TXN10291 -> Status: {r_txn.status_code}")
        print(json.dumps(r_txn.json(), indent=2))

if __name__ == "__main__":
    main()
