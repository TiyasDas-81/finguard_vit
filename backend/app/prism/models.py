"""
Data models for PRISM Reliability & Evaluation System.
"""

from dataclasses import dataclass, field, asdict
from typing import Dict, Any, List, Optional


@dataclass
class MetricScore:
    metric_name: str
    score: float  # 0.0 to 1.0 (or 0% to 100%)
    percentage: int  # 0 to 100
    passed: bool
    details: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class EvaluationReport:
    run_id: str
    transaction_id: str
    tool_selection_correctness: MetricScore
    evidence_completeness: MetricScore
    evidence_grounding: MetricScore
    goal_completion: MetricScore
    context_preservation: MetricScore
    report_quality: MetricScore
    overall_score: float
    overall_passed: bool

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class FailureDetectionResult:
    failure_detected: bool
    failure_type: Optional[str] = None  # e.g. "WRONG_TOOL_SELECTION"
    expected_tool: Optional[str] = None  # e.g. "transaction_history"
    actual_tool: Optional[str] = None  # e.g. "generic_balance"
    tool_success: bool = True  # e.g. HTTP 200 OK
    task_success: bool = False  # e.g. Investigation goal incomplete
    reason: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Diagnosis:
    failure_type: str
    root_cause: str
    impact: str
    recommendation: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ValidationResult:
    validated: bool
    goal_completed: bool
    evidence_complete: bool
    tool_selection_correct: bool
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
