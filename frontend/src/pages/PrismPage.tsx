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

  // Interactive PRISM Simulation States: 'IDLE' | 'FAILED' | 'DIAGNOSED' | 'VALIDATED'
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
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Cpu className="w-5 h-5 animate-spin text-purple-400 mr-2" /> Querying PRISM Agent Reliability Engine...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#120D24] via-[#1B1238] to-[#0A0F1D] p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-prism px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> PRISM RELIABILITY SYSTEM
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800 font-bold">
                RECOVERY RATE: {prism.recoveryRate}%
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              PRISM Agent Reliability & Interactive Simulation
            </h2>
            <p className="text-xs text-purple-200/80 max-w-2xl mt-1">
              Autonomous oversight layer evaluating tool accuracy, grounding, and self-correcting tool selection failures.
            </p>
          </div>

          {/* Interactive Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateFailure}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              [ SIMULATE AGENT FAILURE ]
            </button>

            {simState === 'FAILED' && (
              <button
                onClick={handleDiagnose}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                [ DIAGNOSE FAILURE ]
              </button>
            )}

            {(simState === 'DIAGNOSED' || simState === 'FAILED') && (
              <button
                onClick={handleRerun}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
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
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-4">
          PRISM Reliability Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <PrismMetricCard title="Agent Runs" value={prism.totalAgentRuns} />
          <PrismMetricCard title="Successful Runs" value={prism.successfulRuns} colorClass="text-emerald-400" />
          <PrismMetricCard title="Failed Runs" value={prism.failedRuns} colorClass="text-red-400" />
          <PrismMetricCard title="Recovered Runs" value={prism.recoveredRuns} colorClass="text-purple-400" />
          <PrismMetricCard title="Tool Selection" value={`${prism.toolSelectionAccuracy}%`} colorClass="text-cyan-300" />
          <PrismMetricCard title="Grounding" value={`${prism.evidenceGrounding}%`} colorClass="text-purple-300" />
          <PrismMetricCard title="Goal Complete" value={`${prism.goalCompletion}%`} colorClass="text-emerald-300" />
        </div>
      </div>

      {/* Dynamic Interactive Demonstration Area */}
      {simState === 'IDLE' ? (
        <div className="fg-card p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400 font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Interactive PRISM Agent Failure Demonstration</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click <strong className="text-red-400">[ SIMULATE AGENT FAILURE ]</strong> above to simulate a false HTTP 200 tool response and witness PRISM's autonomous diagnosis and self-correction flow.
          </p>
          <button
            onClick={handleSimulateFailure}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all inline-flex items-center gap-2"
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
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0A1F18] to-emerald-950/60 border-2 border-emerald-500/60 shadow-xl space-y-2 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs font-extrabold uppercase">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                PRISM AGENT SELF-HEALING COMPLETE
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                VALIDATED ✓ — Investigation Goal: PASSED ✓
              </h3>
              <p className="text-xs text-emerald-200/90 max-w-xl mx-auto">
                Transaction History Tool correctly invoked. 90-day spending average baseline successfully retrieved and evidence grounded in raw logs in {rerunInfo?.recoveryTimeMs || 180}ms.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
