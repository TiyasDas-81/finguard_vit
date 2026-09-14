"""
Unit and integration tests for External BlockConvey PRISM Live Tracing integration.
Runs 100% offline and verifies graceful tracer behavior.
"""

import os
import unittest
from backend.app.agents.finguard_agent import FinGuardAgent
from backend.app.agents.prism_tracer import ExternalPrismTracer, PRISMTRACE_AVAILABLE


class TestExternalPrismTracing(unittest.TestCase):

    def setUp(self):
        self.alert_data = {
            "transaction_id": "TXN10291",
            "customer_id": "CUST458",
            "amount": 78000,
            "merchant": "XYZ Electronics",
            "timestamp": "02:17 AM",
            "risk_score": 87
        }

    def test_1_tracer_disabled_when_no_api_key(self):
        tracer = ExternalPrismTracer(api_key=None)
        self.assertFalse(tracer.is_enabled())
        # Verify send_trace returns None gracefully without error
        agent = FinGuardAgent(llm_mode="mock")
        trace = agent.run_investigation(self.alert_data, run_id="TEST_NO_KEY")
        res = tracer.send_trace(trace)
        self.assertIsNone(res)

    def test_2_tracer_initialization_with_mock_credentials(self):
        tracer = ExternalPrismTracer(
            api_key="pt-sk-testkey12345",
            project_id="finguard-test-project",
            host="https://api.prism.blockconvey.com"
        )
        if PRISMTRACE_AVAILABLE:
            self.assertTrue(tracer.is_enabled())
            self.assertIsNotNone(tracer.client)

    def test_3_agent_execution_with_external_tracer(self):
        agent = FinGuardAgent(llm_mode="mock")
        trace = agent.run_investigation(self.alert_data, run_id="TEST_EXTERNAL_TRACE")
        self.assertIsNotNone(trace)
        self.assertEqual(trace.transaction_id, "TXN10291")
        self.assertEqual(len(trace.steps), 7)


if __name__ == "__main__":
    unittest.main()
