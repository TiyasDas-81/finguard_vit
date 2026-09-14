import React from 'react';
import { Evidence } from '../../types';

interface EvidenceCardProps {
  evidence: Evidence;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  return (
    <div className="fg-card p-5 space-y-2 border-t-4 border-t-[#E55B13] bg-white border border-[#E6D9C5] shadow-sm">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="font-bold">{evidence.id}</span>
        <span className="text-[#DC2626] font-extrabold">{evidence.impactScore}% Impact</span>
      </div>
      <h4 className="font-extrabold text-xs text-slate-900">{evidence.title}</h4>
      <div className="text-[#E55B13] font-mono font-black text-base">{evidence.value}</div>
      <p className="text-[11px] text-slate-600 leading-normal font-medium">{evidence.description}</p>
    </div>
  );
};
