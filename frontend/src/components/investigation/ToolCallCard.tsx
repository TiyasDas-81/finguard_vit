import React from 'react';
import { ToolCall } from '../../types';
import { Terminal, CheckCircle2 } from 'lucide-react';

interface ToolCallCardProps {
  toolCall: ToolCall;
}

export const ToolCallCard: React.FC<ToolCallCardProps> = ({ toolCall }) => {
  return (
    <div className="p-4 rounded-xl bg-[#FAF5ED] border border-[#E6D9C5] text-xs space-y-2.5 font-mono shadow-sm">
      <div className="flex items-center justify-between text-slate-700">
        <span className="text-[#E55B13] font-bold flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#E55B13]" /> {toolCall.name}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
          {toolCall.statusCode} OK ({toolCall.executionTimeMs}ms)
        </span>
      </div>

      <div className="text-[11px] text-slate-600">
        <strong className="text-slate-800">Input Params:</strong> {JSON.stringify(toolCall.input)}
      </div>

      <div className="text-[11px] text-slate-800 bg-white p-2.5 rounded-lg border border-[#E6D9C5]">
        <strong className="text-[#E55B13] block mb-1">Output Summary:</strong>
        <pre className="whitespace-pre-wrap text-[11px] text-slate-800 font-mono">
          {JSON.stringify(toolCall.outputSummary, null, 2)}
        </pre>
      </div>
    </div>
  );
};
