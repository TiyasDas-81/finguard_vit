"""
Tests for FinGuard Backend Database, Financial Tools, FastAPI Endpoints, and Real ToolAdapter integration.
"""

import os
import sys
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.database.session import SessionLocal, engine, Base
from backend.app.models.orm import Customer, Merchant, Transaction, RiskEvent
from backend.app.models.seed import init_db
from backend.app.tools import (
    get_transaction_history,
    get_spending_analytics,
    get_merchant_analysis,
    get_related_activity,
    get_risk_context,
    get_generic_balance
)
from backend.app.agents.tool_adapter import ToolAdapter
from backend.app.agents.finguard_agent import FinGuardAgent
from backend.app.main import app


class TestBackendIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()
        init_db(cls.db)
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_database_models_and_seed(self):
        cust = self.db.query(Customer).filter(Customer.customer_id == "CUST458").first()
        self.assertIsNotNone(cust)
        self.assertEqual(cust.name, "Aarav Sharma")

        txn = self.db.query(Transaction).filter(Transaction.transaction_id == "TXN10291").first()
        self.assertIsNotNone(txn)
        self.assertEqual(txn.amount, 78000.0)
        self.assertEqual(txn.merchant, "XYZ Electronics")

        re = self.db.query(RiskEvent).filter(RiskEvent.transaction_id == "TXN10291").first()
        self.assertIsNotNone(re)
        self.assertEqual(re.risk_score, 87)
        self.assertEqual(re.risk_level, "HIGH")

    def test_five_financial_tools(self):
        # 1. transaction_history
        res_hist = get_transaction_history("CUST458", db=self.db)
        self.assertTrue(res_hist["success"])
        self.assertGreaterEqual(res_hist["data"]["transaction_count"], 1)

        # 2. spending_analytics
        res_analytics = get_spending_analytics("CUST458", 78000.0, db=self.db)
        self.assertTrue(res_analytics["success"])
        self.assertGreaterEqual(res_analytics["data"]["anomaly_ratio"], 15.0)

        # 3. merchant_analysis
        res_merchant = get_merchant_analysis("XYZ Electronics", "CUST458", db=self.db)
        self.assertTrue(res_merchant["success"])
        self.assertTrue(res_merchant["data"]["is_new_merchant_for_customer"])

        # 4. related_activity
        res_related = get_related_activity("CUST458", db=self.db)
        self.assertTrue(res_related["success"])
        self.assertEqual(res_related["data"]["rapid_transfer_count"], 3)
        self.assertEqual(res_related["data"]["total_rapid_amount"], 195000.0)

        # 5. risk_context
        res_risk = get_risk_context("TXN10291", db=self.db)
        self.assertTrue(res_risk["success"])
        self.assertEqual(res_risk["data"]["risk_score"], 87)

        # 6. generic_balance
        res_bal = get_generic_balance("CUST458", db=self.db)
        self.assertTrue(res_bal["success"])

    def test_real_tool_adapter(self):
        adapter = ToolAdapter(use_mock=False)
        res = adapter.execute_tool("spending_analytics", {"customer_id": "CUST458", "amount": 78000.0})
        self.assertTrue(res.success)
        self.assertEqual(res.status_code, 200)
        self.assertIn("anomaly_ratio", res.output)

    def test_fastapi_endpoints(self):
        # /api/health
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "healthy")

        # /api/alerts
        resp = self.client.get("/api/alerts")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("alerts", resp.json())

        # /api/alerts/TXN10291
        resp = self.client.get("/api/alerts/TXN10291")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["amount"], 78000.0)

        # /api/customers/CUST458
        resp = self.client.get("/api/customers/CUST458")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["name"], "Aarav Sharma")

        # /api/transactions/TXN10291
        resp = self.client.get("/api/transactions/TXN10291")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["merchant"], "XYZ Electronics")

        # POST /api/investigate
        resp = self.client.post("/api/investigate", json={
            "transaction_id": "TXN10291",
            "customer_id": "CUST458",
            "amount": 78000.0,
            "merchant": "XYZ Electronics",
            "timestamp": "02:17 AM",
            "risk_score": 87,
            "use_mock_tools": False
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["trace"]["outcome"], "SUCCESS")


if __name__ == "__main__":
    unittest.main()
