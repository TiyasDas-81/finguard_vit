import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  borderAccent?: string;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  borderAccent,
  trend,
}) => {
  return (
    <div className={`fg-card p-5 ${borderAccent ? `border-l-4 ${borderAccent}` : ''}`}>
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-xs font-semibold">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="text-3xl font-extrabold text-white font-mono">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-2">{subtitle}</div>}
      {trend && <div className="text-xs font-semibold text-emerald-400 mt-1">{trend}</div>}
    </div>
  );
};
