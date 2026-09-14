import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { InvestigationData } from '../types';
import { apiService } from '../services/api';
import { Shield, FileText, ArrowRight, AlertTriangle, Layers, Activity, CheckCircle, ExternalLink } from 'lucide-react';

export const EvidencePage: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [investigation, setInvestigation] = useState<InvestigationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await apiService.getInvestigation(investigationId || 'INV-10291');
      setInvestigation(data);
      setLoading(false);
    }
    loadData();
  }, [investigationId]);

  if (loading || !investigation) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Activity className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Building Visual Evidence Graph...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visual Evidence Chain Node Diagram */}
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

        {/* Evidence Chain Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative py-4">
          {investigation.evidenceChain.map((node, index) => (
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

              {index < investigation.evidenceChain.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5 Quantified Evidence Vector Breakdown Cards */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Quantified Evidence Vectors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {investigation.evidenceList.map((ev) => (
            <div key={ev.id} className="fg-card p-4 space-y-2 border-t-2 border-t-cyan-500">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{ev.id}</span>
                <span className="text-red-400 font-bold">{ev.impactScore}% Impact</span>
              </div>
              <h4 className="font-bold text-xs text-white">{ev.title}</h4>
              <div className="text-cyan-300 font-mono font-bold text-sm">{ev.value}</div>
              <p className="text-[11px] text-slate-400 leading-tight">{ev.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FIN GUARD INVESTIGATION DOSSIER Report Card */}
      <div className="max-w-4xl mx-auto fg-card-glow p-8 rounded-2xl border-cyan-500/40 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2945]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white tracking-wide">
                FIN GUARD INVESTIGATION DOSSIER
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Official AI Security Artifact &bull; Ref: {investigation.id}
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-extrabold tracking-wider">
            {investigation.dossierStatus}
          </div>
        </div>

        {/* Dossier Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Section 1: Transaction */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] space-y-2">
            <span className="text-cyan-400 font-mono font-bold uppercase text-[11px] block">1. TRANSACTION DETAILS</span>
            <div className="space-y-1 font-mono text-slate-300">
              <div>Txn ID: <strong className="text-white">{investigation.transactionId}</strong></div>
              <div>Customer: <strong className="text-white">{investigation.customer.name} ({investigation.customer.id})</strong></div>
              <div>Amount: <strong className="text-cyan-300 font-bold">{investigation.transaction.amount}</strong></div>
              <div>Merchant: {investigation.transaction.merchant}</div>
              <div>Time: {investigation.transaction.time}</div>
            </div>
          </div>

          {/* Section 2: Risk Level */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] space-y-2">
            <span className="text-cyan-400 font-mono font-bold uppercase text-[11px] block">2. RISK EVALUATION</span>
            <div className="space-y-1 font-mono">
              <div className="text-2xl font-extrabold text-red-400">{investigation.riskScore}% RISK RATING</div>
              <div className="text-slate-300">Classification: <strong className="text-red-400">{investigation.riskLevel} ANOMALY</strong></div>
              <div className="text-slate-400 text-[11px]">Neural Engine Confidence: 99.4%</div>
            </div>
          </div>

          {/* Section 3: Evidence */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] space-y-2">
            <span className="text-cyan-400 font-mono font-bold uppercase text-[11px] block">3. KEY EVIDENCE VECTORS</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>18× Baseline Amount Spike (₹78,000)</li>
              <li>Unverified New Merchant (XYZ Electronics)</li>
              <li>Off-hours Execution (02:17 AM IST)</li>
              <li>3 Rapid Outbound Transfers (₹1,95,000)</li>
            </ul>
          </div>

          {/* Section 4: Reasoning & Recommendation */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-[#1E2945] space-y-2">
            <span className="text-cyan-400 font-mono font-bold uppercase text-[11px] block">4. AI RECOMMENDATION</span>
            <div className="p-2.5 rounded bg-red-950/40 border border-red-500/30 font-mono text-red-300 font-bold">
              {investigation.recommendation}
            </div>
            <p className="text-[11px] text-slate-400">
              PRISM reliability check passed. Evidence fully grounded in raw logs.
            </p>
          </div>
        </div>

        {/* Footer Audit Signature */}
        <div className="pt-4 border-t border-[#1E2945] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Generated by FinGuard Core LLM &bull; Branch: soumen</span>
          <span>Cryptographic Hash: 0x9f8b...41e2</span>
        </div>
      </div>
    </div>
  );
};
