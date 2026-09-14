"""
Unit tests for FinGuard AI Agent components and workflow.
Runs 100% offline without external LLM API dependencies.
"""

import unittest
from backend.app.agents.models import AlertInput, ToolResult, EvidenceItem, InvestigationResult, InvestigationTrace
from backend.app.agents.tool_adapter import ToolAdapter
from backend.app.agents.planner import Planner
from backend.app.agents.tool_selector import ToolSelector
from backend.app.agents.investigator import Investigator
from backend.app.agents.report_generator import ReportGenerator
from backend.app.agents.finguard_agent import FinGuardAgent


class TestAgentWorkflow(unittest.TestCase):

    def setUp(self):
        self.alert_data = {
            "transaction_id": "TXN10291",
            "customer_id": "CUST458",
            "amount": 78000,
            "merchant": "XYZ Electronics",
            "timestamp": "02:17 AM",
            "risk_score": 87
        }
        self.alert_input = AlertInput(**self.alert_data)

    def test_1_alert_understanding(self):
        planner = Planner()
        understanding = planner.understand_alert(self.alert_input)
        self.assertEqual(understanding["transaction_id"], "TXN10291")
        self.assertIn("HIGH_RISK_SCORE", understanding["risk_flags"])
        self.assertIn("HIGH_TRANSACTION_AMOUNT", understanding["risk_flags"])

    def test_2_investigation_planning(self):
        planner = Planner()
        understanding = planner.understand_alert(self.alert_input)
        plan = planner.create_investigation_plan(self.alert_input, understanding)
        self.assertEqual(plan["transaction_id"], "TXN10291")
        self.assertIn("amount_anomaly", plan["required_evidence"])
        self.assertEqual(len(plan["goals"]), 4)

    def test_3_tool_selection(self):
        selector = ToolSelector()
        plan = {"goals": []}
        selected = selector.select_tools(plan, force_wrong_tool=False)
        self.assertIn("transaction_history", selected)
        self.assertIn("spending_analytics", selected)

    def test_4_tool_adapter_contract(self):
        adapter = ToolAdapter(use_mock=True)
        res = adapter.execute_tool("transaction_history", {"customer_id": "CUST458"})
        self.assertIsInstance(res, ToolResult)
        self.assertTrue(res.success)
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(res.output)
        self.assertIsNone(res.error)

    def test_5_evidence_extraction(self):
        investigator = Investigator()
        adapter = ToolAdapter(use_mock=True)
        tool_results = investigator.execute_investigation(["spending_analytics", "merchant_analysis"], self.alert_input, adapter)
        evidence = investigator.analyze_evidence(tool_results)
        self.assertTrue(len(evidence) >= 2)
        types = {e.type for e in evidence}
        self.assertIn("amount_anomaly", types)

    def test_6_report_generation(self):
        generator = ReportGenerator()
        evidence_items = [
            EvidenceItem(type="amount_anomaly", description="18x historical average", source="spending_analytics")
        ]
        report = generator.generate_report(self.alert_input, evidence_items)
        self.assertIsInstance(report, InvestigationResult)
        self.assertEqual(report.risk_level, "HIGH")
        self.assertEqual(report.recommendation, "Requires Human Review")

    def test_7_trace_generation(self):
        agent = FinGuardAgent(llm_mode="mock")
        trace = agent.run_investigation(self.alert_data, run_id="TEST_RUN_01")
        self.assertIsInstance(trace, InvestigationTrace)
        self.assertEqual(trace.run_id, "TEST_RUN_01")
        self.assertEqual(len(trace.steps), 7)
        self.assertTrue(len(trace.tool_calls) > 0)
        self.assertIsNotNone(trace.final_result)


if __name__ == "__main__":
    unittest.main()
