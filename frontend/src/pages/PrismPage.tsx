import React, { useEffect, useState } from 'react';
import { PrismMetrics } from '../types';
import { apiService } from '../services/api';
import { Cpu, CheckCircle2, AlertOctagon, RefreshCw, ShieldCheck, Zap, ArrowRight, AlertTriangle, Layers } from 'lucide-react';

export const PrismPage: React.FC = () => {
  const [prism, setPrism] = useState<PrismMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrism() {
      const data = await apiService.getPrismEvaluations();
      setPrism(data);
      setLoading(false);
    }
    loadPrism();
  }, []);

  if (loading || !prism) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Cpu className="w-5 h-5 animate-spin text-purple-400 mr-2" /> Querying PRISM Agent Reliability Engine...
      </div>
    );
  }

  const failureCase = prism.recentFailures[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#120D24] via-[#1B1238] to-[#0A0F1D] p-6 border border-purple-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-prism px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> PRISM MONITORING ENGINE
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                RECOVERY RATE: {prism.recoveryRate}%
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              PRISM Agent Reliability & Self-Correction Engine
            </h2>
            <p className="text-xs text-purple-200/80 max-w-2xl mt-1">
              Autonomous oversight layer detecting false tool success, schema hallucinations, and incomplete investigation goals.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#070A12] p-3 rounded-xl border border-purple-500/30 font-mono text-xs">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-slate-400 text-[10px]">GROUNDING ACCURACY</div>
              <div className="text-purple-300 font-bold text-base">{prism.evidenceGrounding}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* PRISM Metrics Grid */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-4">
          PRISM Reliability Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="fg-card p-4">
            <span className="text-[10px] text-slate-400 block font-mono">Agent Runs</span>
            <span className="text-2xl font-bold text-white font-mono">{prism.totalAgentRuns}</span>
          </div>
          <div className="fg-card p-4 border-l-2 border-l-emerald-500">
            <span className="text-[10px] text-slate-400 block font-mono">Successful</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{prism.successfulRuns}</span>
          </div>
          <div className="fg-card p-4 border-l-2 border-l-red-500">
            <span className="text-[10px] text-slate-400 block font-mono">Failed Runs</span>
            <span className="text-2xl font-bold text-red-400 font-mono">{prism.failedRuns}</span>
          </div>
          <div className="fg-card p-4 border-l-2 border-l-purple-500">
            <span className="text-[10px] text-slate-400 block font-mono">Recovered</span>
            <span className="text-2xl font-bold text-purple-400 font-mono">{prism.recoveredRuns}</span>
          </div>
          <div className="fg-card p-4">
            <span className="text-[10px] text-slate-400 block font-mono">Tool Selection</span>
            <span className="text-2xl font-bold text-cyan-300 font-mono">{prism.toolSelectionAccuracy}%</span>
          </div>
          <div className="fg-card p-4">
            <span className="text-[10px] text-slate-400 block font-mono">Grounding</span>
            <span className="text-2xl font-bold text-purple-300 font-mono">{prism.evidenceGrounding}%</span>
          </div>
          <div className="fg-card p-4">
            <span className="text-[10px] text-slate-400 block font-mono">Goal Complete</span>
            <span className="text-2xl font-bold text-emerald-300 font-mono">{prism.goalCompletion}%</span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 9. PRISM FAILURE VIEW (HIGHLIGHT FEATURE) */}
      {/* ==================================================== */}
      <div className="fg-card-glow p-8 rounded-2xl border-purple-500/50 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                PRISM Visual Failure State Diagnostic
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Case ID: {failureCase.investigationId} &bull; Timestamp: {failureCase.timestamp}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold">
            RECOVERED IN 180ms
          </span>
        </div>

        {/* Core Highlight Banner: TOOL SUCCESS ≠ TASK SUCCESS */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/80 via-[#190F2E] to-purple-950/60 border-2 border-red-500/60 text-center space-y-2">
          <div className="text-xs font-mono tracking-widest text-red-400 uppercase font-extrabold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            CRITICAL DETECTION PARADIGM
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            TOOL SUCCESS ≠ TASK SUCCESS
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            The external API tool returned an HTTP 200 success response, but the agent's overall investigation goal completely failed due to incomplete data payload.
          </p>
        </div>

        {/* Side-by-Side Comparison: Expected vs Actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EXPECTED TOOL */}
          <div className="p-5 rounded-xl bg-[#070A12] border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">EXPECTED TOOL</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-sm font-bold text-white bg-[#0A0F1D] p-3 rounded border border-[#1E2945]">
              {failureCase.expectedTool}
            </div>
            <div className="text-xs text-slate-400">
              Required by planner to calculate 90-day spending average baseline for TXN10291.
            </div>
          </div>

          {/* ACTUAL EXECUTED TOOL */}
          <div className="p-5 rounded-xl bg-[#070A12] border border-red-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-400 font-bold uppercase">ACTUAL EXECUTED TOOL</span>
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </div>
            <div className="font-mono text-sm font-bold text-white bg-[#0A0F1D] p-3 rounded border border-[#1E2945]">
              {failureCase.actualTool}
            </div>
            <div className="text-xs text-slate-400">
              Agent incorrectly invoked simple balance endpoint which returned balance without history array.
            </div>
          </div>
        </div>

        {/* Status Comparison */}
        <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] flex flex-col sm:flex-row items-center justify-around gap-4 font-mono text-xs text-center">
          <div>
            <span className="text-slate-400 block text-[10px]">TOOL HTTP STATUS</span>
            <span className="text-emerald-400 font-extrabold text-sm">{failureCase.toolStatus}</span>
          </div>
          <div className="h-8 w-px bg-[#1E2945] hidden sm:block"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">INVESTIGATION GOAL</span>
            <span className="text-red-400 font-extrabold text-sm">{failureCase.goalStatus}</span>
          </div>
        </div>

        {/* Resolution Workflow Stepper */}
        <div>
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
            PRISM Self-Correction Remediation Flow
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-[#070A12] border border-purple-500/30 text-center">
              <div className="text-[10px] font-mono text-purple-400 font-bold">STEP 1</div>
              <div className="font-bold text-xs text-white">PRISM DETECTED</div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-purple-500/30 text-center">
              <div className="text-[10px] font-mono text-purple-400 font-bold">STEP 2</div>
              <div className="font-bold text-xs text-white">DIAGNOSED</div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-purple-500/30 text-center">
              <div className="text-[10px] font-mono text-purple-400 font-bold">STEP 3</div>
              <div className="font-bold text-xs text-white">CORRECTED</div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-purple-500/30 text-center">
              <div className="text-[10px] font-mono text-purple-400 font-bold">STEP 4</div>
              <div className="font-bold text-xs text-white">RE-RUN</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">STEP 5</div>
              <div className="font-bold text-xs text-emerald-300">{failureCase.reRunStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
