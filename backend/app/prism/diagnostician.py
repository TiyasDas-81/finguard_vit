"""
PRISM Diagnostician module.
Analyzes failure detection results to pinpoint root causes and recommend targeted remediations.
"""

from ..agents.models import InvestigationTrace
from .models import FailureDetectionResult, Diagnosis


class PrismDiagnostician:
    """
    Produces actionable root-cause diagnoses from detected trace failures.
    """

    def diagnose_failure(
        self,
        failure_result: FailureDetectionResult,
        trace: InvestigationTrace
    ) -> Diagnosis:
        """
        Analyzes failure detection details and returns structured Diagnosis.
        """
        if not failure_result.failure_detected:
            return Diagnosis(
                failure_type="NONE",
                root_cause="No failure detected in trace.",
                impact="None",
                recommendation="No action required."
            )

        if failure_result.failure_type == "WRONG_TOOL_SELECTION":
            actual_tool = failure_result.actual_tool or "generic_balance"
            expected_tool = failure_result.expected_tool or "transaction_history"

            return Diagnosis(
                failure_type="WRONG_TOOL_SELECTION",
                root_cause=f"The agent selected tool '{actual_tool}' which is incapable of retrieving required transaction history evidence.",
                impact="Historical spending baseline and amount anomaly evidence were unavailable, causing investigation goal completion to fail despite tool HTTP 200 success.",
                recommendation=f"Update tool-selection policy to map spending history goals directly to '{expected_tool}' and rerun investigation."
            )

        return Diagnosis(
            failure_type=failure_result.failure_type or "GENERAL_FAILURE",
            root_cause="Investigation trace did not gather required evidence items.",
            impact="Goal completion score fell below threshold.",
            recommendation="Review tool selection policy and rerun investigation."
        )
