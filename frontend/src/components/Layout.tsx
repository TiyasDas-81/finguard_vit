import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Shield, Bell, Search, Activity, FileText, History, Cpu, ChevronRight, CheckCircle, Database } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/alerts')) return 'Security Alerts';
    if (location.pathname.startsWith('/investigation')) return 'Investigation Dossier';
    if (location.pathname.startsWith('/evidence')) return 'Evidence Visualizer';
    if (location.pathname.startsWith('/prism')) return 'PRISM Reliability Monitor';
    if (location.pathname.startsWith('/history')) return 'Audit Trace & History';
    return 'Investigation Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#1E2945] bg-[#0A0F1D]/90 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-[#0F1629] rounded-[10px] flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-400">
                FinGuard
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                v2.4 AI-AGENT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">AI-Powered Financial Investigation Agent</p>
          </div>
        </div>

        {/* Live System Status Indicator */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#0F1629] px-3 py-1.5 rounded-lg border border-[#1E2945]">
            <span className="pulse-dot bg-emerald-400"></span>
            <span>Agent Status: <strong className="text-emerald-400 font-semibold">Active Monitoring</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#0F1629] px-3 py-1.5 rounded-lg border border-[#1E2945]">
            <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>PRISM Guard: <strong className="text-purple-400 font-semibold">Online (99.1% Grounded)</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-800/40 font-mono">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Mock Mode (Standalone)</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#1E2945] bg-[#090D1A] p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              Platform Navigation
            </div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <Bell className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span>Alerts</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/60">
                  2 HIGH
                </span>
              </div>
            </NavLink>

            <NavLink
              to="/investigation/TXN10291"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <Search className="w-4 h-4" />
              <span>Investigation</span>
            </NavLink>

            <NavLink
              to="/evidence/INV-10291"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Evidence Graph</span>
            </NavLink>

            <NavLink
              to="/prism"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/10 text-purple-400 border border-purple-500/30 shadow-md shadow-purple-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <Cpu className="w-4 h-4" />
              <span>PRISM Reliability</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121829]'
                }`
              }
            >
              <History className="w-4 h-4" />
              <span>Trace History</span>
            </NavLink>
          </div>

          {/* Quick Active Case Widget */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#0F1629] to-[#121B33] border border-[#1E2945] text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">Active Case</span>
              <span className="badge-high px-1.5 py-0.5 rounded text-[10px] font-bold">87% RISK</span>
            </div>
            <div className="font-mono text-cyan-400 font-bold">TXN10291</div>
            <div className="text-slate-400 text-[11px]">Customer: CUST458 (₹78,000)</div>
            <NavLink
              to="/investigation/TXN10291"
              className="mt-2 w-full text-center block py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium text-[11px] transition-colors"
            >
              Open Active Case &rarr;
            </NavLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#070A12] p-6 overflow-y-auto">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E2945]/60">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>FinGuard Platform</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-cyan-400 font-medium">{getPageTitle()}</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 bg-[#0F1629] px-3 py-1.5 rounded-lg border border-[#1E2945]">
                Branch: <strong className="text-cyan-400">soumen (frontend)</strong>
              </span>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
