"""
PRISM Validator module.
Validates remediated investigation traces to ensure complete goal resolution and score compliance.
"""

from typing import List, Dict, Any, Optional
from ..agents.models import InvestigationTrace
from .models import ValidationResult
from .evaluator import PrismEvaluator


class PrismValidator:
    """
    Validates remediated traces against reliability standards.
    """

    def __init__(self):
        self.evaluator = PrismEvaluator()

    def validate_result(
        self,
        trace: InvestigationTrace,
        required_evidence: Optional[List[str]] = None
    ) -> ValidationResult:
        """
        Evaluates trace and returns ValidationResult.
        """
        report = self.evaluator.evaluate_all(trace, required_evidence)

        tool_ok = report.tool_selection_correctness.passed
        evidence_ok = report.evidence_completeness.passed
        goal_ok = report.goal_completion.passed
        overall_ok = report.overall_passed

        is_validated = overall_ok and tool_ok and evidence_ok and goal_ok

        return ValidationResult(
            validated=is_validated,
            goal_completed=goal_ok,
            evidence_complete=evidence_ok,
            tool_selection_correct=tool_ok,
            details={
                "run_id": trace.run_id,
                "overall_score": report.overall_score,
                "metric_scores": {
                    "tool_selection": report.tool_selection_correctness.percentage,
                    "evidence_completeness": report.evidence_completeness.percentage,
                    "evidence_grounding": report.evidence_grounding.percentage,
                    "goal_completion": report.goal_completion.percentage,
                    "context_preservation": report.context_preservation.percentage,
                    "report_quality": report.report_quality.percentage
                }
            }
        )
