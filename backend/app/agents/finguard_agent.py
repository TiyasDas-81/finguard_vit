"""
Main FinGuard AI Investigation Agent orchestrator.
Executes multi-step investigation workflow and produces structured InvestigationTrace.
"""

import os
import time
import uuid
from typing import Dict, Any, Optional

from .models import AlertInput, InvestigationTrace, ExecutionStep
from .planner import Planner
from .tool_selector import ToolSelector
from .investigator import Investigator
from .report_generator import ReportGenerator
from .tool_adapter import ToolAdapter


class FinGuardAgent:
    """
    Multi-step financial fraud investigation agent.
    Workflow: ALERT -> UNDERSTAND -> PLAN -> SELECT_TOOLS -> INVESTIGATE -> ANALYZE_EVIDENCE -> EXPLAIN -> GENERATE_REPORT
    """

    def __init__(self, tool_adapter: Optional[ToolAdapter] = None, llm_mode: Optional[str] = None):
        self.llm_mode = llm_mode or os.environ.get("LLM_MODE", "mock")
        self.tool_adapter = tool_adapter or ToolAdapter(use_mock=True)
        self.planner = Planner()
        self.tool_selector = ToolSelector()
        self.investigator = Investigator()
        self.report_generator = ReportGenerator()

    def run_investigation(
        self,
        alert_data: Dict[str, Any],
        run_id: Optional[str] = None,
        force_wrong_tool: bool = False,
        policy_override: Optional[Dict[str, Any]] = None
    ) -> InvestigationTrace:
        """
        Executes complete investigation workflow for a suspicious transaction alert.
        """
        alert = AlertInput(
            transaction_id=alert_data.get("transaction_id", "TXN10291"),
            customer_id=alert_data.get("customer_id", "CUST458"),
            amount=float(alert_data.get("amount", 78000)),
            merchant=alert_data.get("merchant", "XYZ Electronics"),
            timestamp=alert_data.get("timestamp", "02:17 AM"),
            risk_score=int(alert_data.get("risk_score", 87)),
            raw_data=alert_data
        )

        trace_run_id = run_id or f"RUN_{uuid.uuid4().hex[:8].upper()}"
        start_time = time.time()

        trace = InvestigationTrace(
            run_id=trace_run_id,
            transaction_id=alert.transaction_id,
            investigation_goal="Investigate suspicious financial activity and gather multi-vector evidence",
            start_time=start_time,
            metadata={"llm_mode": self.llm_mode, "force_wrong_tool": force_wrong_tool}
        )

        # 1. UNDERSTAND
        step1_time = time.time()
        understanding = self.planner.understand_alert(alert)
        trace.steps.append(ExecutionStep(
            step_id=1,
            name="UNDERSTAND",
            description="Analyzed suspicious alert and identified initial risk indicators.",
            timestamp=step1_time,
            details=understanding
        ).to_dict())

        # 2. PLAN
        step2_time = time.time()
        plan = self.planner.create_investigation_plan(alert, understanding)
        trace.steps.append(ExecutionStep(
            step_id=2,
            name="PLAN",
            description="Constructed multi-vector investigation plan.",
            timestamp=step2_time,
            details=plan
        ).to_dict())

        # 3. SELECT TOOLS
        step3_time = time.time()
        selected_tools = self.tool_selector.select_tools(
            plan=plan,
            force_wrong_tool=force_wrong_tool,
            policy_override=policy_override
        )
        trace.steps.append(ExecutionStep(
            step_id=3,
            name="SELECT_TOOLS",
            description=f"Selected {len(selected_tools)} tools for execution.",
            timestamp=step3_time,
            details={"selected_tools": selected_tools, "force_wrong_tool": force_wrong_tool}
        ).to_dict())

        # 4. INVESTIGATE
        step4_time = time.time()
        tool_results = self.investigator.execute_investigation(
            selected_tools=selected_tools,
            alert=alert,
            tool_adapter=self.tool_adapter
        )
        trace.tool_calls = [res.to_dict() for res in tool_results]
        trace.steps.append(ExecutionStep(
            step_id=4,
            name="INVESTIGATE",
            description=f"Executed {len(tool_results)} tool calls via ToolAdapter.",
            timestamp=step4_time,
            details={"executed_count": len(tool_results)}
        ).to_dict())

        # 5. ANALYZE EVIDENCE
        step5_time = time.time()
        evidence_items = self.investigator.analyze_evidence(tool_results)
        trace.evidence = [ev.to_dict() for ev in evidence_items]
        trace.steps.append(ExecutionStep(
            step_id=5,
            name="ANALYZE_EVIDENCE",
            description=f"Synthesized {len(evidence_items)} evidence items.",
            timestamp=step5_time,
            details={"evidence_count": len(evidence_items)}
        ).to_dict())

        # 6. EXPLAIN
        step6_time = time.time()
        explanation = f"Gathered {len(evidence_items)} evidence factors regarding ${alert.amount} transaction at {alert.merchant}."
        trace.steps.append(ExecutionStep(
            step_id=6,
            name="EXPLAIN",
            description="Formulated risk reasoning explanation.",
            timestamp=step6_time,
            details={"explanation": explanation}
        ).to_dict())

        # 7. GENERATE REPORT
        step7_time = time.time()
        report = self.report_generator.generate_report(
            alert=alert,
            evidence_items=evidence_items
        )
        trace.final_result = report.to_dict()
        trace.steps.append(ExecutionStep(
            step_id=7,
            name="GENERATE_REPORT",
            description="Generated final investigation report.",
            timestamp=step7_time,
            details={"risk_level": report.risk_level, "recommendation": report.recommendation}
        ).to_dict())

        # Determine outcome: SUCCESS if evidence includes amount_anomaly / required history, else FAILED if wrong tool
        has_amount_evidence = any(e.get("type") in ("amount_anomaly", "historical_baseline") for e in trace.evidence)
        if has_amount_evidence and not force_wrong_tool:
            trace.outcome = "SUCCESS"
        else:
            trace.outcome = "FAILED"

        trace.end_time = time.time()
        return trace
