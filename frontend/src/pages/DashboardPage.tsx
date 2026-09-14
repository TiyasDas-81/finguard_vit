import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertItem, PrismMetrics } from '../types';
import { apiService } from '../services/api';
import { Shield, AlertTriangle, CheckCircle, Cpu, Zap, Clock, Activity, FileSearch, ChevronRight, ArrowUpRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [prism, setPrism] = useState<PrismMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, prismData] = await Promise.all([
          apiService.getAlerts(),
          apiService.getPrismEvaluations(),
        ]);
        setAlerts(alertsData);
        setPrism(prismData);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const highRiskCount = alerts.filter((a) => a.status === 'HIGH').length;
  const mediumRiskCount = alerts.filter((a) => a.status === 'MEDIUM').length;
  const lowRiskCount = alerts.filter((a) => a.status === 'LOW').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        <Activity className="w-5 h-5 animate-spin text-[#E55B13] mr-2" /> Initializing FinGuard Analytics Engine...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Pitch Deck Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#FFF9F3] to-[#FFF3EC] p-8 border border-[#FCD5C1] shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#FFF2EB] text-[#E55B13] border border-[#FCD5C1] text-xs font-mono font-bold">
                TRACK: AI FOR FINANCE &bull; FRAUD AWARENESS & DECISION SUPPORT
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              FIN<span className="text-[#E55B13]">GUARD</span>
            </h2>
            <p className="text-slate-700 max-w-2xl text-base font-semibold leading-relaxed">
              AI-Powered Financial Investigation Agent
            </p>
            <p className="text-slate-500 max-w-2xl text-xs mt-1">
              Autonomous Evidence Synthesis &bull; PRISM Mandatory Reliability Layer &bull; Human-in-the-Loop Governance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <NavLink
              to="/investigation/TXN10291"
              className="px-6 py-3 rounded-2xl bg-[#E55B13] hover:bg-[#D04E09] text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Launch TXN10291 Investigation
            </NavLink>
            <NavLink
              to="/prism"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF2EB] text-[#E55B13] border border-[#FCD5C1] font-extrabold text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <Cpu className="w-4 h-4 text-[#E55B13]" />
              PRISM Reliability Engine
            </NavLink>
          </div>
        </div>
      </div>

      {/* Core System Metrics Grid */}
      <div>
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#E55B13] mb-4">
          Core System Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Alerts */}
          <div className="fg-card p-5 border-l-4 border-l-[#E55B13]">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700">Total Alerts</span>
              <AlertTriangle className="w-4 h-4 text-[#E55B13]" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">{alerts.length}</div>
            <div className="text-xs text-slate-500 mt-2 font-semibold">
              <span className="text-emerald-600 font-bold">100% Ingested</span> stream feed
            </div>
          </div>

          {/* High Risk */}
          <div className="fg-card p-5 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700">High Risk</span>
              <span className="badge-high px-2 py-0.5 rounded text-[10px] font-extrabold">URGENT</span>
            </div>
            <div className="text-3xl font-black text-red-600 font-mono">{highRiskCount}</div>
            <div className="text-xs text-slate-500 mt-2">
              Requires immediate analyst action
            </div>
          </div>

          {/* Medium Risk */}
          <div className="fg-card p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700">Medium Risk</span>
              <span className="badge-medium px-2 py-0.5 rounded text-[10px] font-extrabold">REVIEW</span>
            </div>
            <div className="text-3xl font-black text-amber-600 font-mono">{mediumRiskCount}</div>
            <div className="text-xs text-slate-500 mt-2">
              Flagged for queue review
            </div>
          </div>

          {/* Low Risk */}
          <div className="fg-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700">Low Risk</span>
              <span className="badge-low px-2 py-0.5 rounded text-[10px] font-extrabold">CLEARED</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 font-mono">{lowRiskCount}</div>
            <div className="text-xs text-slate-500 mt-2">
              Auto-resolved by agent
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Investigations Completed */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Investigations Completed</span>
            <FileSearch className="w-4 h-4 text-[#E55B13]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">1,358</div>
          <p className="text-xs text-slate-500 mt-1">Autonomous agent investigations executed</p>
        </div>

        {/* PRISM Failures */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">PRISM Failures Detected</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {prism?.failedRuns || 62}
          </div>
          <p className="text-xs text-purple-600/80 mt-1 font-semibold">Tool success ≠ Task success detections</p>
        </div>

        {/* Recovery Rate */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">PRISM Self-Recovery Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {prism?.recoveryRate || 93.5}%
          </div>
          <p className="text-xs text-emerald-600/80 mt-1 font-semibold">Auto-diagnosed & re-executed</p>
        </div>
      </div>

      {/* Main Alerts Preview & PRISM Failure View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Table Preview */}
        <div className="lg:col-span-2 fg-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D9C5]">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Featured High Risk Transactions</h3>
              <p className="text-xs text-slate-500">Live feed requiring AI dossier evaluation</p>
            </div>
            <NavLink
              to="/alerts"
              className="text-xs font-bold text-[#E55B13] hover:underline flex items-center gap-1"
            >
              View All Alerts ({alerts.length}) &rarr;
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F4ECE0] text-slate-600 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Merchant</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D9C5]">
                {alerts.slice(0, 4).map((alert) => (
                  <tr
                    key={alert.transactionId}
                    className={`hover:bg-[#FFF8F2] transition-colors ${
                      alert.transactionId === 'TXN10291' ? 'bg-[#FFF2EB]' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      {alert.transactionId === 'TXN10291' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E55B13] animate-ping"></span>
                      )}
                      {alert.transactionId}
                    </td>
                    <td className="p-3 font-mono text-slate-600">{alert.customerId}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{alert.amount}</td>
                    <td className="p-3 font-medium">{alert.merchant}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-extrabold ${
                            alert.riskScore >= 80
                              ? 'text-red-600'
                              : alert.riskScore >= 50
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {alert.riskScore}%
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                            alert.status === 'HIGH'
                              ? 'badge-high'
                              : alert.status === 'MEDIUM'
                              ? 'badge-medium'
                              : 'badge-low'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <NavLink
                        to={`/investigation/${alert.transactionId}`}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 ${
                          alert.transactionId === 'TXN10291'
                            ? 'bg-[#E55B13] text-white hover:bg-[#D04E09] shadow-md shadow-orange-500/20'
                            : 'bg-[#FFF2EB] text-[#E55B13] border border-[#FCD5C1] hover:bg-[#FFE6D9]'
                        }`}
                      >
                        Investigate
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRISM Failure Highlight Card */}
        <div className="fg-card-glow p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="badge-prism px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> PRISM FEATURED CASE
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">TXN10291</span>
            </div>

            <h4 className="font-extrabold text-slate-900 text-base mb-1">
              "Tool Success ≠ Task Success" Diagnostic
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Agent called generic balance tool which returned <strong className="text-emerald-600 font-bold">HTTP 200 OK</strong>, but investigation goal <strong className="text-red-600 font-bold">FAILED</strong>. PRISM automatically detected missing payload and auto-corrected.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#E6D9C5] text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Expected:</span>
                <span className="text-emerald-700 font-bold">Transaction History Tool</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Actual Executed:</span>
                <span className="text-amber-700 font-bold">Generic Balance Tool</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E6D9C5]">
                <span>PRISM Verdict:</span>
                <span className="text-[#E55B13] font-bold">VALIDATED ✓</span>
              </div>
            </div>
          </div>

          <NavLink
            to="/prism"
            className="w-full text-center py-3 rounded-xl bg-[#E55B13] hover:bg-[#D04E09] text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            Explore PRISM Failure Demonstration &rarr;
          </NavLink>
        </div>
      </div>
    </div>
  );
};
