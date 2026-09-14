import React from 'react';

interface PrismMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
}

export const PrismMetricCard: React.FC<PrismMetricCardProps> = ({
  title,
  value,
  subtitle,
  colorClass = 'text-white',
}) => {
  return (
    <div className="fg-card p-4 space-y-1">
      <span className="text-[10px] text-slate-400 block font-mono uppercase">{title}</span>
      <span className={`text-2xl font-bold font-mono ${colorClass}`}>{value}</span>
      {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
    </div>
  );
};
