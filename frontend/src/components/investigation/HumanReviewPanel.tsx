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
    <div className="fg-card-glow p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
        <Lock className="w-4 h-4" />
        HUMAN ANALYST REVIEW & GOVERNANCE
      </div>

      <div className="p-3 rounded-xl bg-[#070A12] border border-red-500/30 text-xs">
        <span className="text-slate-400 block text-[10px]">AGENT AI RECOMMENDATION</span>
        <span className="font-bold text-red-400 font-mono text-sm">{recommendation}</span>
      </div>

      {result ? (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
          <div className="font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Decision Recorded
          </div>
          <div>{result}</div>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Select Decision Action:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('ESCALATE')}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  decision === 'ESCALATE'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                    : 'bg-[#070A12] text-slate-400 border-[#1E2945] hover:text-slate-200'
                }`}
              >
                ESCALATE
              </button>
              <button
                type="button"
                onClick={() => setDecision('MARK_SUSPICIOUS')}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  decision === 'MARK_SUSPICIOUS'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20'
                    : 'bg-[#070A12] text-slate-400 border-[#1E2945] hover:text-slate-200'
                }`}
              >
                MARK SUSPICIOUS
              </button>
              <button
                type="button"
                onClick={() => setDecision('DISMISS')}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  decision === 'DISMISS'
                    ? 'bg-slate-700 text-white border-slate-600 shadow-md'
                    : 'bg-[#070A12] text-slate-400 border-[#1E2945] hover:text-slate-200'
                }`}
              >
                DISMISS
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Analyst Investigation Notes:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter analyst justification notes for compliance audit log..."
              className="w-full p-3 rounded-xl bg-[#070A12] border border-[#1E2945] focus:border-cyan-500 text-xs text-slate-200 outline-none resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting Review...' : 'Submit Human Review Decision'}
          </button>
        </div>
      )}

      {/* Explicit Compliance Requirement Banner */}
      <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/30">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>FinGuard governance rule: <strong>Final decision remains with the authorized human reviewer.</strong></span>
      </div>
    </div>
  );
};
