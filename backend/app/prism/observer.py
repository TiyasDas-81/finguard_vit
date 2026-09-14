"""
PRISM Observer module.
Observes agent execution traces for evaluation and failure analysis.
"""

from typing import Dict, Any
from ..agents.models import InvestigationTrace


class PrismObserver:
    """
    Observes and captures agent execution state into standardized InvestigationTrace format.
    """

    def observe(self, trace_input: Any) -> InvestigationTrace:
        """
        Validates or converts raw trace data into an InvestigationTrace.
        """
        if isinstance(trace_input, InvestigationTrace):
            return trace_input

        if isinstance(trace_input, dict):
            return InvestigationTrace(
                run_id=trace_input.get("run_id", "UNKNOWN_RUN"),
                transaction_id=trace_input.get("transaction_id", "UNKNOWN_TXN"),
                investigation_goal=trace_input.get("investigation_goal", "Investigate alert"),
                steps=trace_input.get("steps", []),
                tool_calls=trace_input.get("tool_calls", []),
                evidence=trace_input.get("evidence", []),
                final_result=trace_input.get("final_result"),
                outcome=trace_input.get("outcome", "IN_PROGRESS"),
                start_time=trace_input.get("start_time", 0.0),
                end_time=trace_input.get("end_time"),
                metadata=trace_input.get("metadata", {})
            )

        raise ValueError("Invalid trace format provided to PrismObserver")
