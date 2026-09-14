import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Shield, Bell, Search, Activity, FileText, History, Cpu, ChevronRight, Database, UserCheck } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const apiMode = apiService.getApiMode();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/alerts')) return 'Security & Anomaly Alerts';
    if (location.pathname.startsWith('/investigation')) return 'Investigation Dossier';
    if (location.pathname.startsWith('/evidence')) return 'Visual Evidence Chain';
    if (location.pathname.startsWith('/prism')) return 'PRISM Reliability Engine';
    if (location.pathname.startsWith('/history')) return 'Audit Trace & Run History';
    return 'Investigation Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#FAF5ED] text-slate-900 flex flex-col font-sans">
      {/* Top Banner Header - Official Slide Style */}
      <header className="h-16 border-b border-[#E6D9C5] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-[#E55B13] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Shield className="h-5 w-5 fill-current" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-[#1E293B]">
                FIN<span className="text-[#E55B13]">GUARD</span>
              </span>
              <span className="text-slate-300 font-light text-lg">/</span>
              <span className="font-extrabold text-xs tracking-wider text-[#E55B13] bg-[#FFF2EB] px-2 py-0.5 rounded-full border border-[#FCD5C1]">
                PRISM
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF2EB] text-[#E55B13] border border-[#FCD5C1] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E55B13] animate-pulse"></span>
              FORGE AI 2026
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Track: AI for Finance &bull; VIT graVITas'26
            </span>
          </div>
        </div>

        {/* Top Right System Status Pills */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-[#F4ECE0] px-3 py-1.5 rounded-full border border-[#E6D9C5] font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Agent Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#F4ECE0] px-3 py-1.5 rounded-full border border-[#E6D9C5] font-semibold text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-[#E55B13]" />
            <span>PRISM Guard</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFF2EB] text-[#E55B13] px-3 py-1.5 rounded-full border border-[#FCD5C1] font-mono font-bold">
            <Database className="w-3.5 h-3.5 text-[#E55B13]" />
            <span>MODE: {apiMode.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Navigation Sidebar - Warm Cream Palette */}
        <aside className="w-64 border-r border-[#E6D9C5] bg-[#F4ECE0]/70 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#E55B13]">
              BUILD IT. BREAK IT. FIX IT. PROVE IT.
            </div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <Bell className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span>Alerts</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 font-bold">
                  2 HIGH
                </span>
              </div>
            </NavLink>

            <NavLink
              to="/investigation/TXN10291"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <Search className="w-4 h-4" />
              <span>Investigation</span>
            </NavLink>

            <NavLink
              to="/evidence/INV-10291"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Evidence Graph</span>
            </NavLink>

            <NavLink
              to="/prism"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <Cpu className="w-4 h-4" />
              <span>PRISM Reliability</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#E55B13] text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`
              }
            >
              <History className="w-4 h-4" />
              <span>Trace History</span>
            </NavLink>
          </div>

          {/* Active Demo Case & Team Credit Card */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-[#E6D9C5] text-xs space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-bold text-slate-800">Active Case</span>
                <span className="badge-high px-2 py-0.5 rounded text-[10px] font-extrabold">87% RISK</span>
              </div>
              <div className="font-mono text-[#E55B13] font-extrabold text-sm">TXN10291</div>
              <div className="text-slate-600 text-[11px]">CUST458 &bull; ₹78,000</div>
              <NavLink
                to="/investigation/TXN10291"
                className="mt-2 w-full text-center block py-2 rounded-xl bg-[#FFF2EB] hover:bg-[#FFE6D9] text-[#E55B13] border border-[#FCD5C1] font-bold text-[11px] transition-colors"
              >
                Open Investigation &rarr;
              </NavLink>
            </div>

            {/* Team Submission Card - Official Slide Footprint */}
            <div className="p-3 rounded-xl bg-[#FFF2EB] border border-[#FCD5C1] text-[11px] space-y-1">
              <div className="text-[#E55B13] font-mono font-bold uppercase text-[9px] tracking-wider">
                FORGE AI 2026 &bull; TEAM SUBMISSION
              </div>
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Soumen Mondal</span>
                <span className="text-[10px] font-mono text-slate-500">25MCA0195</span>
              </div>
              <div className="text-slate-600 text-[10px]">Systems & Evaluation Lead</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#FAF5ED] p-6 overflow-y-auto">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6D9C5]">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-600">FinGuard Platform</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-[#E55B13] font-bold">{getPageTitle()}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-[#E6D9C5] shadow-sm">
                Branch: <strong className="text-[#E55B13]">soumen (frontend)</strong>
              </span>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
