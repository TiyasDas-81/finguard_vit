"""
External BlockConvey PRISM Live-Tracing Integration Module.
Instruments FinGuard Agent investigations and submits live telemetry traces to the external PRISM platform.
Handles missing API keys gracefully without crashing FinGuard.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
from .models import InvestigationTrace

logger = logging.getLogger(__name__)

# Try importing prismtrace SDK
try:
    from prismtrace import PRISMtrace
    PRISMTRACE_AVAILABLE = True
except ImportError:
    PRISMtrace = None
    PRISMTRACE_AVAILABLE = False


class ExternalPrismTracer:
    """
    Integration wrapper for external BlockConvey PRISM live tracing SDK.
    Converts FinGuard InvestigationTrace into external PRISM trajectory payloads.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        project_id: Optional[str] = None,
        host: Optional[str] = None
    ):
        self.api_key = api_key or os.environ.get("PRISMTRACE_API_KEY")
        self.project_id = project_id or os.environ.get("PRISMTRACE_PROJECT_ID", "finguard-project")
        self.host = host or os.environ.get("PRISMTRACE_HOST", "https://api.prism.blockconvey.com")
        self.client: Optional[Any] = None

        if self.api_key and PRISMTRACE_AVAILABLE:
            try:
                self.client = PRISMtrace(
                    api_key=self.api_key,
                    host=self.host,
                    project_id=self.project_id
                )
                logger.info("External PRISM live tracer initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize external PRISM tracer: {e}")
                self.client = None
        else:
            if not self.api_key:
                logger.info("PRISMTRACE_API_KEY not found. External live tracing is disabled.")
            elif not PRISMTRACE_AVAILABLE:
                logger.warning("prismtrace-sdk is not installed. External live tracing is disabled.")

    def is_enabled(self) -> bool:
        return self.client is not None

    def send_trace(self, trace: InvestigationTrace) -> Optional[Dict[str, Any]]:
        """
        Converts FinGuard InvestigationTrace into external PRISM steps and submits trajectory.
        """
        if not self.is_enabled():
            return None

        prism_steps: List[Dict[str, Any]] = []

        # 1. Convert execution steps
        for step in trace.steps:
            name = step.get("name", "")
            desc = step.get("description", "")
            details = step.get("details", {})

            if name in ("UNDERSTAND", "PLAN", "SELECT_TOOLS", "EXPLAIN"):
                prism_steps.append({
                    "step_type": "reasoning",
                    "label": f"Agent Step: {name}",
                    "input_summary": f"Transaction ID: {trace.transaction_id}",
                    "output_summary": f"{desc} | Details: {json.dumps(details)}",
                    "status": "success"
                })
            elif name == "INVESTIGATE":
                # Detail individual tool calls as distinct tool_call steps in PRISM
                for tc in trace.tool_calls:
                    t_name = tc.get("tool_name", "unknown_tool")
                    t_success = tc.get("success", False)
                    t_status_code = tc.get("status_code", 500)
                    t_input = tc.get("input", {})
                    t_output = tc.get("output", {})
                    duration_ms = int(tc.get("execution_time", 0.015) * 1000)

                    prism_steps.append({
                        "step_type": "tool_call",
                        "label": f"Tool Call: {t_name}",
                        "tool_name": t_name,
                        "input_summary": json.dumps(t_input),
                        "output_summary": json.dumps(t_output),
                        "duration_ms": duration_ms,
                        "status": "success" if (t_success and t_status_code == 200) else "error"
                    })
            elif name == "ANALYZE_EVIDENCE":
                prism_steps.append({
                    "step_type": "reasoning",
                    "label": "Evidence Analysis",
                    "input_summary": f"Gathered {len(trace.evidence)} evidence factors",
                    "output_summary": json.dumps(trace.evidence),
                    "status": "success"
                })
            elif name == "GENERATE_REPORT":
                prism_steps.append({
                    "step_type": "final_answer",
                    "label": "Final Investigation Report",
                    "input_summary": f"Risk Level: {trace.final_result.get('risk_level') if trace.final_result else 'UNKNOWN'}",
                    "output_summary": json.dumps(trace.final_result) if trace.final_result else "No report generated",
                    "status": "success" if trace.outcome == "SUCCESS" else "error"
                })

        final_status = "success" if trace.outcome == "SUCCESS" else "error"

        try:
            res = self.client.submit_trajectory(
                steps=prism_steps,
                agent_name="FinGuard-Agent",
                agent_id="finguard-agent-v1",
                conversation_id=trace.transaction_id,
                request_id=trace.run_id,
                final_status=final_status,
                async_send=False
            )
            self.client.flush(timeout=2.0)
            return res
        except Exception as e:
            logger.error(f"Error submitting trace to external PRISM: {e}")
            return None
