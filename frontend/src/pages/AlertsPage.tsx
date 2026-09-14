import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertItem } from '../types';
import { apiService } from '../services/api';
import { Shield, Filter, Search, ArrowUpDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      const data = await apiService.getAlerts();
      setAlerts(data);
      setLoading(false);
    }
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === 'ALL' || alert.status === filter;
    const matchesSearch =
      alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            Security & Anomaly Alerts Feed
          </h2>
          <p className="text-xs text-slate-400">
            Real-time financial anomaly triggers ingested from transaction stream.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Txn, Customer, Merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0F1629] border border-[#1E2945] focus:border-cyan-500 rounded-xl text-xs text-slate-200 pl-9 pr-4 py-2 outline-none w-64 transition-all"
            />
          </div>

          <div className="flex items-center bg-[#0F1629] p-1 rounded-xl border border-[#1E2945]">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === status
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Main Demo Highlight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-[#0F1629] to-cyan-950/30 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold font-mono text-sm">
            87%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">TXN10291 (Main Demo Case)</span>
              <span className="badge-high px-2 py-0.5 rounded text-[10px] font-bold">HIGH RISK</span>
            </div>
            <p className="text-xs text-slate-300">
              Customer: <strong className="text-slate-100">CUST458</strong> &bull; Amount: <strong className="text-cyan-300">₹78,000</strong> &bull; Merchant: <strong className="text-slate-100">XYZ Electronics</strong> &bull; Time: 02:17 AM
            </p>
          </div>
        </div>

        <NavLink
          to="/investigation/TXN10291"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Investigate TXN10291 &rarr;
        </NavLink>
      </div>

      {/* Main Alerts Table */}
      <div className="fg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0F1D] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1E2945]">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Merchant</th>
                <th className="p-4">Time</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2945]/60">
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.transactionId}
                  className={`hover:bg-[#121B33] transition-colors ${
                    alert.transactionId === 'TXN10291' ? 'bg-cyan-950/20 font-medium' : ''
                  }`}
                >
                  <td className="p-4 font-mono font-bold text-white">
                    <div className="flex items-center gap-2">
                      {alert.transactionId === 'TXN10291' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                      )}
                      <span>{alert.transactionId}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{alert.customerId}</td>
                  <td className="p-4 font-mono font-bold text-cyan-300">{alert.amount}</td>
                  <td className="p-4 text-slate-200">{alert.merchant}</td>
                  <td className="p-4 font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {alert.time}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#070A12] h-2 rounded-full overflow-hidden border border-[#1E2945]">
                        <div
                          className={`h-full rounded-full ${
                            alert.riskScore >= 80
                              ? 'bg-red-500'
                              : alert.riskScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${alert.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-200">{alert.riskScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        alert.status === 'HIGH'
                          ? 'badge-high'
                          : alert.status === 'MEDIUM'
                          ? 'badge-medium'
                          : 'badge-low'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <NavLink
                      to={`/investigation/${alert.transactionId}`}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 ${
                        alert.transactionId === 'TXN10291'
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-[#121A2F] hover:bg-[#1A2645] text-cyan-400 border border-cyan-500/30'
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
    </div>
  );
};
