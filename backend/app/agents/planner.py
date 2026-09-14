"""
Planner module for FinGuard AI Agent.
Handles alert understanding and investigation plan generation.
"""

from typing import Dict, Any, List
from .models import AlertInput


class Planner:
    """
    Analyzes incoming alerts and constructs structured investigation plans.
    """

    def understand_alert(self, alert: AlertInput) -> Dict[str, Any]:
        """
        Extracts transaction details and flags initial risk indicators.
        """
        flags = []
        if alert.risk_score >= 70:
            flags.append("HIGH_RISK_SCORE")
        if alert.amount >= 10000:
            flags.append("HIGH_TRANSACTION_AMOUNT")
        if "AM" in alert.timestamp and (alert.timestamp.startswith("01") or alert.timestamp.startswith("02") or alert.timestamp.startswith("03") or alert.timestamp.startswith("04")):
            flags.append("OFF_HOURS_TIMESTAMP")
        
        return {
            "transaction_id": alert.transaction_id,
            "customer_id": alert.customer_id,
            "amount": alert.amount,
            "merchant": alert.merchant,
            "timestamp": alert.timestamp,
            "risk_score": alert.risk_score,
            "risk_flags": flags,
            "summary": f"Alert {alert.transaction_id} for ${alert.amount} at {alert.merchant} (Risk Score: {alert.risk_score}/100)"
        }

    def create_investigation_plan(self, alert: AlertInput, understanding: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a structured plan defining goals and required evidence domains.
        """
        goals = [
            {
                "goal_id": "G1_SPENDING_HISTORY",
                "description": "Verify customer historical spending baseline and check for amount anomalies.",
                "required_evidence": ["amount_anomaly"],
                "recommended_tools": ["transaction_history", "spending_analytics"]
            },
            {
                "goal_id": "G2_MERCHANT_ANALYSIS",
                "description": "Analyze merchant reputation and check for first-time or high-risk merchant flag.",
                "required_evidence": ["new_merchant"],
                "recommended_tools": ["merchant_analysis"]
            },
            {
                "goal_id": "G3_RELATED_ACTIVITY",
                "description": "Check for rapid related transfers or account velocity anomalies.",
                "required_evidence": ["rapid_related_transfers"],
                "recommended_tools": ["related_activity"]
            },
            {
                "goal_id": "G4_RISK_CONTEXT",
                "description": "Evaluate environmental risk, timestamp anomalies, and device/location mismatch.",
                "required_evidence": ["unusual_transaction_time", "risk_context"],
                "recommended_tools": ["risk_context"]
            }
        ]

        required_evidence_list = [
            "amount_anomaly",
            "new_merchant",
            "unusual_transaction_time",
            "rapid_related_transfers",
            "risk_context"
        ]

        return {
            "transaction_id": alert.transaction_id,
            "investigation_goal": "Investigate suspicious financial activity and gather multi-vector evidence",
            "goals": goals,
            "required_evidence": required_evidence_list,
            "step_count": len(goals)
        }
