import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertItem } from '../types';
import { apiService } from '../services/api';
import { Shield, Filter, Search, AlertCircle, Clock } from 'lucide-react';

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
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#E55B13]" />
            Security & Anomaly Alerts Feed
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Real-time financial anomaly triggers ingested from transaction stream.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Txn, Customer, Merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-[#E6D9C5] focus:border-[#E55B13] rounded-xl text-xs text-slate-900 pl-9 pr-4 py-2.5 outline-none w-64 transition-all shadow-xs font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E6D9C5] shadow-xs">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === status
                    ? 'bg-[#E55B13] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Main Demo Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-white via-[#FFF8F2] to-[#FFF2EB] border border-[#FCD5C1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-[#FFEBEB] border border-[#FCA5A5] flex items-center justify-center text-[#DC2626] font-black font-mono text-base shadow-xs">
            87%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-slate-900 text-sm">TXN10291 (Main Demo Case)</span>
              <span className="badge-high px-2 py-0.5 rounded text-[10px] font-extrabold">HIGH RISK</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Customer: <strong className="text-slate-900">CUST458</strong> &bull; Amount: <strong className="text-slate-900 font-extrabold">₹78,000</strong> &bull; Merchant: <strong className="text-slate-900">XYZ Electronics</strong> &bull; Time: 02:17 AM
            </p>
          </div>
        </div>

        <NavLink
          to="/investigation/TXN10291"
          className="px-6 py-2.5 rounded-xl bg-[#E55B13] hover:bg-[#D04E09] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Investigate TXN10291 &rarr;
        </NavLink>
      </div>

      {/* Main Alerts Table */}
      <div className="fg-card overflow-hidden bg-white border border-[#E6D9C5] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F4ECE0] text-slate-700 font-mono text-[11px] uppercase border-b border-[#E6D9C5]">
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
            <tbody className="divide-y divide-[#E6D9C5]">
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.transactionId}
                  className={`hover:bg-[#FFF8F2] transition-colors ${
                    alert.transactionId === 'TXN10291' ? 'bg-[#FFF2EB] font-medium' : ''
                  }`}
                >
                  <td className="p-4 font-mono font-black text-slate-900">
                    <div className="flex items-center gap-2">
                      {alert.transactionId === 'TXN10291' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E55B13] animate-ping"></span>
                      )}
                      <span>{alert.transactionId}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600 font-medium">{alert.customerId}</td>
                  <td className="p-4 font-mono font-black text-slate-900">{alert.amount}</td>
                  <td className="p-4 text-slate-800 font-medium">{alert.merchant}</td>
                  <td className="p-4 font-mono text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {alert.time}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#F4ECE0] h-2 rounded-full overflow-hidden border border-[#E6D9C5]">
                        <div
                          className={`h-full rounded-full ${
                            alert.riskScore >= 80
                              ? 'bg-[#DC2626]'
                              : alert.riskScore >= 50
                              ? 'bg-[#D97706]'
                              : 'bg-[#059669]'
                          }`}
                          style={{ width: `${alert.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{alert.riskScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
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
                      className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all inline-flex items-center gap-1 ${
                        alert.transactionId === 'TXN10291'
                          ? 'bg-[#E55B13] hover:bg-[#D04E09] text-white shadow-xs'
                          : 'bg-[#FFF2EB] hover:bg-[#FFE6D9] text-[#E55B13] border border-[#FCD5C1]'
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
