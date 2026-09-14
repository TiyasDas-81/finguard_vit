"""
Investigator module for FinGuard AI Agent.
Executes tool calls via ToolAdapter and extracts structured evidence.
"""

from typing import List, Dict, Any
from .models import AlertInput, ToolResult, EvidenceItem
from .tool_adapter import ToolAdapter


class Investigator:
    """
    Executes tool calls and analyzes raw tool outputs into structured evidence items.
    """

    def execute_investigation(
        self,
        selected_tools: List[str],
        alert: AlertInput,
        tool_adapter: ToolAdapter
    ) -> List[ToolResult]:
        """
        Executes selected tools sequentially via ToolAdapter.
        """
        results = []
        arguments = alert.to_dict()
        
        for tool_name in selected_tools:
            res = tool_adapter.execute_tool(tool_name, arguments)
            results.append(res)
            
        return results

    def analyze_evidence(self, tool_results: List[ToolResult]) -> List[EvidenceItem]:
        """
        Synthesizes tool execution results into structured evidence items.
        """
        evidence_items = []

        for res in tool_results:
            if not res.success:
                continue

            tool_name = res.tool_name
            out = res.output

            if tool_name == "spending_analytics":
                ratio = out.get("anomaly_ratio", 1.0)
                if out.get("is_amount_anomaly", False) or ratio > 3.0:
                    evidence_items.append(EvidenceItem(
                        type="amount_anomaly",
                        description=f"Transaction is approximately {ratio}x historical average (${out.get('current_amount')} vs avg ${out.get('historical_average')})",
                        source="spending_analytics",
                        details=out
                    ))

            elif tool_name == "transaction_history":
                avg = out.get("historical_avg_amount", 0)
                evidence_items.append(EvidenceItem(
                    type="historical_baseline",
                    description=f"Customer historical 30-day average transaction is ${avg}",
                    source="transaction_history",
                    details=out
                ))

            elif tool_name == "merchant_analysis":
                if out.get("is_first_time_merchant", False):
                    evidence_items.append(EvidenceItem(
                        type="new_merchant",
                        description=f"First-time transaction at merchant '{out.get('merchant_name')}' classified as {out.get('merchant_risk_category')}",
                        source="merchant_analysis",
                        details=out
                    ))

            elif tool_name == "related_activity":
                if out.get("velocity_flag", False):
                    evidence_items.append(EvidenceItem(
                        type="rapid_related_transfers",
                        description=f"Detected {out.get('rapid_transfers_count')} rapid transfers totaling ${out.get('total_rapid_volume')} within {out.get('rapid_transfers_window_minutes')} mins",
                        source="related_activity",
                        details=out
                    ))

            elif tool_name == "risk_context":
                if out.get("is_unusual_time", False):
                    evidence_items.append(EvidenceItem(
                        type="unusual_transaction_time",
                        description=f"Transaction executed at unusual time: {out.get('timestamp')}",
                        source="risk_context",
                        details=out
                    ))
                if out.get("location_mismatch", False):
                    evidence_items.append(EvidenceItem(
                        type="risk_context",
                        description=f"Device location mismatch: {out.get('device_ip_location')} vs registered home {out.get('registered_home_location')}",
                        source="risk_context",
                        details=out
                    ))

            elif tool_name == "generic_balance":
                # Generic balance tool does not produce any required evidence (amount_anomaly, history, etc.)
                pass

        return evidence_items
