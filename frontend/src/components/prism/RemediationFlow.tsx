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
    <div className="fg-card p-6 space-y-4 bg-white border border-[#E6D9C5] shadow-sm">
      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#E55B13]">
        PRISM Remediation & Validation Flow
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Step 1 */}
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            currentStage === 'DETECTED' || currentStage === 'DIAGNOSED' || currentStage === 'VALIDATED'
              ? 'bg-[#FFF2EB] border-[#FCD5C1] text-[#E55B13]'
              : 'bg-[#FAF5ED] border-[#E6D9C5] text-slate-400'
          }`}
        >
          <div className="text-[10px] font-mono font-extrabold text-[#E55B13]">STEP 1</div>
          <div className="font-extrabold text-xs text-slate-900">PRISM DETECTED</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Payload Gap Identified</div>
        </div>

        {/* Step 2 */}
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            currentStage === 'DIAGNOSED' || currentStage === 'VALIDATED'
              ? 'bg-[#FFF2EB] border-[#FCD5C1] text-[#E55B13]'
              : 'bg-[#FAF5ED] border-[#E6D9C5] text-slate-400'
          }`}
        >
          <div className="text-[10px] font-mono font-extrabold text-[#E55B13]">STEP 2</div>
          <div className="font-extrabold text-xs text-slate-900">DIAGNOSED</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Wrong Tool Selection</div>
        </div>

        {/* Step 3 */}
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-[#FFF2EB] border-[#FCD5C1] text-[#E55B13]'
              : 'bg-[#FAF5ED] border-[#E6D9C5] text-slate-400'
          }`}
        >
          <div className="text-[10px] font-mono font-extrabold text-[#E55B13]">STEP 3</div>
          <div className="font-extrabold text-xs text-slate-900">CORRECTED</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">History Tool Override</div>
        </div>

        {/* Step 4 */}
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-[#FFF2EB] border-[#FCD5C1] text-[#E55B13]'
              : 'bg-[#FAF5ED] border-[#E6D9C5] text-slate-400'
          }`}
        >
          <div className="text-[10px] font-mono font-extrabold text-[#E55B13]">STEP 4</div>
          <div className="font-extrabold text-xs text-slate-900">RE-RUN</div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">Re-executed in 180ms</div>
        </div>

        {/* Step 5 */}
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            currentStage === 'VALIDATED'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
              : 'bg-[#FAF5ED] border-[#E6D9C5] text-slate-400'
          }`}
        >
          <div className="text-[10px] font-mono font-extrabold text-emerald-700">STEP 5</div>
          <div className="font-extrabold text-xs text-emerald-800">VALIDATED ✓</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-bold">Goal PASSED ✓</div>
        </div>
      </div>

      {rootCause && (
        <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E6D9C5] text-xs space-y-2">
          <div>
            <strong className="text-[#E55B13] font-mono font-bold">DIAGNOSED ROOT CAUSE:</strong>
            <p className="text-slate-800 font-medium mt-0.5">{rootCause}</p>
          </div>
          {recommendation && (
            <div className="pt-2 border-t border-[#E6D9C5]">
              <strong className="text-emerald-700 font-mono font-bold">RECOMMENDED CORRECTION:</strong>
              <p className="text-slate-800 font-medium mt-0.5">{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
