import type { ReactNode } from 'react';

interface VitalCardProps {
  label: string;
  value: string | number;
  unit: string;
  status: string;
  updatedTime?: string;
  type: 'heart' | 'bp' | 'spo2' | 'temp';
  icon: ReactNode;
}

const ACCENTS: Record<string, string> = {
  heart: 'from-rose-500 to-pink-500',
  bp: 'from-blue-600 to-indigo-600',
  spo2: 'from-cyan-500 to-teal-500',
  temp: 'from-amber-500 to-orange-500',
};

const ICON_BG: Record<string, string> = {
  heart: 'bg-rose-50 text-rose-600',
  bp: 'bg-blue-50 text-blue-600',
  spo2: 'bg-cyan-50 text-cyan-600',
  temp: 'bg-amber-50 text-amber-600',
};

function statusBadge(status: string): string {
  switch (status?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'attention':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
}

function statusDot(status: string): string {
  switch (status?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-500';
    case 'attention':
      return 'bg-amber-500';
    default:
      return 'bg-emerald-500';
  }
}

export function VitalCard({ label, value, unit, status, updatedTime, type, icon }: VitalCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ACCENTS[type] ?? 'from-blue-500 to-cyan-500'}`} />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans transition-all duration-300">
              {value}
            </span>
            <span className="text-sm font-semibold text-slate-500">{unit}</span>
          </div>
        </div>

        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ICON_BG[type] ?? 'bg-slate-50 text-slate-600'}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${statusBadge(status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDot(status)}`} />
          {status}
        </span>
        <span className="text-slate-400 font-normal">Updated {updatedTime || 'Just now'}</span>
      </div>
    </div>
  );
}
