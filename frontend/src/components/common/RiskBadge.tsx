import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  risk: RiskLevel | string;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, score }) => {
  const isHigh = risk === 'HIGH' || (score !== undefined && score >= 80);
  const isMedium = risk === 'MEDIUM' || (score !== undefined && score >= 50 && score < 80);

  return (
    <span
      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
        isHigh
          ? 'badge-high'
          : isMedium
          ? 'badge-medium'
          : 'badge-low'
      }`}
    >
      {score !== undefined && <span>{score}%</span>}
      <span>{risk}</span>
    </span>
  );
};
