"""
Data models for FinGuard Agent and investigation workflows.
"""

import time
import uuid
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional


@dataclass
class AlertInput:
    transaction_id: str
    customer_id: str
    amount: float
    merchant: str
    timestamp: str
    risk_score: int
    raw_data: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        if not d.get("raw_data"):
            d["raw_data"] = {
                "transaction_id": self.transaction_id,
                "customer_id": self.customer_id,
                "amount": self.amount,
                "merchant": self.merchant,
                "timestamp": self.timestamp,
                "risk_score": self.risk_score
            }
        return d


@dataclass
class ToolResult:
    tool_name: str
    success: bool
    status_code: int
    input: Dict[str, Any]
    output: Dict[str, Any]
    execution_time: float
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class EvidenceItem:
    type: str
    description: str
    source: str
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class InvestigationResult:
    transaction_id: str
    risk_level: str  # HIGH, MEDIUM, LOW
    evidence: List[Dict[str, Any]]
    reasoning: str
    recommendation: str  # e.g., "Requires Human Review"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ExecutionStep:
    step_id: int
    name: str  # UNDERSTAND, PLAN, SELECT_TOOLS, INVESTIGATE, ANALYZE_EVIDENCE, EXPLAIN, GENERATE_REPORT
    description: str
    timestamp: float = field(default_factory=time.time)
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class InvestigationTrace:
    run_id: str
    transaction_id: str
    investigation_goal: str
    steps: List[Dict[str, Any]] = field(default_factory=list)
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    evidence: List[Dict[str, Any]] = field(default_factory=list)
    final_result: Optional[Dict[str, Any]] = None
    outcome: str = "IN_PROGRESS"  # SUCCESS, FAILED, IN_PROGRESS
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
