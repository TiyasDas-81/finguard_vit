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
      <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        <Clock className="w-5 h-5 animate-spin text-[#E55B13] mr-2" /> Generating AI Investigation Dossier...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Transaction Summary - High Contrast Presentation Slide Theme */}
      <div className="fg-card p-6 border-l-4 border-l-[#DC2626] bg-gradient-to-r from-white via-[#FFFBF7] to-[#FFF4EC] border border-[#FCD5C1] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge risk={investigation.riskLevel} score={investigation.riskScore} />
              <span className="text-xs font-mono text-slate-600 font-semibold">
                Case Ref: <strong className="text-slate-900">{investigation.id}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Transaction Investigation: <span className="text-[#E55B13] font-mono">{investigation.transactionId}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Customer: <strong className="text-slate-900 font-bold">{investigation.customer.name} ({investigation.customer.id})</strong> &bull; Location: {investigation.customer.location}
            </p>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-2xl bg-white border border-[#E6D9C5] shadow-xs">
            <div>
              <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">Amount Flagged</div>
              <div className="text-2xl font-black text-slate-900 font-mono">{investigation.transaction.amount}</div>
            </div>
            <div className="h-8 w-px bg-[#E6D9C5]"></div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">AI Risk Rating</div>
              <div className="text-2xl font-black text-[#DC2626] font-mono flex items-center gap-1">
                {investigation.riskScore}% <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              </div>
            </div>
            <div className="h-8 w-px bg-[#E6D9C5]"></div>
            <NavLink
              to={`/evidence/${investigation.id}`}
              className="px-4 py-2.5 rounded-xl bg-[#FFF2EB] hover:bg-[#FFE6D9] text-[#E55B13] border border-[#FCD5C1] text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
            >
              Visual Evidence Chain <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-4 border-t border-[#E6D9C5] text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">MERCHANT</span>
            <span className="text-slate-900 font-extrabold">{investigation.transaction.merchant}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">TIME</span>
            <span className="text-[#D97706] font-extrabold">{investigation.transaction.time}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">NORMAL WINDOW</span>
            <span className="text-slate-800 font-semibold">{investigation.transaction.normalWindow}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">HISTORICAL AVG</span>
            <span className="text-slate-800 font-semibold">{investigation.transaction.historicalAvg}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">IP ADDRESS</span>
            <span className="text-[#DC2626] font-extrabold">{investigation.transaction.ipAddress}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E6D9C5]">
            <span className="text-slate-500 block text-[10px] font-bold">DEVICE FINGERPRINT</span>
            <span className="text-slate-800 font-semibold">{investigation.transaction.device}</span>
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
          <div className="fg-card p-6 space-y-4 bg-white border border-[#E6D9C5] shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#E55B13]" />
              AI Multi-Vector Synthesis & Reasoning
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {investigation.aiReasoning.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF5ED] border border-[#E6D9C5] font-medium leading-relaxed">
                  <span className="text-[#E55B13] font-mono font-black text-sm">&bull;</span>
                  <span className="text-slate-800">{line}</span>
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
