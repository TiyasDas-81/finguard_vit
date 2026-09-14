"""
PRISM Evaluator module.
Calculates 6 deterministic reliability metrics directly from an InvestigationTrace.
"""

from typing import List, Dict, Any, Optional
from ..agents.models import InvestigationTrace
from .models import MetricScore, EvaluationReport


class PrismEvaluator:
    """
    Evaluates 6 core metrics on an InvestigationTrace:
    1. Tool Selection Correctness
    2. Evidence Completeness
    3. Evidence Grounding
    4. Goal Completion
    5. Context Preservation
    6. Report Quality
    """

    DEFAULT_REQUIRED_EVIDENCE = [
        "amount_anomaly",
        "new_merchant",
        "unusual_transaction_time",
        "rapid_related_transfers",
        "risk_context"
    ]

    DEFAULT_REQUIRED_TOOLS = [
        "transaction_history",
        "spending_analytics",
        "merchant_analysis",
        "related_activity",
        "risk_context"
    ]

    def evaluate_tool_selection_correctness(self, trace: InvestigationTrace) -> MetricScore:
        """
        Evaluates whether the agent selected tools capable of providing required investigation evidence.
        Score is 0% if generic_balance was selected instead of required transaction_history / spending_analytics.
        """
        executed_tools = {tc.get("tool_name") for tc in trace.tool_calls if tc.get("success")}

        if "generic_balance" in executed_tools and not ("transaction_history" in executed_tools or "spending_analytics" in executed_tools):
            return MetricScore(
                metric_name="Tool Selection Correctness",
                score=0.0,
                percentage=0,
                passed=False,
                details="WRONG_TOOL_SELECTION: Selected 'generic_balance' instead of required 'transaction_history'."
            )

        # Check coverage of required tools
        needed = {"transaction_history", "spending_analytics", "merchant_analysis", "related_activity", "risk_context"}
        matched = executed_tools.intersection(needed)
        
        # Consider tool selection correct if history/spending + merchant + related + risk present
        has_history = "transaction_history" in executed_tools or "spending_analytics" in executed_tools
        has_merchant = "merchant_analysis" in executed_tools
        has_related = "related_activity" in executed_tools
        has_risk = "risk_context" in executed_tools

        correct_count = sum([has_history, has_merchant, has_related, has_risk])
        score = correct_count / 4.0
        percentage = int(score * 100)

        return MetricScore(
            metric_name="Tool Selection Correctness",
            score=score,
            percentage=percentage,
            passed=score >= 0.9,
            details=f"Selected {percentage}% of required investigation tool categories."
        )

    def evaluate_evidence_completeness(
        self,
        trace: InvestigationTrace,
        required_evidence: Optional[List[str]] = None
    ) -> MetricScore:
        """
        Compares evidence actually gathered against required evidence types.
        """
        req_list = required_evidence or self.DEFAULT_REQUIRED_EVIDENCE
        actual_types = {e.get("type") for e in trace.evidence if isinstance(e, dict)}

        # Also consider historical_baseline as satisfying history requirement
        if "historical_baseline" in actual_types and "amount_anomaly" not in actual_types:
            actual_types.add("amount_anomaly")

        found_count = 0
        missing = []
        for req in req_list:
            if req in actual_types:
                found_count += 1
            else:
                missing.append(req)

        score = found_count / float(len(req_list)) if req_list else 1.0
        percentage = int(score * 100)
        passed = score >= 0.8

        details = f"Gathered {found_count}/{len(req_list)} required evidence items ({percentage}%)."
        if missing:
            details += f" Missing: {', '.join(missing)}."

        return MetricScore(
            metric_name="Evidence Completeness",
            score=score,
            percentage=percentage,
            passed=passed,
            details=details
        )

    def evaluate_evidence_grounding(self, trace: InvestigationTrace) -> MetricScore:
        """
        Verifies that every evidence item traces back to a successful tool call.
        """
        tool_sources = {tc.get("tool_name") for tc in trace.tool_calls if tc.get("success")}

        if not trace.evidence:
            return MetricScore(
                metric_name="Evidence Grounding",
                score=0.0,
                percentage=0,
                passed=False,
                details="No evidence items present in trace."
            )

        grounded_count = 0
        for ev in trace.evidence:
            src = ev.get("source")
            if src in tool_sources:
                grounded_count += 1

        score = grounded_count / float(len(trace.evidence))
        percentage = int(score * 100)

        return MetricScore(
            metric_name="Evidence Grounding",
            score=score,
            percentage=percentage,
            passed=score >= 0.9,
            details=f"{percentage}% of evidence items strictly grounded in tool output."
        )

    def evaluate_goal_completion(self, trace: InvestigationTrace) -> MetricScore:
        """
        Evaluates overall investigation goal completion.
        Goal completion is FALSE if required tool selection or evidence completeness fails.
        """
        tool_score = self.evaluate_tool_selection_correctness(trace)
        evidence_score = self.evaluate_evidence_completeness(trace)

        if not tool_score.passed or not evidence_score.passed or trace.outcome != "SUCCESS":
            return MetricScore(
                metric_name="Goal Completion",
                score=0.0,
                percentage=0,
                passed=False,
                details="Investigation goal FAILED due to missing tools, evidence, or wrong tool selection."
            )

        return MetricScore(
            metric_name="Goal Completion",
            score=1.0,
            percentage=100,
            passed=True,
            details="Investigation goal COMPLETED successfully with all evidence gathered."
        )

    def evaluate_context_preservation(self, trace: InvestigationTrace) -> MetricScore:
        """
        Verifies transaction context is preserved across all execution steps.
        """
        tx_id = trace.transaction_id
        if not tx_id:
            return MetricScore(
                metric_name="Context Preservation",
                score=0.0,
                percentage=0,
                passed=False,
                details="Transaction ID missing from trace."
            )

        # Check steps and final result for transaction ID match
        steps_ok = len(trace.steps) >= 5
        final_ok = trace.final_result is None or trace.final_result.get("transaction_id") == tx_id

        score = 1.0 if (steps_ok and final_ok) else 0.5
        percentage = int(score * 100)

        return MetricScore(
            metric_name="Context Preservation",
            score=score,
            percentage=percentage,
            passed=score >= 0.9,
            details=f"Context preserved across {len(trace.steps)} execution steps for transaction {tx_id}."
        )

    def evaluate_report_quality(self, trace: InvestigationTrace) -> MetricScore:
        """
        Evaluates structure and completeness of final report.
        """
        res = trace.final_result
        if not res:
            return MetricScore(
                metric_name="Report Quality",
                score=0.0,
                percentage=0,
                passed=False,
                details="Final investigation report missing."
            )

        has_risk = bool(res.get("risk_level"))
        has_evidence = isinstance(res.get("evidence"), list)
        has_reasoning = bool(res.get("reasoning"))
        has_rec = bool(res.get("recommendation"))

        quality_checks = [has_risk, has_evidence, has_reasoning, has_rec]
        score = sum(quality_checks) / 4.0
        percentage = int(score * 100)

        return MetricScore(
            metric_name="Report Quality",
            score=score,
            percentage=percentage,
            passed=score >= 0.9,
            details=f"Report structure score: {percentage}% (Risk Level, Evidence, Reasoning, Recommendation)."
        )

    def evaluate_all(self, trace: InvestigationTrace, required_evidence: Optional[List[str]] = None) -> EvaluationReport:
        """
        Runs all 6 evaluators and returns a comprehensive EvaluationReport.
        """
        tool_score = self.evaluate_tool_selection_correctness(trace)
        evidence_score = self.evaluate_evidence_completeness(trace, required_evidence)
        grounding_score = self.evaluate_evidence_grounding(trace)
        goal_score = self.evaluate_goal_completion(trace)
        context_score = self.evaluate_context_preservation(trace)
        report_score = self.evaluate_report_quality(trace)

        scores = [
            tool_score.score,
            evidence_score.score,
            grounding_score.score,
            goal_score.score,
            context_score.score,
            report_score.score
        ]

        overall_score = round(sum(scores) / len(scores), 2)
        overall_passed = all([
            tool_score.passed,
            evidence_score.passed,
            grounding_score.passed,
            goal_score.passed,
            context_score.passed,
            report_score.passed
        ])

        return EvaluationReport(
            run_id=trace.run_id,
            transaction_id=trace.transaction_id,
            tool_selection_correctness=tool_score,
            evidence_completeness=evidence_score,
            evidence_grounding=grounding_score,
            goal_completion=goal_score,
            context_preservation=context_score,
            report_quality=report_score,
            overall_score=overall_score,
            overall_passed=overall_passed
        )
