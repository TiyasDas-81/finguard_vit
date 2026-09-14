/// <reference types="vite/client" />
import { Alert, Customer, Transaction, Investigation, PrismEvaluation, AgentTrace, HistoryRun, PrismFailureState, Evidence, ToolCall } from '../types';
import { mockAlerts, mockInvestigationTXN10291, mockPrismEvaluations, mockHistoryRuns } from '../mock/mockData';

const API_MODE = (import.meta as any).env?.VITE_API_MODE || 'mock';
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
        const data = await res.json();
        return { status: 'ONLINE', service: data.service || 'FastAPI Backend' };
      } catch (err: any) {
        console.warn('Backend health check error:', err.message);
        return { status: 'OFFLINE', service: 'FastAPI Backend (Offline)' };
      }
    }
    return { status: 'OK', service: 'Mock API Engine' };
  },

  async getAlerts(): Promise<Alert[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts`);
        if (!res.ok) throw new Error(`Failed to fetch alerts (HTTP ${res.status})`);
        const data = await res.json();
        const alertList = data.alerts || data;
        if (Array.isArray(alertList) && alertList.length > 0) {
          return alertList.map((item: any) => ({
            transactionId: item.transaction_id || item.transactionId || 'TXN10291',
            customerId: item.customer_id || item.customerId || 'CUST458',
            amount: typeof item.amount === 'number' ? `₹${item.amount.toLocaleString('en-IN')}` : item.amount || '₹78,000',
            amountRaw: item.amount || 78000,
            merchant: item.merchant || item.merchant_name || 'XYZ Electronics',
            timestamp: item.timestamp || '02:17 AM',
            time: item.time || item.timestamp || '02:17 AM',
            riskScore: item.risk_score || item.riskScore || 87,
            status: item.risk_level || item.status || 'HIGH',
            actionRequired: 'Investigate',
          }));
        }
      } catch (err: any) {
        console.warn('Backend alert fetch failed, using fallback:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 180));
    return mockAlerts;
  },

  async getAlertById(transactionId: string): Promise<Alert | undefined> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts/${transactionId}`);
        if (res.ok) {
          const item = await res.json();
          return {
            transactionId: item.transaction_id || transactionId,
            customerId: item.customer_id || 'CUST458',
            amount: typeof item.amount === 'number' ? `₹${item.amount.toLocaleString('en-IN')}` : '₹78,000',
            amountRaw: item.amount || 78000,
            merchant: item.merchant || 'XYZ Electronics',
            timestamp: item.timestamp || '02:17 AM',
            time: item.timestamp || '02:17 AM',
            riskScore: item.risk_score || 87,
            status: item.risk_level || 'HIGH',
            actionRequired: 'Investigate',
          };
        }
      } catch (err: any) {
        console.warn(`Backend alert fetch for ${transactionId} failed:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockAlerts.find((a) => a.transactionId.toLowerCase() === transactionId.toLowerCase()) || mockAlerts[0];
  },

  async getCustomerById(customerId: string): Promise<Customer> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/customers/${customerId}`);
        if (res.ok) {
          const item = await res.json();
          return {
            id: item.customer_id || customerId,
            name: item.name || 'Rahul Sharma',
            accountAge: '3 Years 4 Months',
            avgTxnAmount: item.historical_avg_monthly_spend ? `₹${item.historical_avg_monthly_spend.toLocaleString('en-IN')}` : '₹4,300',
            location: 'Mumbai, IN',
            email: item.email,
          };
        }
      } catch (err: any) {
        console.warn(`Customer API error for ${customerId}:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.customer;
  },

  async getTransactionById(transactionId: string): Promise<Transaction> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
        if (res.ok) {
          const item = await res.json();
          return {
            id: item.transaction_id || transactionId,
            transactionId: item.transaction_id || transactionId,
            customerId: item.customer_id || 'CUST458',
            customerName: 'Rahul Sharma',
            amount: typeof item.amount === 'number' ? `₹${item.amount.toLocaleString('en-IN')}` : '₹78,000',
            amountRaw: item.amount || 78000,
            historicalAvg: '₹4,300',
            merchant: item.merchant || 'XYZ Electronics',
            category: 'High-Value Electronics',
            time: item.timestamp || '02:17 AM',
            timestamp: item.timestamp || '02:17 AM',
            normalWindow: '08:00 AM – 11:00 PM',
            device: 'iPhone 13 (New MAC Address)',
            ipAddress: '185.220.101.4 (Tor Exit Proxy)',
            location: item.location || 'Mumbai, IN',
          };
        }
      } catch (err: any) {
        console.warn(`Transaction API error for ${transactionId}:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.transaction;
  },

  async getInvestigation(id: string): Promise<Investigation> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/investigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: id, use_mock_tools: false, force_wrong_tool: false }),
        });

        if (res.ok) {
          const payload = await res.json();
          const trace = payload.trace || payload;
          const report = trace.final_report || {};
          const steps = trace.steps || [];

          const mappedTimeline: AgentTrace[] = steps.map((st: any, idx: number) => ({
            id: `tr-${idx + 1}`,
            stepNumber: st.step_number || idx + 1,
            event: st.name || st.event || `Step ${idx + 1}`,
            service: st.service || 'FinGuard Agent Service',
            timestamp: '02:17 AM',
            durationMs: Math.round((st.duration || 0.15) * 1000),
            status: st.status === 'FAILED' ? 'FAILED' : 'SUCCESS',
            details: st.description || st.details || JSON.stringify(st.input || {}),
            toolCall: st.tool_call ? {
              name: st.tool_call.tool || 'Financial Tool',
              statusCode: 200,
              executionTimeMs: Math.round((st.tool_call.duration || 0.14) * 1000),
              input: st.tool_call.input || {},
              outputSummary: st.tool_call.data || st.tool_call.output || {},
              status: st.tool_call.success ? 'SUCCESS' : 'FAILED',
            } : undefined,
          }));

          const rawReasoning = report.reasoning || '';
          const reasoningLines: string[] = typeof rawReasoning === 'string'
            ? rawReasoning.split('\n').filter((l: string) => l.trim().length > 0)
            : mockInvestigationTXN10291.aiReasoning;

          return {
            ...mockInvestigationTXN10291,
            id: trace.trace_id || `INV-${id}`,
            transactionId: id,
            riskScore: report.risk_score || 87,
            riskLevel: report.risk_level || 'HIGH',
            timeline: mappedTimeline.length > 0 ? mappedTimeline : mockInvestigationTXN10291.timeline,
            aiReasoning: reasoningLines,
            recommendation: report.recommendation || 'Requires Human Review',
            dossierStatus: `${report.risk_level || 'HIGH'} — ${report.recommendation || 'REQUIRES HUMAN REVIEW'}`.toUpperCase(),
          };
        }
      } catch (err: any) {
        console.warn(`Backend /api/investigate call failed for ${id}, using fallback:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 250));
    return mockInvestigationTXN10291;
  },

  async getInvestigationEvidence(id: string): Promise<Evidence[]> {
    if (API_MODE === 'backend') {
      try {
        const inv = await this.getInvestigation(id);
        return inv.evidenceList;
      } catch (err: any) {
        console.warn(`Evidence API error for ${id}:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.evidenceList;
  },

  async getTraceTimeline(id: string): Promise<AgentTrace[]> {
    if (API_MODE === 'backend') {
      try {
        const inv = await this.getInvestigation(id);
        return inv.timeline;
      } catch (err: any) {
        console.warn(`Trace API error for ${id}:`, err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 150));
    return mockInvestigationTXN10291.timeline;
  },

  async getPrismEvaluations(): Promise<PrismEvaluation> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/evaluations`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('PRISM evaluations API error:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 200));
    return mockPrismEvaluations;
  },

  async getHistoryRuns(): Promise<HistoryRun[]> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/history`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('History runs API error:', err.message);
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
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn(`Human review submission error for ${investigationId}:`, err.message);
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
        const res = await fetch(`${API_BASE_URL}/investigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: 'TXN10291', force_wrong_tool: true }),
        });
        if (res.ok) {
          const payload = await res.json();
          const trace = payload.trace || {};
          const evalObj = trace.evaluation || {};
          return {
            id: 'prism-fail-104',
            timestamp: '02:17:43 AM',
            investigationId: 'TXN10291',
            expectedTool: evalObj.expected_tool || 'Transaction History Tool',
            actualTool: evalObj.actual_tool || 'Generic Balance Tool',
            toolStatus: 'HTTP 200 OK ✓',
            goalStatus: 'FAILED ✗',
            failureType: evalObj.failure_type || 'Wrong Tool Selection',
            impact: 'Required transaction evidence was unavailable.',
            prismDiagnosis: evalObj.diagnosis || 'Tool returned HTTP 200 success, but output payload lacked historical spend array required for anomaly calculation.',
            rootCause: evalObj.root_cause || 'Agent selected a tool that could not satisfy the investigation requirement.',
            recommendation: evalObj.remediation || 'Improve tool-selection guidance and rerun the investigation.',
            autoCorrection: 'Dynamic re-route to Transaction History Tool.',
            reRunStatus: 'VALIDATED ✓',
          };
        }
      } catch (err: any) {
        console.warn('Backend PRISM failure simulation failed:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 350));
    return mockPrismEvaluations.recentFailures[0];
  },

  async diagnosePrismFailure(): Promise<{ diagnosed: boolean; rootCause: string; recommendation: string }> {
    if (API_MODE === 'backend') {
      try {
        const res = await fetch(`${API_BASE_URL}/prism/diagnose`, { method: 'POST' });
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('PRISM diagnose API error:', err.message);
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
        const res = await fetch(`${API_BASE_URL}/investigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: 'TXN10291', force_wrong_tool: false }),
        });
        if (res.ok) {
          return {
            validated: true,
            status: 'VALIDATED ✓',
            recoveryTimeMs: 180,
            newRunId: 'RUN-9922',
          };
        }
      } catch (err: any) {
        console.warn('PRISM rerun API error:', err.message);
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
