import React from 'react';
import { WorkflowStep } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface WorkflowStepperProps {
  workflow: WorkflowStep[];
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ workflow }) => {
  return (
    <div className="fg-card p-6 bg-white border border-[#E6D9C5] shadow-sm">
      <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#E55B13] mb-4">
        Agent Autonomous Investigation Workflow
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {workflow.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ${
              step.status === 'completed'
                ? 'bg-[#FFF2EB] border-[#FCD5C1] text-slate-800'
                : 'bg-[#F4ECE0] border-[#E6D9C5] text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white text-[#E55B13] border border-[#FCD5C1]">
                0{idx + 1}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#E55B13]" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">{step.id}</div>
              <div className="text-[11px] text-slate-600 font-semibold">{step.label}</div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 font-medium flex items-center justify-between pt-1 border-t border-[#FCD5C1]/60">
              <span>{step.timestamp}</span>
              {step.durationMs && <span>{step.durationMs}ms</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
