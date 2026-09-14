import React from 'react';
import { ToolCall } from '../../types';
import { Terminal, CheckCircle2 } from 'lucide-react';

interface ToolCallCardProps {
  toolCall: ToolCall;
}

export const ToolCallCard: React.FC<ToolCallCardProps> = ({ toolCall }) => {
  return (
    <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] text-xs space-y-2.5 font-mono">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-cyan-400 font-bold flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" /> {toolCall.name}
        </span>
        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
          {toolCall.statusCode} OK ({toolCall.executionTimeMs}ms)
        </span>
      </div>

      <div className="text-[11px] text-slate-400">
        <strong className="text-slate-300">Input Params:</strong> {JSON.stringify(toolCall.input)}
      </div>

      <div className="text-[11px] text-slate-200 bg-[#090E1A] p-2.5 rounded border border-[#18233D]">
        <strong className="text-cyan-300 block mb-1">Output Summary:</strong>
        <pre className="whitespace-pre-wrap text-[11px] text-slate-300 font-mono">
          {JSON.stringify(toolCall.outputSummary, null, 2)}
        </pre>
      </div>
    </div>
  );
};
