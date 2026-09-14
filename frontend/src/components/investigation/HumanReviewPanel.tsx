import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { Lock, ShieldAlert, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface HumanReviewPanelProps {
  investigationId: string;
  recommendation: string;
}

export const HumanReviewPanel: React.FC<HumanReviewPanelProps> = ({
  investigationId,
  recommendation,
}) => {
  const [decision, setDecision] = useState<'ESCALATE' | 'MARK_SUSPICIOUS' | 'DISMISS'>('ESCALATE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiService.submitHumanReview(investigationId, decision, notes);
      setResult(res.message);
    } catch (err) {
      setResult('Error recording human review decision.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fg-card-glow p-6 rounded-2xl space-y-4 bg-white border border-[#FCD5C1] shadow-md">
      <div className="flex items-center gap-2 text-[#DC2626] font-extrabold text-sm">
        <Lock className="w-4 h-4" />
        HUMAN ANALYST REVIEW & GOVERNANCE
      </div>

      <div className="p-3.5 rounded-xl bg-[#FFF2EB] border border-[#FCD5C1] text-xs">
        <span className="text-slate-600 block text-[10px] font-bold uppercase tracking-wider">AGENT AI RECOMMENDATION</span>
        <span className="font-extrabold text-[#DC2626] font-mono text-sm">{recommendation}</span>
      </div>

      {result ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Decision Recorded
          </div>
          <div>{result}</div>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Select Decision Action:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('ESCALATE')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                  decision === 'ESCALATE'
                    ? 'bg-[#DC2626] text-white border-[#B91C1C] shadow-md shadow-red-500/20'
                    : 'bg-white text-slate-700 border-[#E6D9C5] hover:bg-[#FAF5ED]'
                }`}
              >
                ESCALATE
              </button>
              <button
                type="button"
                onClick={() => setDecision('MARK_SUSPICIOUS')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                  decision === 'MARK_SUSPICIOUS'
                    ? 'bg-[#D97706] text-white border-[#B45309] shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-700 border-[#E6D9C5] hover:bg-[#FAF5ED]'
                }`}
              >
                MARK SUSPICIOUS
              </button>
              <button
                type="button"
                onClick={() => setDecision('DISMISS')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                  decision === 'DISMISS'
                    ? 'bg-slate-800 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-[#E6D9C5] hover:bg-[#FAF5ED]'
                }`}
              >
                DISMISS
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Analyst Investigation Notes:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter analyst justification notes for compliance audit log..."
              className="w-full p-3 rounded-xl bg-[#FAF5ED] border border-[#E6D9C5] focus:border-[#E55B13] text-xs text-slate-900 placeholder:text-slate-400 outline-none resize-none font-medium"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#E55B13] hover:bg-[#D04E09] text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting Review...' : 'Submit Human Review Decision'}
          </button>
        </div>
      )}

      {/* Explicit Compliance Requirement Banner */}
      <div className="flex items-center gap-2 text-[11px] text-[#B45309] bg-[#FEF3C7] p-3 rounded-xl border border-[#FCD34D] font-medium">
        <Info className="w-4 h-4 text-[#D97706] flex-shrink-0" />
        <span>FinGuard governance rule: <strong className="font-bold">Final decision remains with the authorized human reviewer.</strong></span>
      </div>
    </div>
  );
};
