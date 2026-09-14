import React, { useEffect, useState } from 'react';
import { PrismEvaluation, PrismFailureState } from '../types';
import { apiService } from '../services/api';
import { PrismMetricCard } from '../components/prism/PrismMetricCard';
import { FailurePanel } from '../components/prism/FailurePanel';
import { RemediationFlow } from '../components/prism/RemediationFlow';
import { Cpu, Play, CheckCircle2, AlertOctagon, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export const PrismPage: React.FC = () => {
  const [prism, setPrism] = useState<PrismEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  const [simState, setSimState] = useState<'IDLE' | 'FAILED' | 'DIAGNOSED' | 'VALIDATED'>('IDLE');
  const [failureData, setFailureData] = useState<PrismFailureState | null>(null);
  const [diagnoseInfo, setDiagnoseInfo] = useState<{ rootCause: string; recommendation: string } | null>(null);
  const [rerunInfo, setRerunInfo] = useState<{ recoveryTimeMs: number } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadPrism() {
      const data = await apiService.getPrismEvaluations();
      setPrism(data);
      setFailureData(data.recentFailures[0]);
      setLoading(false);
    }
    loadPrism();
  }, []);

  const handleSimulateFailure = async () => {
    setActionLoading(true);
    const failState = await apiService.simulatePrismFailure();
    setFailureData(failState);
    setSimState('FAILED');
    setDiagnoseInfo(null);
    setRerunInfo(null);
    setActionLoading(false);
  };

  const handleDiagnose = async () => {
    setActionLoading(true);
    const diag = await apiService.diagnosePrismFailure();
    setDiagnoseInfo(diag);
    setSimState('DIAGNOSED');
    setActionLoading(false);
  };

  const handleRerun = async () => {
    setActionLoading(true);
    const res = await apiService.rerunInvestigation();
    setRerunInfo({ recoveryTimeMs: res.recoveryTimeMs });
    setSimState('VALIDATED');
    setActionLoading(false);
  };

  if (loading || !prism) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        <Cpu className="w-5 h-5 animate-spin text-[#E55B13] mr-2" /> Querying PRISM Agent Reliability Engine...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner - Pitch Deck Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#FFF9F3] to-[#FFF2EB] p-8 border border-[#FCD5C1] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-prism px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#E55B13]" /> PRISM RELIABILITY SYSTEM
              </span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-bold">
                RECOVERY RATE: {prism.recoveryRate}%
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              PRISM Agent Reliability & Interactive Simulation
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl mt-1 font-medium">
              Autonomous oversight layer evaluating tool accuracy, grounding, and self-correcting tool selection failures.
            </p>
          </div>

          {/* Interactive Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateFailure}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              [ SIMULATE AGENT FAILURE ]
            </button>

            {simState === 'FAILED' && (
              <button
                onClick={handleDiagnose}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-[#E55B13] hover:bg-[#D04E09] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                [ DIAGNOSE FAILURE ]
              </button>
            )}

            {(simState === 'DIAGNOSED' || simState === 'FAILED') && (
              <button
                onClick={handleRerun}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                [ FIX & RE-RUN ]
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRISM Metric Cards */}
      <div>
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#E55B13] mb-4">
          PRISM Reliability Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <PrismMetricCard title="Agent Runs" value={prism.totalAgentRuns} colorClass="text-slate-900" />
          <PrismMetricCard title="Successful" value={prism.successfulRuns} colorClass="text-emerald-700" />
          <PrismMetricCard title="Failed Runs" value={prism.failedRuns} colorClass="text-red-600" />
          <PrismMetricCard title="Recovered" value={prism.recoveredRuns} colorClass="text-[#E55B13]" />
          <PrismMetricCard title="Tool Selection" value={`${prism.toolSelectionAccuracy}%`} colorClass="text-[#E55B13]" />
          <PrismMetricCard title="Grounding" value={`${prism.evidenceGrounding}%`} colorClass="text-slate-900" />
          <PrismMetricCard title="Goal Complete" value={`${prism.goalCompletion}%`} colorClass="text-emerald-700" />
        </div>
      </div>

      {/* Dynamic Interactive Demonstration Area */}
      {simState === 'IDLE' ? (
        <div className="fg-card p-10 text-center space-y-4 bg-white border border-[#E6D9C5] shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF2EB] border border-[#FCD5C1] flex items-center justify-center mx-auto text-[#E55B13] font-bold">
            <Cpu className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Interactive PRISM Agent Failure Demonstration</h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            Click <strong className="text-[#DC2626] font-bold">[ SIMULATE AGENT FAILURE ]</strong> above to simulate a false HTTP 200 tool response and witness PRISM's autonomous diagnosis and self-correction flow.
          </p>
          <button
            onClick={handleSimulateFailure}
            className="px-6 py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" /> Launch Failure Demonstration
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Failure Panel */}
          {failureData && <FailurePanel failureState={failureData} />}

          {/* Remediation & Validation Flow */}
          <RemediationFlow
            currentStage={simState === 'VALIDATED' ? 'VALIDATED' : simState === 'DIAGNOSED' ? 'DIAGNOSED' : 'DETECTED'}
            rootCause={diagnoseInfo?.rootCause || failureData?.rootCause}
            recommendation={diagnoseInfo?.recommendation || failureData?.recommendation}
          />

          {/* Final Validation Banner if Re-run Completed */}
          {simState === 'VALIDATED' && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-500 shadow-xl space-y-2 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-mono text-xs font-black uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                PRISM AGENT SELF-HEALING COMPLETE
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                VALIDATED ✓ — Investigation Goal: PASSED ✓
              </h3>
              <p className="text-xs text-slate-700 max-w-xl mx-auto font-medium">
                Transaction History Tool correctly invoked. 90-day spending average baseline successfully retrieved and evidence grounded in raw logs in {rerunInfo?.recoveryTimeMs || 180}ms.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
