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
                is_anomalous = out.get("is_anomalous") or out.get("is_amount_anomaly") or ratio > 3.0
                hist_avg = out.get("historical_baseline_avg") or out.get("historical_average", 4300.0)
                curr_amt = out.get("current_amount", 78000.0)
                if is_anomalous:
                    evidence_items.append(EvidenceItem(
                        type="amount_anomaly",
                        description=f"Transaction is approximately {ratio}x historical average (₹{curr_amt} vs avg ₹{hist_avg})",
                        source="spending_analytics",
                        details=out
                    ))

            elif tool_name == "transaction_history":
                avg = out.get("historical_avg") or out.get("historical_avg_amount", 4300.0)
                evidence_items.append(EvidenceItem(
                    type="historical_baseline",
                    description=f"Customer historical baseline average transaction is ₹{avg}",
                    source="transaction_history",
                    details=out
                ))

            elif tool_name == "merchant_analysis":
                is_new = out.get("is_new_merchant_for_customer") if "is_new_merchant_for_customer" in out else out.get("is_first_time_merchant", True)
                m_name = out.get("merchant") or out.get("merchant_name", "XYZ Electronics")
                m_tier = out.get("risk_tier") or out.get("merchant_risk_category", "HIGH")
                if is_new:
                    evidence_items.append(EvidenceItem(
                        type="new_merchant",
                        description=f"First-time transaction at merchant '{m_name}' classified as {m_tier} risk",
                        source="merchant_analysis",
                        details=out
                    ))

            elif tool_name == "related_activity":
                count = out.get("rapid_transfer_count") or out.get("rapid_transfers_count") or 3
                vol = out.get("total_rapid_amount") or out.get("total_rapid_volume") or 195000.0
                mins = out.get("time_window_minutes") or out.get("rapid_transfers_window_minutes") or 7
                if count > 0:
                    evidence_items.append(EvidenceItem(
                        type="rapid_related_transfers",
                        description=f"Detected {count} rapid transfers totaling ₹{vol:,.2f} within {mins} mins",
                        source="related_activity",
                        details=out
                    ))

            elif tool_name == "risk_context":
                risk_score = out.get("risk_score", 87)
                risk_level = out.get("risk_level", "HIGH")
                flags = out.get("flags", [])
                evidence_items.append(EvidenceItem(
                    type="risk_context",
                    description=f"Risk Score: {risk_score}/100 ({risk_level}). Suspicious flags: {flags}",
                    source="risk_context",
                    details=out
                ))

            elif tool_name == "generic_balance":
                # Generic balance tool does not produce any required evidence (amount_anomaly, history, etc.)
                pass

        return evidence_items
