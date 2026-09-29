import { getLabStatusBadge, getPriorityBadge } from '../lib/ui';
import type { LabReport, PreventiveCare } from '../types/lab';

interface LabReportCardProps {
  labs: LabReport[];
  preventiveCare: PreventiveCare[];
}

export function LabReportCard({ labs, preventiveCare }: LabReportCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Lab Reports</h3>
              <p className="text-[11px] text-slate-500">Diagnostic panels and serum biomarkers</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">Standard Reference Range</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 pr-4">Test Name</th>
                <th className="py-2.5 px-4">Result</th>
                <th className="py-2.5 px-4">Reference Range</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 pl-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {labs.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-slate-800">{lab.testName}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{lab.value}</span>
                    <span className="text-slate-500 ml-1">{lab.unit}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{lab.referenceRange}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getLabStatusBadge(lab.status)}`}>
                      {lab.status}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right text-slate-400 font-mono text-[11px]">{lab.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Preventive Care</h3>
              <p className="text-[11px] text-slate-500">Proactive clinical recommendations and surveillance</p>
            </div>
          </div>
          <span className="text-xs text-blue-600 font-semibold">Guidelines Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {preventiveCare.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Cadence: {item.interval}</span>
                <span className="inline-flex items-center text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
