import React from 'react';
import { AgentTrace } from '../../types';
import { ToolCallCard } from './ToolCallCard';
import { Clock, CheckCircle2 } from 'lucide-react';

interface AgentTimelineProps {
  timeline: AgentTrace[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ timeline }) => {
  return (
    <div className="fg-card p-6 space-y-4 bg-white border border-[#E6D9C5] shadow-sm">
      <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#E55B13]" />
        Agent Activity & Timeline
      </h3>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E6D9C5]">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-8 space-y-2">
            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#FFF2EB] border border-[#FCD5C1] flex items-center justify-center text-[#E55B13] text-xs font-mono font-bold shadow-xs">
              ✓
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{item.event}</span>
              <span className="font-mono text-slate-500 text-[11px] font-medium">{item.timestamp}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>

            {item.toolCall && <ToolCallCard toolCall={item.toolCall} />}
          </div>
        ))}
      </div>
    </div>
  );
};
