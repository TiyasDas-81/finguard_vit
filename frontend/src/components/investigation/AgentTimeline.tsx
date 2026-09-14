import React from 'react';
import { AgentTrace } from '../../types';
import { ToolCallCard } from './ToolCallCard';
import { Clock, CheckCircle2 } from 'lucide-react';

interface AgentTimelineProps {
  timeline: AgentTrace[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ timeline }) => {
  return (
    <div className="fg-card p-6 space-y-4">
      <h3 className="font-bold text-lg text-white flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        Agent Activity & Timeline
      </h3>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#1E2945]">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-8 space-y-2">
            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#0F1629] border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-mono">
              ✓
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{item.event}</span>
              <span className="font-mono text-slate-400 text-[11px]">{item.timestamp}</span>
            </div>

            <p className="text-xs text-slate-300">{item.details}</p>

            {item.toolCall && <ToolCallCard toolCall={item.toolCall} />}
          </div>
        ))}
      </div>
    </div>
  );
};
