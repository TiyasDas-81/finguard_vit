import React, { useEffect, useState } from 'react';
import { TraceStep } from '../types';
import { apiService } from '../services/api';
import { History, Clock, CheckCircle2, AlertTriangle, Cpu, Terminal, ArrowDown } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [traces, setTraces] = useState<TraceStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrace() {
      const data = await apiService.getTraceTimeline('TXN10291');
      setTraces(data);
      setLoading(false);
    }
    loadTrace();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Clock className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Loading Cryptographic Trace Audit Logs...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Audit Trace & Agent Execution Timeline
          </h2>
          <p className="text-xs text-slate-400">
            End-to-end execution trace for investigation <strong className="text-slate-200">INV-10291 (TXN10291)</strong>.
          </p>
        </div>

        <span className="font-mono text-xs text-slate-400 bg-[#0F1629] px-3 py-1.5 rounded-lg border border-[#1E2945]">
          Total Execution Latency: <strong className="text-cyan-400">7.86s</strong>
        </span>
      </div>

      {/* Trace Timeline List */}
      <div className="fg-card p-8 relative space-y-8">
        {traces.map((step, index) => (
          <div key={step.id} className="relative pl-12 flex flex-col md:flex-row md:items-start justify-between gap-4 group">
            {/* Connecting Vertical Line */}
            {index < traces.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-[#1E2945] group-hover:bg-cyan-500/40 transition-colors"></div>
            )}

            {/* Step Number Circle */}
            <div
              className={`absolute left-0 top-0 w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all ${
                step.status === 'PRISM_CORRECTED'
                  ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                  : 'bg-[#0F1629] border-cyan-500/40 text-cyan-400'
              }`}
            >
              0{step.stepNumber}
            </div>

            {/* Content */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-white">{step.title}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    step.status === 'PRISM_CORRECTED'
                      ? 'badge-prism'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {step.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Service: <span className="text-slate-200">{step.service}</span> &bull; Timestamp: {step.timestamp}
              </div>

              <p className="text-xs text-slate-300 bg-[#070A12] p-3 rounded-lg border border-[#1E2945] mt-2 font-mono">
                {step.details}
              </p>
            </div>

            {/* Duration Badge */}
            <div className="text-right font-mono text-xs text-slate-400 whitespace-nowrap">
              <span className="px-2.5 py-1 rounded bg-[#0A0F1D] border border-[#1E2945]">
                {step.durationMs}ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
