import React from 'react';

interface StatusBadgeProps {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED' | 'PASSED' | 'RECOVERED' | 'FAILED' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  if (normalized === 'COMPLETED' || normalized === 'PASSED' || normalized === 'VALIDATED ✓') {
    return (
      <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
        {status}
      </span>
    );
  }

  if (normalized === 'RECOVERED' || normalized === 'PRISM_CORRECTED') {
    return (
      <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
        {status}
      </span>
    );
  }

  if (normalized === 'FAILED') {
    return (
      <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold">
        {status}
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
      {status}
    </span>
  );
};
