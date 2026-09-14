import React from 'react';
import { EvidenceChainNode } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

interface EvidenceChainProps {
  chain: EvidenceChainNode[];
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ chain }) => {
  return (
    <div className="fg-card p-6 space-y-6 bg-white border border-[#E6D9C5] shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E55B13]" />
            Visual Evidence Chain & Anomaly Propagation
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Interactive node graph tracing anomaly origin to consolidated risk rating.
          </p>
        </div>

        <span className="badge-high px-3 py-1 rounded-full text-xs font-mono font-extrabold">
          CONVERGENCE: 87% RISK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative py-4">
        {chain.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center text-center relative group">
            <div
              className={`w-full p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all group-hover:scale-105 shadow-xs ${
                node.severity === 'critical'
                  ? 'bg-[#FFEBEB] border-[#FCA5A5] text-[#DC2626]'
                  : node.severity === 'warning'
                  ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#D97706]'
                  : 'bg-[#FFF2EB] border-[#FCD5C1] text-[#E55B13]'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-500 font-extrabold uppercase">Node 0{index + 1}</span>
              <div className="font-black text-xs text-slate-900 leading-tight">{node.label}</div>
              <div className="text-[10px] font-mono text-slate-700 font-bold">{node.subtitle}</div>
            </div>

            {index < chain.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-4 h-4 text-[#E55B13]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
