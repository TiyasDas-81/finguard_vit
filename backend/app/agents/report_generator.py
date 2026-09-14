"""
Report Generator module for FinGuard AI Agent.
Synthesizes evidence and reasoning into structured investigation results.
"""

from typing import List, Dict, Any, Optional
from .models import AlertInput, EvidenceItem, InvestigationResult


class ReportGenerator:
    """
    Synthesizes gathered evidence into structured final investigation report.
    """

    def generate_report(
        self,
        alert: AlertInput,
        evidence_items: List[EvidenceItem],
        reasoning_notes: Optional[str] = None
    ) -> InvestigationResult:
        """
        Builds structured InvestigationResult.
        """
        evidence_dicts = [e.to_dict() for e in evidence_items]
        evidence_types = {e.type for e in evidence_items}

        # Determine risk level based on evidence gathered
        if "amount_anomaly" in evidence_types or "rapid_related_transfers" in evidence_types or alert.risk_score >= 80:
            risk_level = "HIGH"
        elif len(evidence_items) >= 2 or alert.risk_score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Construct reasoning explanation
        reasons = []
        for e in evidence_items:
            reasons.append(f"- {e.description} (Source: {e.source})")

        if reasons:
            reasoning = (
                f"Investigation into transaction {alert.transaction_id} for ${alert.amount} identified "
                f"{len(evidence_items)} primary risk factors:\n" + "\n".join(reasons)
            )
        else:
            reasoning = f"Investigation into transaction {alert.transaction_id} found insufficient evidence or incomplete tool execution."

        if reasoning_notes:
            reasoning += f"\nAdditional Notes: {reasoning_notes}"

        # FinGuard Agent recommendation
        recommendation = "Requires Human Review"

        return InvestigationResult(
            transaction_id=alert.transaction_id,
            risk_level=risk_level,
            evidence=evidence_dicts,
            reasoning=reasoning,
            recommendation=recommendation
        )



