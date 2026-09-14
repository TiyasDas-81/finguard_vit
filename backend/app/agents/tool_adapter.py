"""
Tool Adapter interface isolating FinGuard Agent from underlying tool implementations.
Provides deterministic mock implementations for isolated testing and execution.
"""

import time
from typing import Dict, Any
from .models import ToolResult


class ToolAdapter:
    """
    Adapter layer for executing tools cleanly.
    Allows mocking or delegating tool calls to external services.
    """

    def __init__(self, use_mock: bool = True):
        self.use_mock = use_mock

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> ToolResult:
        """
        Executes a named tool with given arguments.
        Returns a structured ToolResult.
        """
        start_time = time.time()
        
        if self.use_mock:
            return self._execute_mock_tool(tool_name, arguments, start_time)
        
        # If Aryan's real tools become available in the future:
        try:
            # Fallback to mock if real tool execution is not wired
            return self._execute_mock_tool(tool_name, arguments, start_time)
        except Exception as e:
            execution_time = time.time() - start_time
            return ToolResult(
                tool_name=tool_name,
                success=False,
                status_code=500,
                input=arguments,
                output={},
                execution_time=execution_time,
                error=str(e)
            )

    def _execute_mock_tool(self, tool_name: str, arguments: Dict[str, Any], start_time: float) -> ToolResult:
        transaction_id = arguments.get("transaction_id", "TXN10291")
        customer_id = arguments.get("customer_id", "CUST458")
        amount = arguments.get("amount", 78000)

        execution_time = 0.015

        if tool_name == "transaction_history":
            output = {
                "customer_id": customer_id,
                "historical_avg_amount": 4300.0,
                "transaction_count_30d": 42,
                "max_historical_amount": 12000.0,
                "recent_transactions": [
                    {"tx_id": "TXN09912", "amount": 250.0, "merchant": "Grocery Hub", "timestamp": "Yesterday"},
                    {"tx_id": "TXN09844", "amount": 4200.0, "merchant": "Tech Depot", "timestamp": "3 days ago"},
                    {"tx_id": "TXN09710", "amount": 110.0, "merchant": "Coffee Express", "timestamp": "5 days ago"}
                ]
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        elif tool_name == "spending_analytics":
            avg_amount = 4300.0
            ratio = round(amount / avg_amount, 1) if avg_amount > 0 else 1.0
            output = {
                "transaction_id": transaction_id,
                "current_amount": amount,
                "historical_average": avg_amount,
                "anomaly_ratio": ratio,
                "is_amount_anomaly": ratio > 3.0,
                "spending_deviation_sigma": 4.2
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        elif tool_name == "merchant_analysis":
            output = {
                "merchant_name": arguments.get("merchant", "XYZ Electronics"),
                "is_first_time_merchant": True,
                "merchant_risk_category": "HIGH_RISK_ELECTRONICS",
                "fraud_reported_count_30d": 14,
                "reputation_score": 32  # Low reputation score
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        elif tool_name == "related_activity":
            output = {
                "customer_id": customer_id,
                "rapid_transfers_count": 3,
                "rapid_transfers_window_minutes": 15,
                "total_rapid_volume": 125000.0,
                "velocity_flag": True,
                "linked_accounts_flagged": 2
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        elif tool_name == "risk_context":
            output = {
                "timestamp": arguments.get("timestamp", "02:17 AM"),
                "is_unusual_time": True,
                "device_ip_location": "Foreign/Unknown IP",
                "registered_home_location": "New York, USA",
                "device_id_recognized": False,
                "location_mismatch": True
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        elif tool_name == "generic_balance":
            # Generic balance tool returned 200 OK, but lacks any transaction history or evidence payload
            output = {
                "customer_id": customer_id,
                "available_balance": 125000.0,
                "currency": "USD",
                "account_type": "CHECKING",
                "status": "ACTIVE"
            }
            return ToolResult(
                tool_name=tool_name,
                success=True,
                status_code=200,
                input=arguments,
                output=output,
                execution_time=execution_time,
                error=None
            )

        else:
            return ToolResult(
                tool_name=tool_name,
                success=False,
                status_code=404,
                input=arguments,
                output={},
                execution_time=execution_time,
                error=f"Unknown tool name: {tool_name}"
            )
