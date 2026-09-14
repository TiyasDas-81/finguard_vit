import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertItem, PrismMetrics } from '../types';
import { apiService } from '../services/api';
import { Shield, AlertTriangle, CheckCircle, Cpu, ArrowUpRight, Clock, Activity, Zap, ChevronRight, FileSearch } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Activity className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Loading FinGuard Analytics Engine...
      </div>
    );
  }

  return (
    <div className="space-[#070A12] space-y-8 animate-fade-in">
      {/* Title & Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#111A33] to-[#0A1224] p-8 border border-[#1E2945] shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                FINANCIAL INTEGRITY CONTROL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold">
                PRISM RELIABILITY ENGINE ACTIVE
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              FinGuard Autonomous Investigation Center
            </h2>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
              Real-time AI agent triaging financial transaction anomalies, multi-vector evidence graph synthesis, and PRISM self-correcting reliability enforcement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <NavLink
              to="/investigation/TXN10291"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Launch Active Investigation (TXN10291)
            </NavLink>
            <NavLink
              to="/prism"
              className="px-4 py-2.5 rounded-xl bg-[#121A2F] hover:bg-[#1A2645] text-purple-300 border border-purple-500/30 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              PRISM Reliability Dashboard
            </NavLink>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Core System Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Alerts */}
          <div className="fg-card p-5">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Total Alerts</span>
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{alerts.length}</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">100% Ingested</span> real-time feed
            </div>
          </div>

          {/* High Risk */}
          <div className="fg-card p-5 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">High Risk</span>
              <span className="badge-high px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
            </div>
            <div className="text-3xl font-extrabold text-red-400 font-mono">{highRiskCount}</div>
            <div className="text-xs text-slate-400 mt-2">
              Requires immediate analyst action
            </div>
          </div>

          {/* Medium Risk */}
          <div className="fg-card p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Medium Risk</span>
              <span className="badge-medium px-2 py-0.5 rounded text-[10px] font-bold">REVIEW</span>
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{mediumRiskCount}</div>
            <div className="text-xs text-slate-400 mt-2">
              Flagged for queue review
            </div>
          </div>

          {/* Low Risk */}
          <div className="fg-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold">Low Risk</span>
              <span className="badge-low px-2 py-0.5 rounded text-[10px] font-bold">CLEARED</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{lowRiskCount}</div>
            <div className="text-xs text-slate-400 mt-2">
              Auto-resolved by agent
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Investigations Completed */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Investigations Completed</span>
            <FileSearch className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,358</div>
          <p className="text-xs text-slate-400 mt-1">Autonomous agent investigations executed</p>
        </div>

        {/* PRISM Failures */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">PRISM Failures Detected</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {prism?.failedRuns || 62}
          </div>
          <p className="text-xs text-purple-300/80 mt-1">Tool success ≠ Task success detections</p>
        </div>

        {/* Recovery Rate */}
        <div className="fg-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">PRISM Self-Recovery Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {prism?.recoveryRate || 93.5}%
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">Auto-diagnosed and re-executed successfully</p>
        </div>
      </div>

      {/* Main Demo Action & Recent High-Risk Alerts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Table Preview */}
        <div className="lg:col-span-2 fg-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2945]">
            <div>
              <h3 className="font-bold text-lg text-white">Featured High Risk Transactions</h3>
              <p className="text-xs text-slate-400">Live feed requiring AI dossier evaluation</p>
            </div>
            <NavLink
              to="/alerts"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All Alerts ({alerts.length}) &rarr;
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A0F1D] text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Merchant</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2945]/50">
                {alerts.slice(0, 4).map((alert) => (
                  <tr
                    key={alert.transactionId}
                    className={`hover:bg-[#121B33] transition-colors ${
                      alert.transactionId === 'TXN10291' ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-white flex items-center gap-1.5">
                      {alert.transactionId === 'TXN10291' && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      )}
                      {alert.transactionId}
                    </td>
                    <td className="p-3 font-mono">{alert.customerId}</td>
                    <td className="p-3 font-mono font-semibold text-cyan-300">{alert.amount}</td>
                    <td className="p-3">{alert.merchant}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            alert.riskScore >= 80
                              ? 'text-red-400'
                              : alert.riskScore >= 50
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {alert.riskScore}%
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 ${
                          alert.transactionId === 'TXN10291'
                            ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                            : 'bg-[#121A2F] text-cyan-400 hover:bg-[#1A2645] border border-cyan-500/30'
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
        <div className="fg-card-glow p-6 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="badge-prism px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> PRISM FEATURED CASE
              </span>
              <span className="text-[10px] font-mono text-slate-400">TXN10291</span>
            </div>

            <h4 className="font-bold text-white text-base mb-1">
              "Tool Success ≠ Task Success" Failure Diagnostic
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Agent called generic balance tool which returned <strong className="text-emerald-400">HTTP 200 OK</strong>, but investigation goal <strong className="text-red-400">FAILED</strong>. PRISM automatically detected missing payload and auto-corrected.
            </p>

            <div className="p-3 rounded-lg bg-[#070A12] border border-purple-500/30 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Expected:</span>
                <span className="text-emerald-400">get_customer_baseline_history</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Actual Executed:</span>
                <span className="text-amber-400">get_simple_account_balance</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#1E2945]">
                <span>PRISM Verdict:</span>
                <span className="text-purple-400 font-bold">RECOVERED & VALIDATED ✓</span>
              </div>
            </div>
          </div>

          <NavLink
            to="/prism"
            className="w-full text-center py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            Explore PRISM Reliability View &rarr;
          </NavLink>
        </div>
      </div>
    </div>
  );
};
