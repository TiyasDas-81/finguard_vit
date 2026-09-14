import React from 'react';
import { PrismFailureState } from '../../types';
import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FailurePanelProps {
  failureState: PrismFailureState;
}

export const FailurePanel: React.FC<FailurePanelProps> = ({ failureState }) => {
  return (
    <div className="fg-card-glow p-8 rounded-3xl border border-[#FCD5C1] bg-white shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E6D9C5]">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#FFF2EB] border border-[#FCD5C1] flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-[#E55B13]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              PRISM Interactive Failure Diagnostic State
            </h3>
            <p className="text-xs text-slate-500 font-mono font-medium">
              Case ID: {failureState.investigationId} &bull; Timestamp: {failureState.timestamp}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#FFEBEB] text-[#DC2626] border border-[#FCA5A5] text-xs font-mono font-bold">
          FAILURE SIMULATED
        </span>
      </div>

      {/* Core Paradigm Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFF2EB] via-white to-[#FFEBEB] border-2 border-[#E55B13] text-center space-y-2 shadow-sm">
        <div className="text-xs font-mono tracking-widest text-[#E55B13] uppercase font-extrabold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E55B13] animate-pulse" />
          CRITICAL AGENT EVALUATION PRINCIPLE
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          TOOL SUCCESS ≠ TASK SUCCESS
        </h2>
        <p className="text-xs text-slate-700 max-w-xl mx-auto font-medium">
          The external API tool returned an HTTP 200 success response, but the agent's overall investigation goal completely failed due to incomplete data payload.
        </p>
      </div>

      {/* Side-by-Side Comparison: Expected vs Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPECTED TOOL */}
        <div className="p-5 rounded-2xl bg-[#FAF5ED] border border-emerald-400 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-700 font-extrabold uppercase">EXPECTED TOOL</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-sm font-extrabold text-slate-900 bg-white p-3.5 rounded-xl border border-[#E6D9C5] shadow-xs">
            {failureState.expectedTool}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Required by planner to calculate 90-day spending average baseline for TXN10291.
          </div>
        </div>

        {/* ACTUAL TOOL */}
        <div className="p-5 rounded-2xl bg-[#FAF5ED] border border-red-400 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#DC2626] font-extrabold uppercase">ACTUAL TOOL</span>
            <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="font-mono text-sm font-extrabold text-slate-900 bg-white p-3.5 rounded-xl border border-[#E6D9C5] shadow-xs">
            {failureState.actualTool}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Agent selected a tool that could not satisfy the investigation requirement.
          </div>
        </div>
      </div>

      {/* Status Comparison */}
      <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E6D9C5] flex flex-col sm:flex-row items-center justify-around gap-4 font-mono text-xs text-center">
        <div>
          <span className="text-slate-500 block text-[10px] font-bold">TOOL RESPONSE</span>
          <span className="text-emerald-700 font-black text-sm">{failureState.toolStatus}</span>
        </div>
        <div className="h-8 w-px bg-[#E6D9C5] hidden sm:block"></div>
        <div>
          <span className="text-slate-500 block text-[10px] font-bold">INVESTIGATION GOAL</span>
          <span className="text-[#DC2626] font-black text-sm">{failureState.goalStatus}</span>
        </div>
      </div>
    </div>
  );
};
