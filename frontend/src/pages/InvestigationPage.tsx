import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Investigation } from '../types';
import { apiService } from '../services/api';
import { WorkflowStepper } from '../components/investigation/WorkflowStepper';
import { AgentTimeline } from '../components/investigation/AgentTimeline';
import { HumanReviewPanel } from '../components/investigation/HumanReviewPanel';
import { RiskBadge } from '../components/common/RiskBadge';
import { Shield, Clock, AlertTriangle, Cpu, ExternalLink } from 'lucide-react';

export const InvestigationPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await apiService.getInvestigation(transactionId || 'TXN10291');
      setInvestigation(data);
      setLoading(false);
    }
    loadData();
  }, [transactionId]);

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
              <RiskBadge risk={investigation.riskLevel} score={investigation.riskScore} />
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
            <span className="text-slate-500 block text-[10px]">NORMAL WINDOW</span>
            <span className="text-slate-300">{investigation.transaction.normalWindow}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">HISTORICAL AVG</span>
            <span className="text-slate-300">{investigation.transaction.historicalAvg}</span>
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

      {/* Reusable Workflow Stepper */}
      <WorkflowStepper workflow={investigation.workflow} />

      {/* Main Grid: Timeline vs AI Reasoning & Human Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline & Tools */}
        <div className="lg:col-span-7 space-y-6">
          <AgentTimeline timeline={investigation.timeline} />
        </div>

        {/* Right Column: AI Reasoning & Human Governance */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Reasoning Card */}
          <div className="fg-card p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
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

          {/* Reusable Human Review Panel */}
          <HumanReviewPanel
            investigationId={investigation.id}
            recommendation={investigation.recommendation}
          />
        </div>
      </div>
    </div>
  );
};
