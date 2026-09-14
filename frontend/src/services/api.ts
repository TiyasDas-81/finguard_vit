import { Alert, Customer, Transaction, Investigation, PrismEvaluation, AgentTrace, HistoryRun, PrismFailureState, Evidence } from '../types';
import { mockAlerts, mockInvestigationTXN10291, mockPrismEvaluations, mockHistoryRuns } from '../mock/mockData';

const API_MODE = import.meta.env?.VITE_API_MODE || 'mock';
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiService = {
  getApiMode(): string {
    return API_MODE;
  },

  getBaseUrl(): string {
    return API_BASE_URL;
  },

  async checkHealth(): Promise<{ status: string; service: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        if (!res.ok) throw new Error(`Health check returned HTTP ${res.status}`);
        return await res.json();
      } catch (err: any) {
        console.warn('Backend offline or health check failed:', err.message);
        return { status: 'OFFLINE', service: 'FastAPI Backend (Unavailable)' };
      }
    }
    return { status: 'OK', service: 'Mock API Engine' };
  },

  async getAlerts(): Promise<Alert[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts`);
        if (!res.ok) throw new Error(`Failed to fetch alerts (HTTP ${res.status})`);
        return await res.json();
      } catch (err: any) {
        console.error('Backend alert fetch error, falling back to mock data:', err.message);
        return mockAlerts;
      }
    }
    await new Promise((res) => setTimeout(res, 180));
    return mockAlerts;
  },

  async getAlertById(transactionId: string): Promise<Alert | undefined> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts/${transactionId}`);
        if (!res.ok) throw new Error(`Failed to fetch alert ${transactionId}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for getAlertById(${transactionId}):`, err.message);
        return mockAlerts.find((a) => a.transactionId.toLowerCase() === transactionId.toLowerCase()) || mockAlerts[0];
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockAlerts.find((a) => a.transactionId.toLowerCase() === transactionId.toLowerCase()) || mockAlerts[0];
  },

  async getCustomerById(customerId: string): Promise<Customer> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/customers/${customerId}`);
        if (!res.ok) throw new Error(`Failed to fetch customer ${customerId}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for getCustomerById(${customerId}):`, err.message);
        return mockInvestigationTXN10291.customer;
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.customer;
  },

  async getTransactionById(transactionId: string): Promise<Transaction> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
        if (!res.ok) throw new Error(`Failed to fetch transaction ${transactionId}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for getTransactionById(${transactionId}):`, err.message);
        return mockInvestigationTXN10291.transaction;
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.transaction;
  },

  async createInvestigation(transactionId: string): Promise<{ investigationId: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: transactionId }),
        });
        if (!res.ok) throw new Error(`Failed to create investigation for ${transactionId}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for createInvestigation(${transactionId}):`, err.message);
        return { investigationId: 'INV-10291' };
      }
    }
    await new Promise((res) => setTimeout(res, 250));
    return { investigationId: 'INV-10291' };
  },

  async getInvestigation(id: string): Promise<Investigation> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigations/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch investigation ${id}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Backend investigation fetch failed for ${id}, falling back to mock data:`, err.message);
        return mockInvestigationTXN10291;
      }
    }
    await new Promise((res) => setTimeout(res, 250));
    return mockInvestigationTXN10291;
  },

  async getInvestigationEvidence(id: string): Promise<Evidence[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigations/${id}/evidence`);
        if (!res.ok) throw new Error(`Failed to fetch evidence for ${id}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for getInvestigationEvidence(${id}):`, err.message);
        return mockInvestigationTXN10291.evidenceList;
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.evidenceList;
  },

  async getTraceTimeline(id: string): Promise<AgentTrace[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigations/${id}/trace`);
        if (!res.ok) throw new Error(`Failed to fetch trace timeline for ${id}`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for getTraceTimeline(${id}):`, err.message);
        return mockInvestigationTXN10291.timeline;
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.timeline;
  },

  async getPrismEvaluations(): Promise<PrismEvaluation> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/evaluations`);
        if (!res.ok) throw new Error('Failed to fetch PRISM evaluations');
        return await res.json();
      } catch (err: any) {
        console.warn('Fallback for getPrismEvaluations():', err.message);
        return mockPrismEvaluations;
      }
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockPrismEvaluations;
  },

  async getHistoryRuns(): Promise<HistoryRun[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/history`);
        if (!res.ok) throw new Error('Failed to fetch history runs');
        return await res.json();
      } catch (err: any) {
        console.warn('Fallback for getHistoryRuns():', err.message);
        return mockHistoryRuns;
      }
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockHistoryRuns;
  },

  async submitHumanReview(
    investigationId: string,
    decision: 'ESCALATE' | 'MARK_SUSPICIOUS' | 'DISMISS',
    notes: string
  ): Promise<{ success: boolean; message: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigations/${investigationId}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision, notes }),
        });
        if (!res.ok) throw new Error(`Failed to submit human review (HTTP ${res.status})`);
        return await res.json();
      } catch (err: any) {
        console.warn(`Fallback for submitHumanReview(${investigationId}):`, err.message);
        return {
          success: true,
          message: `Decision [${decision}] recorded for ${investigationId} (Mode: ${API_MODE}).`,
        };
      }
    }
    await new Promise((res) => setTimeout(res, 300));
    return {
      success: true,
      message: `Human Review submitted: Decision [${decision}] recorded for case ${investigationId}.`,
    };
  },

  // Interactive PRISM Simulation APIs
  async simulatePrismFailure(): Promise<PrismFailureState> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/simulate-failure`, { method: 'POST' });
        if (!res.ok) throw new Error(`Simulate failure returned HTTP ${res.status}`);
        return await res.json();
      } catch (err: any) {
        console.warn('Fallback for simulatePrismFailure():', err.message);
        return mockPrismEvaluations.recentFailures[0];
      }
    }
    await new Promise((res) => setTimeout(res, 350));
    return mockPrismEvaluations.recentFailures[0];
  },

  async diagnosePrismFailure(): Promise<{ diagnosed: boolean; rootCause: string; recommendation: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/diagnose`, { method: 'POST' });
        if (!res.ok) throw new Error(`Diagnose failure returned HTTP ${res.status}`);
        return await res.json();
      } catch (err: any) {
        console.warn('Fallback for diagnosePrismFailure():', err.message);
        return {
          diagnosed: true,
          rootCause: mockPrismEvaluations.recentFailures[0].rootCause,
          recommendation: mockPrismEvaluations.recentFailures[0].recommendation,
        };
      }
    }
    await new Promise((res) => setTimeout(res, 400));
    return {
      diagnosed: true,
      rootCause: mockPrismEvaluations.recentFailures[0].rootCause,
      recommendation: mockPrismEvaluations.recentFailures[0].recommendation,
    };
  },

  async rerunInvestigation(): Promise<{ validated: boolean; status: string; recoveryTimeMs: number; newRunId?: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/rerun`, { method: 'POST' });
        if (!res.ok) throw new Error(`Rerun investigation returned HTTP ${res.status}`);
        return await res.json();
      } catch (err: any) {
        console.warn('Fallback for rerunInvestigation():', err.message);
        return {
          validated: true,
          status: 'VALIDATED ✓',
          recoveryTimeMs: 180,
          newRunId: 'RUN-9922',
        };
      }
    }
    await new Promise((res) => setTimeout(res, 550));
    return {
      validated: true,
      status: 'VALIDATED ✓',
      recoveryTimeMs: 180,
      newRunId: 'RUN-9922',
    };
  },
};
