"""
Standalone End-to-End Demo Script for FinGuard AI Agent & PRISM Reliability Layer.
Runs completely offline without external APIs.
Demonstrates normal execution, failure scenario (TOOL SUCCESS != TASK SUCCESS), diagnosis, remediation, re-run, and validation.
"""

import sys
import json
import os

# Ensure backend package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from backend.app.agents.finguard_agent import FinGuardAgent
from backend.app.prism.evaluator import PrismEvaluator
from backend.app.prism.failure_detector import FailureDetector
from backend.app.prism.diagnostician import PrismDiagnostician
from backend.app.prism.remediation import PrismRemediation
from backend.app.prism.validator import PrismValidator


def run_demo():
    print("==================================================")
    print("       FINGUARD AI AGENT & PRISM DEMO             ")
    print("==================================================")

    alert_data = {
        "transaction_id": "TXN10291",
        "customer_id": "CUST458",
        "amount": 78000,
        "merchant": "XYZ Electronics",
        "timestamp": "02:17 AM",
        "risk_score": 87
    }

    agent = FinGuardAgent(llm_mode="mock")
    evaluator = PrismEvaluator()
    detector = FailureDetector()
    diagnostician = PrismDiagnostician()
    remediation = PrismRemediation()
    validator = PrismValidator()

    # ----------------------------------------------------
    # 1. NORMAL INVESTIGATION
    # ----------------------------------------------------
    print("\n------------------------------------------------")
    print("1. NORMAL INVESTIGATION")
    print("------------------------------------------------")
    print(f"Transaction ID: {alert_data['transaction_id']}")
    print(f"Customer ID:    {alert_data['customer_id']}")
    print(f"Amount:         ${alert_data['amount']}")
    print(f"Merchant:       {alert_data['merchant']}")
    print(f"Risk Score:     {alert_data['risk_score']}/100\n")

    normal_trace = agent.run_investigation(alert_data, run_id="RUN001_NORMAL", force_wrong_tool=False)

    for step in normal_trace.steps:
        print(f"[{step['name']}] [OK] {step['description']}")

    normal_eval = evaluator.evaluate_all(normal_trace)
    print("\nPRISM EVALUATION:")
    print(f"  Tool Selection Score:    {normal_eval.tool_selection_correctness.percentage}%")
    print(f"  Evidence Completeness:   {normal_eval.evidence_completeness.percentage}%")
    print(f"  Evidence Grounding:      {normal_eval.evidence_grounding.percentage}%")
    print(f"  Goal Completion Score:   {normal_eval.goal_completion.percentage}%")
    print(f"  Context Preservation:    {normal_eval.context_preservation.percentage}%")
    print(f"  Report Quality:          {normal_eval.report_quality.percentage}%")
    print(f"  OVERALL RESULT:          {'PASS' if normal_eval.overall_passed else 'FAIL'}")

    # ----------------------------------------------------
    # 2. FAILURE SIMULATION (TOOL SUCCESS != TASK SUCCESS)
    # ----------------------------------------------------
    print("\n------------------------------------------------")
    print("2. FAILURE SIMULATION (WRONG TOOL SELECTION)")
    print("------------------------------------------------")
    print("Forcing agent tool selection: generic_balance")

    failed_trace = agent.run_investigation(alert_data, run_id="RUN001_FAILED", force_wrong_tool=True)

    print("\nExecuting Investigation...")
    for tc in failed_trace.tool_calls:
        print(f"  Tool Call: {tc['tool_name']} -> Status: HTTP {tc['status_code']} OK [OK]")

    print("\nGoal Evaluation:")
    print(f"  Tool Response Status: HTTP 200 OK [OK]")
    print(f"  Investigation Goal:   FAILED [X]")
    print("\n  >>> TOOL SUCCESS != TASK SUCCESS <<<")

    failure_res = detector.detect_failure(failed_trace)
    print("\nPRISM FAILURE DETECTOR OUTPUT:")
    print(json.dumps(failure_res.to_dict(), indent=2))

    # ----------------------------------------------------
    # 3. PRISM DIAGNOSIS
    # ----------------------------------------------------
    print("\n------------------------------------------------")
    print("3. PRISM DIAGNOSIS")
    print("------------------------------------------------")
    diagnosis = diagnostician.diagnose_failure(failure_res, failed_trace)
    print(f"Failure Type:   {diagnosis.failure_type}")
    print(f"Root Cause:     {diagnosis.root_cause}")
    print(f"Impact:         {diagnosis.impact}")
    print(f"Recommendation: {diagnosis.recommendation}")

    # ----------------------------------------------------
    # 4. REMEDIATION & RE-RUN
    # ----------------------------------------------------
    print("\n------------------------------------------------")
    print("4. REMEDIATION & RE-RUN")
    print("------------------------------------------------")
    policy_override = remediation.remediate(diagnosis)
    print("Applying Policy Correction...")
    print(f"Policy Note: {policy_override.get('policy_note')}")

    print("\nExecuting Re-run under NEW trace ID: RUN002_REMEDIATED")
    rerun_trace = remediation.rerun_investigation(
        agent=agent,
        alert_data=alert_data,
        policy_override=policy_override,
        new_run_id="RUN002_REMEDIATED"
    )

    print(f"Original Trace ID:   {failed_trace.run_id} (Preserved FAILED)")
    print(f"Remediated Trace ID: {rerun_trace.run_id} (Active)")

    for step in rerun_trace.steps:
        print(f"[{step['name']}] [OK] {step['description']}")

    # ----------------------------------------------------
    # 5. PRISM VALIDATION
    # ----------------------------------------------------
    print("\n------------------------------------------------")
    print("5. PRISM VALIDATION")
    print("------------------------------------------------")
    val_res = validator.validate_result(rerun_trace)
    print(f"Validation Outcome: {'VALIDATED [OK]' if val_res.validated else 'REJECTED [X]'}")
    print(json.dumps(val_res.to_dict(), indent=2))

    print("\n==================================================")
    print("   FINGUARD & PRISM E2E PIPELINE COMPLETED        ")
    print("==================================================")


if __name__ == "__main__":
    run_demo()
