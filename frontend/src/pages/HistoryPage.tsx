import React, { useEffect, useState } from 'react';
import { HistoryRun } from '../types';
import { apiService } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { History, ChevronDown, ChevronUp, Terminal, Clock, CheckCircle2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [runs, setRuns] = useState<HistoryRun[]>([]);
  const [expandedRunId, setExpandedRunId] = useState<string | null>('RUN-9921');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const data = await apiService.getHistoryRuns();
      setRuns(data);
      setLoading(false);
    }
    loadHistory();
  }, []);

  const toggleRun = (runId: string) => {
    setExpandedRunId(expandedRunId === runId ? null : runId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Clock className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Querying Audit Trace History...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Previous Agent Investigation Runs
          </h2>
          <p className="text-xs text-slate-400">
            Historical execution trace records, PRISM evaluations, and tool telemetry.
          </p>
        </div>
      </div>

      <div className="fg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0F1D] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1E2945]">
              <tr>
                <th className="p-4">Run ID</th>
                <th className="p-4">Transaction</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Risk Rating</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Tools Used</th>
                <th className="p-4">PRISM Result</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Trace Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2945]/60">
              {runs.map((run) => (
                <React.Fragment key={run.runId}>
                  <tr
                    onClick={() => toggleRun(run.runId)}
                    className="hover:bg-[#121B33] cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-cyan-400">{run.runId}</td>
                    <td className="p-4 font-mono font-bold text-white">{run.transactionId}</td>
                    <td className="p-4 font-mono text-cyan-300">{run.amount}</td>
                    <td className="p-4">
                      <RiskBadge risk={run.risk} />
                    </td>
                    <td className="p-4 font-mono text-slate-400">{run.duration}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {run.toolsUsed.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#070A12] border border-[#1E2945] text-[10px] font-mono text-slate-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={run.prismResult} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      {expandedRunId === run.runId ? (
                        <ChevronUp className="w-4 h-4 inline text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 inline" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Trace Timeline */}
                  {expandedRunId === run.runId && (
                    <tr>
                      <td colSpan={9} className="p-6 bg-[#070A12] border-b border-[#1E2945]">
                        <div className="space-y-4">
                          <h4 className="font-bold text-xs text-white font-mono uppercase tracking-wider flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            Execution Trace Timeline for {run.runId} ({run.transactionId})
                          </h4>

                          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2945]">
                            {run.trace.map((step) => (
                              <div key={step.id} className="relative space-y-1 text-xs">
                                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400"></div>
                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="font-bold text-white">{step.event}</span>
                                  <span className="font-mono text-slate-500 text-[10px]">{step.timestamp} ({step.durationMs}ms)</span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono bg-[#0A0F1D] p-2 rounded border border-[#18233D]">
                                  {step.details}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
