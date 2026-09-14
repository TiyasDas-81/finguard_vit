import React from 'react';
import { PrismFailureState } from '../../types';
import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FailurePanelProps {
  failureState: PrismFailureState;
}

export const FailurePanel: React.FC<FailurePanelProps> = ({ failureState }) => {
  return (
    <div className="fg-card-glow p-8 rounded-2xl border-purple-500/50 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              PRISM Interactive Failure Diagnostic State
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Case ID: {failureState.investigationId} &bull; Timestamp: {failureState.timestamp}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold">
          FAILURE SIMULATED
        </span>
      </div>

      {/* Core Paradigm Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/80 via-[#190F2E] to-purple-950/60 border-2 border-red-500/60 text-center space-y-2">
        <div className="text-xs font-mono tracking-widest text-red-400 uppercase font-extrabold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          CRITICAL AGENT EVALUATION PRINCIPLE
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
            {failureState.expectedTool}
          </div>
          <div className="text-xs text-slate-400">
            Required by planner to calculate 90-day spending average baseline for TXN10291.
          </div>
        </div>

        {/* ACTUAL TOOL */}
        <div className="p-5 rounded-xl bg-[#070A12] border border-red-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-red-400 font-bold uppercase">ACTUAL TOOL</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-sm font-bold text-white bg-[#0A0F1D] p-3 rounded border border-[#1E2945]">
            {failureState.actualTool}
          </div>
          <div className="text-xs text-slate-400">
            Agent selected a tool that could not satisfy the investigation requirement.
          </div>
        </div>
      </div>

      {/* Status Comparison */}
      <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] flex flex-col sm:flex-row items-center justify-around gap-4 font-mono text-xs text-center">
        <div>
          <span className="text-slate-400 block text-[10px]">TOOL RESPONSE</span>
          <span className="text-emerald-400 font-extrabold text-sm">{failureState.toolStatus}</span>
        </div>
        <div className="h-8 w-px bg-[#1E2945] hidden sm:block"></div>
        <div>
          <span className="text-slate-400 block text-[10px]">INVESTIGATION GOAL</span>
          <span className="text-red-400 font-extrabold text-sm">{failureState.goalStatus}</span>
        </div>
      </div>
    </div>
  );
};
