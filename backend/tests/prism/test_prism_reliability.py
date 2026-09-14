"""
Unit and integration tests for PRISM Reliability Layer.
Runs 100% offline without external LLM API dependencies.
"""

import unittest
from backend.app.agents.finguard_agent import FinGuardAgent
from backend.app.prism.observer import PrismObserver
from backend.app.prism.evaluator import PrismEvaluator
from backend.app.prism.failure_detector import FailureDetector
from backend.app.prism.diagnostician import PrismDiagnostician
from backend.app.prism.remediation import PrismRemediation
from backend.app.prism.validator import PrismValidator


class TestPrismReliability(unittest.TestCase):

    def setUp(self):
        self.alert_data = {
            "transaction_id": "TXN10291",
            "customer_id": "CUST458",
            "amount": 78000,
            "merchant": "XYZ Electronics",
            "timestamp": "02:17 AM",
            "risk_score": 87
        }
        self.agent = FinGuardAgent(llm_mode="mock")
        self.observer = PrismObserver()
        self.evaluator = PrismEvaluator()
        self.detector = FailureDetector()
        self.diagnostician = PrismDiagnostician()
        self.remediation = PrismRemediation()
        self.validator = PrismValidator()

    def test_1_prism_observer(self):
        trace = self.agent.run_investigation(self.alert_data, run_id="OBS_TEST")
        observed_trace = self.observer.observe(trace)
        self.assertEqual(observed_trace.run_id, "OBS_TEST")
        self.assertEqual(observed_trace.transaction_id, "TXN10291")

    def test_2_tool_selection_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        failed_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=True)

        normal_score = self.evaluator.evaluate_tool_selection_correctness(normal_trace)
        failed_score = self.evaluator.evaluate_tool_selection_correctness(failed_trace)

        self.assertTrue(normal_score.passed)
        self.assertEqual(normal_score.percentage, 100)
        self.assertFalse(failed_score.passed)
        self.assertEqual(failed_score.percentage, 0)

    def test_3_evidence_completeness_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        score = self.evaluator.evaluate_evidence_completeness(normal_trace)
        self.assertTrue(score.passed)
        self.assertTrue(score.percentage >= 80)

    def test_4_evidence_grounding_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        score = self.evaluator.evaluate_evidence_grounding(normal_trace)
        self.assertTrue(score.passed)
        self.assertEqual(score.percentage, 100)

    def test_5_goal_completion_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        failed_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=True)

        normal_score = self.evaluator.evaluate_goal_completion(normal_trace)
        failed_score = self.evaluator.evaluate_goal_completion(failed_trace)

        self.assertTrue(normal_score.passed)
        self.assertEqual(normal_score.percentage, 100)
        self.assertFalse(failed_score.passed)
        self.assertEqual(failed_score.percentage, 0)

    def test_6_context_preservation_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        score = self.evaluator.evaluate_context_preservation(normal_trace)
        self.assertTrue(score.passed)

    def test_7_report_quality_evaluation(self):
        normal_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=False)
        score = self.evaluator.evaluate_report_quality(normal_trace)
        self.assertTrue(score.passed)

    def test_8_wrong_tool_failure_and_http_200_distinction(self):
        failed_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=True)
        # Check tool execution returned HTTP 200 OK
        generic_balance_tc = [tc for tc in failed_trace.tool_calls if tc["tool_name"] == "generic_balance"][0]
        self.assertEqual(generic_balance_tc["status_code"], 200)
        self.assertTrue(generic_balance_tc["success"])

        # Detect failure via PRISM
        res = self.detector.detect_failure(failed_trace)
        self.assertTrue(res.failure_detected)
        self.assertEqual(res.failure_type, "WRONG_TOOL_SELECTION")
        self.assertTrue(res.tool_success)
        self.assertFalse(res.task_success)

    def test_9_diagnosis(self):
        failed_trace = self.agent.run_investigation(self.alert_data, force_wrong_tool=True)
        failure_res = self.detector.detect_failure(failed_trace)
        diagnosis = self.diagnostician.diagnose_failure(failure_res, failed_trace)

        self.assertEqual(diagnosis.failure_type, "WRONG_TOOL_SELECTION")
        self.assertIn("generic_balance", diagnosis.root_cause)
        self.assertIn("transaction_history", diagnosis.recommendation)

    def test_10_remediation_and_new_trace_creation(self):
        failed_trace = self.agent.run_investigation(self.alert_data, run_id="RUN001", force_wrong_tool=True)
        failure_res = self.detector.detect_failure(failed_trace)
        diagnosis = self.diagnostician.diagnose_failure(failure_res, failed_trace)
        policy_override = self.remediation.remediate(diagnosis)

        rerun_trace = self.remediation.rerun_investigation(
            agent=self.agent,
            alert_data=self.alert_data,
            policy_override=policy_override,
            new_run_id="RUN002"
        )

        self.assertNotEqual(failed_trace.run_id, rerun_trace.run_id)
        self.assertEqual(failed_trace.run_id, "RUN001")
        self.assertEqual(rerun_trace.run_id, "RUN002")
        self.assertEqual(failed_trace.outcome, "FAILED")
        self.assertEqual(rerun_trace.outcome, "SUCCESS")

    def test_11_validation(self):
        failed_trace = self.agent.run_investigation(self.alert_data, run_id="RUN001", force_wrong_tool=True)
        failure_res = self.detector.detect_failure(failed_trace)
        diagnosis = self.diagnostician.diagnose_failure(failure_res, failed_trace)
        policy_override = self.remediation.remediate(diagnosis)

        rerun_trace = self.remediation.rerun_investigation(
            agent=self.agent,
            alert_data=self.alert_data,
            policy_override=policy_override,
            new_run_id="RUN002"
        )

        validation_result = self.validator.validate_result(rerun_trace)
        self.assertTrue(validation_result.validated)
        self.assertTrue(validation_result.goal_completed)
        self.assertTrue(validation_result.evidence_complete)
        self.assertTrue(validation_result.tool_selection_correct)

    def test_12_full_pipeline_scenario(self):
        # 1. NORMAL
        t1 = self.agent.run_investigation(self.alert_data, run_id="RUN_NORMAL")
        rep1 = self.evaluator.evaluate_all(t1)
        self.assertTrue(rep1.overall_passed)

        # 2. FAILURE
        t2 = self.agent.run_investigation(self.alert_data, run_id="RUN_FAILURE", force_wrong_tool=True)
        det = self.detector.detect_failure(t2)
        self.assertTrue(det.failure_detected)
        self.assertEqual(det.failure_type, "WRONG_TOOL_SELECTION")

        # 3. DIAGNOSIS
        diag = self.diagnostician.diagnose_failure(det, t2)
        self.assertEqual(diag.failure_type, "WRONG_TOOL_SELECTION")

        # 4. REMEDIATION
        override = self.remediation.remediate(diag)
        t3 = self.remediation.rerun_investigation(self.agent, self.alert_data, override, new_run_id="RUN_RERUN")
        self.assertEqual(t3.outcome, "SUCCESS")

        # 5. VALIDATION
        val = self.validator.validate_result(t3)
        self.assertTrue(val.validated)


if __name__ == "__main__":
    unittest.main()
