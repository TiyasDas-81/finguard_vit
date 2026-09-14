import { AlertItem, InvestigationData, PrismMetrics, TraceStep } from '../types';
import { mockAlerts, mockInvestigationTXN10291, mockPrismMetrics, mockTraceTimeline } from '../mock/mockData';

// API configuration flag to switch between mock data and live backend when ready
const USE_LIVE_BACKEND = false;
const API_BASE_URL = 'http://localhost:8000/api';

export const apiService = {
  async getAlerts(): Promise<AlertItem[]> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts from backend');
      return response.json();
    }
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 200));
    return mockAlerts;
  },

  async getAlertById(transactionId: string): Promise<AlertItem | undefined> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/alerts/${transactionId}`);
      if (!response.ok) throw new Error(`Failed to fetch alert ${transactionId}`);
      return response.json();
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockAlerts.find((a) => a.transactionId.toLowerCase() === transactionId.toLowerCase()) || mockAlerts[0];
  },

  async getInvestigation(id: string): Promise<InvestigationData> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/investigations/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch investigation ${id}`);
      return response.json();
    }
    await new Promise((res) => setTimeout(res, 300));
    return mockInvestigationTXN10291;
  },

  async getPrismEvaluations(): Promise<PrismMetrics> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/prism/evaluations`);
      if (!response.ok) throw new Error('Failed to fetch PRISM evaluations');
      return response.json();
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockPrismMetrics;
  },

  async getTraceTimeline(id: string): Promise<TraceStep[]> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/trace/${id}`);
      if (!response.ok) throw new Error('Failed to fetch trace timeline');
      return response.json();
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockTraceTimeline;
  },

  async submitHumanReview(investigationId: string, decision: 'APPROVE_BLOCK' | 'FLAG_FOR_MONITORING' | 'DISMISS', notes: string): Promise<{ success: boolean; message: string }> {
    if (USE_LIVE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/investigations/${investigationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });
      return response.json();
    }
    await new Promise((res) => setTimeout(res, 300));
    return {
      success: true,
      message: `Action [${decision}] recorded for ${investigationId}. Case updated in FinGuard audit log.`,
    };
  },
};
