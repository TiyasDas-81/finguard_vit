export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'SUSPICIOUS' | 'UNDER_REVIEW' | 'AUTO_CLEARED' | 'HIGH';

export interface Customer {
  id: string;
  name: string;
  accountAge: string;
  avgTxnAmount: string;
  location: string;
  email?: string;
  riskCategory?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: string;
  amountRaw: number;
  historicalAvg: string;
  merchant: string;
  category: string;
  time: string;
  timestamp: string;
  normalWindow: string;
  device: string;
  ipAddress: string;
  location: string;
}

export interface Alert {
  transactionId: string;
  customerId: string;
  amount: string;
  amountRaw: number;
  merchant: string;
  timestamp: string;
  time: string;
  riskScore: number;
  status: RiskLevel | AlertStatus;
  actionRequired: string;
}

export interface WorkflowStep {
  id: 'UNDERSTAND' | 'PLAN' | 'INVESTIGATE' | 'EXPLAIN' | 'REPORT';
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
  timestamp: string;
  durationMs?: number;
  description: string;
}

export interface ToolCall {
  id?: string;
  name: string;
  tool?: string;
  status: 'SUCCESS' | 'FAILED' | 'HTTP_200_GOAL_FAILED';
  success?: boolean;
  statusCode: number;
  status_code?: number;
  executionTimeMs: number;
  execution_time?: number;
  input: Record<string, any>;
  outputSummary: Record<string, any>;
  output?: Record<string, any>;
  data?: Record<string, any>;
  error?: string;
}

export interface Evidence {
  id: string;
  title: string;
  value: string;
  description: string;
  impactScore: number;
}

export interface EvidenceChainNode {
  id: string;
  label: string;
  subtitle: string;
  iconType: 'txn' | 'anomaly' | 'merchant' | 'time' | 'transfer' | 'risk';
  severity: 'normal' | 'warning' | 'critical';
}

export interface InvestigationReport {
  dossierId: string;
  transactionId: string;
  riskLevel: RiskLevel;
  status: string;
  evidenceSummary: string[];
  aiReasoning: string[];
  recommendation: string;
  generatedAt: string;
}

export interface AgentTrace {
  id: string;
  stepNumber: number;
  event: string;
  service: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'PRISM_CORRECTED';
  details: string;
  toolCall?: ToolCall;
  run_id?: string;
  transaction_id?: string;
}

export interface Investigation {
  id: string;
  transactionId: string;
  customer: Customer;
  transaction: Transaction;
  riskScore: number;
  riskLevel: RiskLevel;
  workflow: WorkflowStep[];
  timeline: AgentTrace[];
  toolCalls: ToolCall[];
  evidenceList: Evidence[];
  evidenceChain: EvidenceChainNode[];
  aiReasoning: string[];
  recommendation: string;
  humanReviewRequired: boolean;
  dossierStatus: string;
  report: InvestigationReport;
}

export interface PrismFailureState {
  id: string;
  timestamp: string;
  investigationId: string;
  expectedTool: string;
  actualTool: string;
  toolStatus: string;
  goalStatus: string;
  failureType: string;
  impact: string;
  prismDiagnosis: string;
  rootCause: string;
  recommendation: string;
  autoCorrection: string;
  reRunStatus: string;
}

export interface PrismEvaluation {
  totalAgentRuns: number;
  successfulRuns: number;
  failedRuns: number;
  recoveredRuns: number;
  toolSelectionAccuracy: number;
  evidenceGrounding: number;
  goalCompletion: number;
  recoveryRate: number;
  recentFailures: PrismFailureState[];
}

export interface HumanReview {
  investigationId: string;
  decision: 'ESCALATE' | 'MARK_SUSPICIOUS' | 'DISMISS';
  notes: string;
  reviewedBy?: string;
  timestamp?: string;
}

export interface HistoryRun {
  runId: string;
  transactionId: string;
  amount: string;
  risk: RiskLevel;
  duration: string;
  toolsUsed: string[];
  prismResult: 'PASSED' | 'RECOVERED' | 'FAILED';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED';
  trace: AgentTrace[];
}
