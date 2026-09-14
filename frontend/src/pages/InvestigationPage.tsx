import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { InvestigationData } from '../types';
import { apiService } from '../services/api';
import { Shield, CheckCircle, Clock, AlertTriangle, Cpu, Terminal, ArrowRight, UserCheck, Lock, AlertOctagon, ExternalLink } from 'lucide-react';

export const InvestigationPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [investigation, setInvestigation] = useState<InvestigationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionSubmitted, setActionSubmitted] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await apiService.getInvestigation(transactionId || 'TXN10291');
      setInvestigation(data);
      setLoading(false);
    }
    loadData();
  }, [transactionId]);

  const handleDecision = async (decision: 'APPROVE_BLOCK' | 'FLAG_FOR_MONITORING' | 'DISMISS') => {
    if (!investigation) return;
    const res = await apiService.submitHumanReview(investigation.id, decision, 'Analyst manual action executed from investigation view.');
    setActionSubmitted(res.message);
  };

  if (loading || !investigation) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Clock className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Generating AI Investigation Dossier...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Transaction Summary */}
      <div className="fg-card p-6 border-l-4 border-l-red-500 bg-gradient-to-r from-[#0F1629] via-[#121B33] to-[#0A0F1D]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-high px-3 py-1 rounded text-xs font-mono font-bold">
                {investigation.dossierStatus}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Case Ref: <strong>{investigation.id}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Transaction Investigation: <span className="text-cyan-400 font-mono">{investigation.transactionId}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customer: <strong className="text-slate-200">{investigation.customer.name} ({investigation.customer.id})</strong> &bull; Location: {investigation.customer.location}
            </p>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-xl bg-[#070A12] border border-[#1E2945]">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Amount Flagged</div>
              <div className="text-2xl font-extrabold text-cyan-300 font-mono">{investigation.transaction.amount}</div>
            </div>
            <div className="h-8 w-px bg-[#1E2945]"></div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">AI Risk Rating</div>
              <div className="text-2xl font-extrabold text-red-400 font-mono flex items-center gap-1">
                {investigation.riskScore}% <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="h-8 w-px bg-[#1E2945]"></div>
            <NavLink
              to={`/evidence/${investigation.id}`}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Visual Evidence Chain <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-4 border-t border-[#1E2945]/70 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">MERCHANT</span>
            <span className="text-white font-semibold">{investigation.transaction.merchant}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">TIME</span>
            <span className="text-amber-400 font-semibold">{investigation.transaction.time}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CATEGORY</span>
            <span className="text-slate-300">{investigation.transaction.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">HISTORICAL AVG</span>
            <span className="text-slate-300">{investigation.customer.avgTxnAmount}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">IP ADDRESS</span>
            <span className="text-red-400">{investigation.transaction.ipAddress}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DEVICE FINGERPRINT</span>
            <span className="text-slate-300">{investigation.transaction.device}</span>
          </div>
        </div>
      </div>

      {/* 5-STAGE WORKFLOW STEPPER */}
      <div className="fg-card p-6">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Agent Autonomous Reasoning Workflow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {investigation.workflow.map((step, idx) => (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 relative ${
                step.status === 'completed'
                  ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                  : 'bg-[#0A0F1D] border-[#1E2945] text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-400">
                  0{idx + 1}
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">{step.id}</div>
                <div className="text-[11px] text-slate-300">{step.label}</div>
              </div>
              <div className="text-[10px] font-mono text-slate-400">{step.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Section: Timeline & Tool Calls vs Risk & AI Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Agent Timeline & Tool Calls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fg-card p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Agent Investigation Timeline & Tool Execution
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#1E2945]">
              {investigation.timeline.map((item) => (
                <div key={item.id} className="relative pl-8 space-y-2">
                  <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#0F1629] border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-mono">
                    ✓
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.title}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{item.time}</span>
                  </div>

                  <p className="text-xs text-slate-300">{item.description}</p>

                  {/* Tool Call Sub-card if present */}
                  {item.toolCall && (
                    <div className="p-3.5 rounded-xl bg-[#070A12] border border-[#1E2945] text-xs space-y-2 font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" /> {item.toolCall.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                          {item.toolCall.statusCode} OK ({item.toolCall.latencyMs}ms)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Input Params: {JSON.stringify(item.toolCall.input)}</div>
                      <div className="text-[11px] text-slate-300 bg-[#090E1A] p-2 rounded border border-[#18233D]">
                        Output: {JSON.stringify(item.toolCall.output)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Reasoning & Human Decision Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Reasoning Card */}
          <div className="fg-card p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Multi-Vector Synthesis & Reasoning
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-300">
              {investigation.aiReasoning.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E2945]">
                  <span className="text-cyan-400 font-mono font-bold">&bull;</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Human Review Decision Section */}
          <div className="fg-card-glow p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <Lock className="w-4 h-4" />
              HUMAN ANALYST DECISION GATEWAY
            </div>

            <div className="p-3 rounded-lg bg-[#070A12] border border-red-500/30 text-xs">
              <span className="text-slate-400 block text-[10px]">AGENT RECOMMENDATION</span>
              <span className="font-bold text-red-400 font-mono text-sm">{investigation.recommendation}</span>
            </div>

            {actionSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Action Confirmed
                </div>
                <div>{actionSubmitted}</div>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleDecision('APPROVE_BLOCK')}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" /> Confirm Block & Freeze Account
                </button>
                <button
                  onClick={() => handleDecision('FLAG_FOR_MONITORING')}
                  className="w-full py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-all"
                >
                  Flag Account for 48h Enhanced Monitoring
                </button>
                <button
                  onClick={() => handleDecision('DISMISS')}
                  className="w-full py-2 rounded-xl bg-[#121A2F] hover:bg-[#1A2645] text-slate-400 hover:text-slate-200 text-xs transition-all"
                >
                  Dismiss as False Positive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
