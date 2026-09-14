export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AlertItem {
  transactionId: string;
  customerId: string;
  amount: string;
  amountRaw: number;
  merchant: string;
  timestamp: string;
  time: string;
  riskScore: number; // e.g. 87
  status: RiskLevel;
  actionRequired: string;
}

export interface WorkflowStep {
  id: 'UNDERSTAND' | 'PLAN' | 'INVESTIGATE' | 'EXPLAIN' | 'REPORT';
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
  timestamp: string;
}

export interface ToolCall {
  id: string;
  name: string;
  status: 'SUCCESS' | 'FAILED' | 'HTTP_200_GOAL_FAILED';
  statusCode: number;
  latencyMs: number;
  input: Record<string, any>;
  output: Record<string, any>;
}

export interface EvidenceChainNode {
  id: string;
  label: string;
  subtitle: string;
  iconType: 'txn' | 'anomaly' | 'merchant' | 'time' | 'transfer' | 'risk';
  severity: 'normal' | 'warning' | 'critical';
}

export interface InvestigationData {
  id: string;
  transactionId: string;
  customer: {
    id: string;
    name: string;
    accountAge: string;
    avgTxnAmount: string;
    location: string;
  };
  transaction: {
    amount: string;
    merchant: string;
    category: string;
    time: string;
    device: string;
    ipAddress: string;
  };
  riskScore: number;
  riskLevel: RiskLevel;
  workflow: WorkflowStep[];
  timeline: {
    id: string;
    time: string;
    phase: string;
    title: string;
    description: string;
    toolCall?: ToolCall;
  }[];
  evidenceList: {
    id: string;
    title: string;
    value: string;
    description: string;
    impactScore: number;
  }[];
  evidenceChain: EvidenceChainNode[];
  aiReasoning: string[];
  recommendation: string;
  humanReviewRequired: boolean;
  dossierStatus: string;
}

export interface PrismMetrics {
  totalAgentRuns: number;
  successfulRuns: number;
  failedRuns: number;
  recoveredRuns: number;
  toolSelectionAccuracy: number;
  evidenceGrounding: number;
  goalCompletion: number;
  recoveryRate: number;
  recentFailures: {
    id: string;
    timestamp: string;
    investigationId: string;
    expectedTool: string;
    actualTool: string;
    toolStatus: string;
    goalStatus: string;
    prismDiagnosis: string;
    autoCorrection: string;
    reRunStatus: string;
  }[];
}

export interface TraceStep {
  id: string;
  stepNumber: number;
  title: string;
  service: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'PRISM_CORRECTED';
  details: string;
  payload?: any;
}
