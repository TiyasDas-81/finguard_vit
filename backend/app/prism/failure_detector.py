"""
PRISM Failure Detector module.
Detects failures in agent traces, specifically distinguishing TOOL SUCCESS (200 OK) from TASK SUCCESS.
"""

from typing import Dict, Any, Optional
from ..agents.models import InvestigationTrace
from .models import FailureDetectionResult


class FailureDetector:
    """
    Analyzes InvestigationTrace objects to detect failure patterns.
    Enforces TOOL SUCCESS != TASK SUCCESS principle.
    """

    def detect_failure(self, trace: InvestigationTrace) -> FailureDetectionResult:
        """
        Inspects the trace for failures, specifically WRONG_TOOL_SELECTION scenarios.
        """
        tool_calls = trace.tool_calls
        evidence = trace.evidence

        # Check tool calls
        generic_balance_called = False
        generic_balance_success = False

        for tc in tool_calls:
            tool_name = tc.get("tool_name")
            status_code = tc.get("status_code")
            success = tc.get("success")

            if tool_name == "generic_balance":
                generic_balance_called = True
                if status_code == 200 and success:
                    generic_balance_success = True

        # Check evidence types gathered
        evidence_types = {e.get("type") for e in evidence if isinstance(e, dict)}
        has_amount_evidence = "amount_anomaly" in evidence_types or "historical_baseline" in evidence_types

        # Trigger failure detection if generic_balance was used instead of transaction_history
        if generic_balance_called and generic_balance_success and not has_amount_evidence:
            return FailureDetectionResult(
                failure_detected=True,
                failure_type="WRONG_TOOL_SELECTION",
                expected_tool="transaction_history",
                actual_tool="generic_balance",
                tool_success=True,  # Tool call returned HTTP 200 OK
                task_success=False,  # Task/Goal failed
                reason="TOOL SUCCESS != TASK SUCCESS: Tool 'generic_balance' returned HTTP 200 OK but failed to satisfy the required investigation goal of gathering transaction history evidence."
            )

        # General failure check if outcome is FAILED
        if trace.outcome == "FAILED" or not has_amount_evidence:
            return FailureDetectionResult(
                failure_detected=True,
                failure_type="INCOMPLETE_EVIDENCE",
                expected_tool="transaction_history",
                actual_tool="generic_balance" if generic_balance_called else "unknown",
                tool_success=True,
                task_success=False,
                reason="Investigation failed to gather all required evidence items."
            )

        # No failure detected
        return FailureDetectionResult(
            failure_detected=False,
            failure_type=None,
            expected_tool=None,
            actual_tool=None,
            tool_success=True,
            task_success=True,
            reason="Investigation trace completed successfully with all required evidence."
        )
