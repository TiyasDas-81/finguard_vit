import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Investigation } from '../types';
import { apiService } from '../services/api';
import { EvidenceChain } from '../components/evidence/EvidenceChain';
import { EvidenceCard } from '../components/evidence/EvidenceCard';
import { InvestigationReport } from '../components/evidence/InvestigationReport';
import { Activity } from 'lucide-react';

export const EvidencePage: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await apiService.getInvestigation(investigationId || 'INV-10291');
      setInvestigation(data);
      setLoading(false);
    }
    loadData();
  }, [investigationId]);

  if (loading || !investigation) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <Activity className="w-5 h-5 animate-spin text-cyan-400 mr-2" /> Building Visual Evidence Graph...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visual Evidence Chain Graph */}
      <EvidenceChain chain={investigation.evidenceChain} />

      {/* Quantified Evidence Cards Grid */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Quantified Evidence Vector Cards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {investigation.evidenceList.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      </div>

      {/* FIN GUARD INVESTIGATION DOSSIER Report */}
      <InvestigationReport investigation={investigation} />
    </div>
  );
};
