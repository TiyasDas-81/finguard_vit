import React from 'react';
import { Evidence } from '../../types';

interface EvidenceCardProps {
  evidence: Evidence;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  return (
    <div className="fg-card p-4 space-y-2 border-t-2 border-t-cyan-500">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>{evidence.id}</span>
        <span className="text-red-400 font-bold">{evidence.impactScore}% Impact</span>
      </div>
      <h4 className="font-bold text-xs text-white">{evidence.title}</h4>
      <div className="text-cyan-300 font-mono font-bold text-sm">{evidence.value}</div>
      <p className="text-[11px] text-slate-400 leading-tight">{evidence.description}</p>
    </div>
  );
};
