import React from 'react';
import { WorkflowStep } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface WorkflowStepperProps {
  workflow: WorkflowStep[];
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ workflow }) => {
  return (
    <div className="fg-card p-6">
      <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Agent Autonomous Investigation Workflow
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {workflow.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ${
              step.status === 'completed'
                ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                : 'bg-[#0A0F1D] border-[#1E2945] text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-400">
                0{idx + 1}
              </span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">{step.id}</div>
              <div className="text-[11px] text-slate-300 font-medium">{step.label}</div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-[#1E2945]/50">
              <span>{step.timestamp}</span>
              {step.durationMs && <span>{step.durationMs}ms</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
