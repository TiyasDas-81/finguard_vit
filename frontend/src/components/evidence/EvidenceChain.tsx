import React from 'react';
import { EvidenceChainNode } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

interface EvidenceChainProps {
  chain: EvidenceChainNode[];
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ chain }) => {
  return (
    <div className="fg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Visual Evidence Chain & Anomaly Propagation
          </h2>
          <p className="text-xs text-slate-400">
            Interactive node graph tracing anomaly origin to consolidated risk rating.
          </p>
        </div>

        <span className="badge-high px-3 py-1 rounded text-xs font-mono font-bold">
          CONVERGENCE: 87% RISK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative py-4">
        {chain.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center text-center relative group">
            <div
              className={`w-full p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all group-hover:scale-105 ${
                node.severity === 'critical'
                  ? 'bg-red-950/20 border-red-500/50 shadow-lg shadow-red-500/10 text-red-300'
                  : node.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/50 text-amber-300'
                  : 'bg-[#0F1629] border-[#1E2945] text-cyan-300'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold">Node 0{index + 1}</span>
              <div className="font-bold text-xs text-white leading-tight">{node.label}</div>
              <div className="text-[10px] font-mono text-slate-300">{node.subtitle}</div>
            </div>

            {index < chain.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
