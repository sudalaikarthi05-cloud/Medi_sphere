import { Link } from 'react-router-dom';

export type AlertSeverity = 'HIGH_RISK' | 'ATTENTION' | 'MONITORING';

export interface HealthAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
}

const DEFAULT_ALERTS: HealthAlert[] = [
  {
    id: 'ALT01',
    patientId: 'P003',
    patientName: 'Rahul Raj',
    severity: 'HIGH_RISK',
    message: 'Elevated cardiovascular risk detected.',
    timestamp: 'Today, 10:42 AM',
  },
  {
    id: 'ALT02',
    patientId: 'P001',
    patientName: 'Arun Kumar',
    severity: 'ATTENTION',
    message: 'Blood pressure requires monitoring.',
    timestamp: 'Today, 09:15 AM',
  },
  {
    id: 'ALT03',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    severity: 'MONITORING',
    message: 'Glucose trend requires follow-up.',
    timestamp: 'Yesterday, 04:30 PM',
  },
];

function alertBorderAndBg(sev: AlertSeverity): string {
  switch (sev) {
    case 'HIGH_RISK':
      return 'bg-rose-50/50 border-rose-200/80 hover:bg-rose-50';
    case 'ATTENTION':
      return 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50';
    default:
      return 'bg-blue-50/40 border-blue-200/70 hover:bg-blue-50';
  }
}

function alertIconClass(sev: AlertSeverity): string {
  switch (sev) {
    case 'HIGH_RISK':
      return 'bg-rose-100 text-rose-600';
    case 'ATTENTION':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-blue-100 text-blue-600';
  }
}

function badgeClass(sev: AlertSeverity): string {
  switch (sev) {
    case 'HIGH_RISK':
      return 'bg-rose-600 text-white';
    case 'ATTENTION':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
}

export function AlertCard({ alerts = DEFAULT_ALERTS }: { alerts?: HealthAlert[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <h3 className="text-sm font-bold text-slate-900">Clinical Health Alerts</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Live Queue</span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 ${alertBorderAndBg(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${alertIconClass(alert.severity)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {alert.severity === 'HIGH_RISK' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  ) : alert.severity === 'ATTENTION' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${badgeClass(alert.severity)}`}>
                    {alert.severity.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {alert.patientName} ({alert.patientId})
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{alert.message}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{alert.timestamp}</span>
              </div>
            </div>

            <Link
              to={`/patient/${alert.patientId}`}
              className="self-end sm:self-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition flex items-center space-x-1"
            >
              <span>View 360</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
