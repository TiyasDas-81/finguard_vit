import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface RemediationFlowProps {
  currentStage: 'DETECTED' | 'DIAGNOSED' | 'VALIDATED';
  rootCause?: string;
  recommendation?: string;
}

export const RemediationFlow: React.FC<RemediationFlowProps> = ({
  currentStage,
  rootCause,
  recommendation,
}) => {
  return (
    <div className="fg-card p-6 space-y-4">
      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">
        PRISM Remediation & Validation Flow
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Step 1 */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            currentStage === 'DETECTED' || currentStage === 'DIAGNOSED' || currentStage === 'VALIDATED'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
              : 'bg-[#070A12] border-[#1E2945] text-slate-500'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-purple-400">STEP 1</div>
          <div className="font-bold text-xs text-white">PRISM DETECTED</div>
          <div className="text-[10px] text-slate-400 mt-1">Payload Gap Identified</div>
        </div>

        {/* Step 2 */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            currentStage === 'DIAGNOSED' || currentStage === 'VALIDATED'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
              : 'bg-[#070A12] border-[#1E2945] text-slate-500'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-purple-400">STEP 2</div>
          <div className="font-bold text-xs text-white">DIAGNOSED</div>
          <div className="text-[10px] text-slate-400 mt-1">Wrong Tool Selection</div>
        </div>

        {/* Step 3 */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
              : 'bg-[#070A12] border-[#1E2945] text-slate-500'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-purple-400">STEP 3</div>
          <div className="font-bold text-xs text-white">CORRECTED</div>
          <div className="text-[10px] text-slate-400 mt-1">History Tool Override</div>
        </div>

        {/* Step 4 */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
              : 'bg-[#070A12] border-[#1E2945] text-slate-500'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-purple-400">STEP 4</div>
          <div className="font-bold text-xs text-white">RE-RUN</div>
          <div className="text-[10px] text-slate-400 mt-1">Re-executed in 180ms</div>
        </div>

        {/* Step 5 */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/10'
              : 'bg-[#070A12] border-[#1E2945] text-slate-500'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-emerald-400">STEP 5</div>
          <div className="font-bold text-xs text-emerald-300">VALIDATED ✓</div>
          <div className="text-[10px] text-emerald-400 mt-1">Goal PASSED ✓</div>
        </div>
      </div>

      {rootCause && (
        <div className="p-4 rounded-xl bg-[#070A12] border border-purple-500/30 text-xs space-y-2">
          <div>
            <strong className="text-purple-400 font-mono">DIAGNOSED ROOT CAUSE:</strong>
            <p className="text-slate-300 mt-0.5">{rootCause}</p>
          </div>
          {recommendation && (
            <div className="pt-2 border-t border-[#1E2945]">
              <strong className="text-cyan-400 font-mono">RECOMMENDED CORRECTION:</strong>
              <p className="text-slate-300 mt-0.5">{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
