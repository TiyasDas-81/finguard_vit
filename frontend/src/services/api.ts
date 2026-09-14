import { Alert, Investigation, PrismEvaluation, AgentTrace, HumanReview, HistoryRun, PrismFailureState } from '../types';
import { mockAlerts, mockInvestigationTXN10291, mockPrismEvaluations, mockHistoryRuns } from '../mock/mockData';

// API Mode resolution from Vite environment or default to 'mock'
const API_MODE = import.meta.env?.VITE_API_MODE || 'mock';
const BACKEND_BASE_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:8000/api';

export const apiService = {
  getApiMode(): string {
    return API_MODE;
  },

  async getAlerts(): Promise<Alert[]> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/alerts`);
      if (!res.ok) throw new Error('Failed to fetch alerts from backend');
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockAlerts;
  },

  async getAlertById(transactionId: string): Promise<Alert | undefined> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/alerts/${transactionId}`);
      if (!res.ok) throw new Error(`Failed to fetch alert ${transactionId}`);
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockAlerts.find((a) => a.transactionId.toLowerCase() === transactionId.toLowerCase()) || mockAlerts[0];
  },

  async getInvestigation(id: string): Promise<Investigation> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/investigations/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch investigation ${id}`);
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 300));
    return mockInvestigationTXN10291;
  },

  async getPrismEvaluations(): Promise<PrismEvaluation> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/prism/evaluations`);
      if (!res.ok) throw new Error('Failed to fetch PRISM evaluations');
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockPrismEvaluations;
  },

  async getTraceTimeline(id: string): Promise<AgentTrace[]> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/investigations/${id}/trace`);
      if (!res.ok) throw new Error('Failed to fetch trace timeline');
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.timeline;
  },

  async getHistoryRuns(): Promise<HistoryRun[]> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/history`);
      if (!res.ok) throw new Error('Failed to fetch history runs');
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockHistoryRuns;
  },

  async submitHumanReview(investigationId: string, decision: 'ESCALATE' | 'MARK_SUSPICIOUS' | 'DISMISS', notes: string): Promise<{ success: boolean; message: string }> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/investigations/${investigationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 300));
    return {
      success: true,
      message: `Human Review submitted: Decision [${decision}] recorded for case ${investigationId}.`,
    };
  },

  // Interactive PRISM Simulation API methods
  async simulatePrismFailure(): Promise<PrismFailureState> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/prism/simulate-failure`, { method: 'POST' });
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 350));
    return mockPrismEvaluations.recentFailures[0];
  },

  async diagnosePrismFailure(): Promise<{ diagnosed: boolean; rootCause: string; recommendation: string }> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/prism/diagnose`, { method: 'POST' });
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 400));
    return {
      diagnosed: true,
      rootCause: mockPrismEvaluations.recentFailures[0].rootCause,
      recommendation: mockPrismEvaluations.recentFailures[0].recommendation,
    };
  },

  async rerunInvestigation(): Promise<{ validated: boolean; status: string; recoveryTimeMs: number }> {
    if (API_MODE === 'backend') {
      const res = await fetch(`${BACKEND_BASE_URL}/prism/rerun`, { method: 'POST' });
      return res.json();
    }
    await new Promise((res) => setTimeout(res, 600));
    return {
      validated: true,
      status: 'VALIDATED ✓',
      recoveryTimeMs: 180,
    };
  },
};
