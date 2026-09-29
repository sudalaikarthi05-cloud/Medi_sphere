import type { RiskAssessment } from '../types/risk';

const DEFAULT_FACTORS = ['Blood Pressure', 'Glucose', 'Age', 'Previous Condition'];

const DEFAULT_MESSAGE = 'Current indicators suggest increased monitoring may be appropriate.';

const DEFAULT_DISCLAIMER =
  'AI-generated decision-support information based on synthetic healthcare data. Not a medically validated diagnosis.';

function riskBadgeClass(level?: string): string {
  switch (level?.toUpperCase()) {
    case 'HIGH':
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'LOW':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-amber-100 text-amber-800 border border-amber-200';
  }
}

function progressBarColor(score: number): string {
  if (score >= 70) return 'bg-gradient-to-r from-orange-500 to-rose-500';
  if (score <= 35) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
  return 'bg-gradient-to-r from-amber-400 to-orange-400';
}

export function RiskCard({ risk }: { risk: RiskAssessment | null }) {
  const score = risk?.score || 62;
  const factors = risk?.contributingFactors || DEFAULT_FACTORS;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Health Risk Assessment</h3>
            <span className="inline-flex items-center text-[11px] font-semibold text-indigo-600">
              {risk?.insightLabel || 'AI-Assisted Insight'}
            </span>
          </div>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${riskBadgeClass(risk?.level)}`}>
          Overall Risk: {risk?.level || 'MEDIUM'}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Composite Risk Index</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-900">{score}</span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${progressBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>0 (Low Risk)</span>
          <span>50 (Moderate)</span>
          <span>100 (Critical)</span>
        </div>
      </div>

      <div className="mt-5 p-3.5 bg-slate-50 rounded-lg border border-slate-200/70">
        <p className="text-xs font-medium text-slate-700 leading-relaxed">{risk?.message || DEFAULT_MESSAGE}</p>
      </div>

      <div className="mt-5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
          Key Contributing Factors
        </span>
        <div className="flex flex-wrap gap-2">
          {factors.map((factor) => (
            <span
              key={factor}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
              {factor}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-400">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{risk?.disclaimer || DEFAULT_DISCLAIMER}</span>
      </div>
    </div>
  );
}
