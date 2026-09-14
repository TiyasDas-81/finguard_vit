"""
Tool Selector module for FinGuard AI Agent.
Maps investigation goals to required tools, with support for wrong-tool failure injection.
"""

from typing import Dict, Any, List, Optional


class ToolSelector:
    """
    Selects tools required to fulfill investigation goals.
    """

    def select_tools(
        self,
        plan: Dict[str, Any],
        force_wrong_tool: bool = False,
        policy_override: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        """
        Determines the list of tools to execute for the plan.
        If force_wrong_tool=True, intentionally substitutes transaction_history with generic_balance.
        """
        if force_wrong_tool:
            # Wrong Tool Failure Mode: Replaces transaction_history/spending_analytics with generic_balance
            selected = [
                "generic_balance",  # WRONG TOOL! Incapable of providing spending anomaly evidence
                "merchant_analysis",
                "related_activity",
                "risk_context"
            ]
            return selected

        if policy_override and "tool_mappings" in policy_override:
            mappings = policy_override["tool_mappings"]
            selected = []
            for goal in plan.get("goals", []):
                goal_id = goal.get("goal_id")
                if goal_id in mappings:
                    selected.extend(mappings[goal_id])
                else:
                    selected.extend(goal.get("recommended_tools", []))
            # Deduplicate preserving order
            return list(dict.fromkeys(selected))

        # Standard tool selection based on plan
        selected_tools = [
            "transaction_history",
            "spending_analytics",
            "merchant_analysis",
            "related_activity",
            "risk_context"
        ]
        return selected_tools
