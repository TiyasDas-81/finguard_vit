"""
PRISM Remediation module.
Applies deterministic policy corrections and executes remediated agent re-runs creating NEW traces.
"""

import uuid
from typing import Dict, Any, Optional
from ..agents.models import InvestigationTrace
from ..agents.finguard_agent import FinGuardAgent
from .models import Diagnosis


class PrismRemediation:
    """
    Handles tool selection policy correction and re-running FinGuard agent with a new trace.
    """

    def remediate(self, diagnosis: Diagnosis) -> Dict[str, Any]:
        """
        Creates a policy override mapping goals to correct required tools based on diagnosis.
        """
        if diagnosis.failure_type == "WRONG_TOOL_SELECTION":
            # Policy correction: explicitly map G1_SPENDING_HISTORY to transaction_history and spending_analytics
            return {
                "corrected": True,
                "tool_mappings": {
                    "G1_SPENDING_HISTORY": ["transaction_history", "spending_analytics"]
                },
                "policy_note": "Forced mapping of G1_SPENDING_HISTORY goal to transaction_history and spending_analytics"
            }

        return {
            "corrected": True,
            "tool_mappings": {
                "G1_SPENDING_HISTORY": ["transaction_history", "spending_analytics"]
            }
        }

    def rerun_investigation(
        self,
        agent: FinGuardAgent,
        alert_data: Dict[str, Any],
        policy_override: Dict[str, Any],
        new_run_id: Optional[str] = None
    ) -> InvestigationTrace:
        """
        Re-runs FinGuard investigation using updated policy override and a NEW run_id.
        Preserves original failed trace intact.
        """
        rerun_id = new_run_id or f"RUN_REMEDIATED_{uuid.uuid4().hex[:6].upper()}"

        remediated_trace = agent.run_investigation(
            alert_data=alert_data,
            run_id=rerun_id,
            force_wrong_tool=False,  # Unset wrong tool flag!
            policy_override=policy_override
        )

        return remediated_trace
