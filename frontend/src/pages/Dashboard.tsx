import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { AlertCard } from '../components/AlertCard';
import { usePatients } from '../hooks/usePatients';
import { getInitials, getRiskBadge, getStatusBadge, getStatusDot } from '../lib/ui';
import { useState } from 'react';

const STAT_CARDS = [
  {
    label: 'Total Patients',
    value: '128',
    delta: '+8.2% this month',
    deltaClass: 'text-emerald-600',
    icon: 'users',
    iconWrap: 'bg-blue-50 text-blue-600',
    caption: 'Registered clinical profiles',
  },
  {
    label: 'Active Patients',
    value: '96',
    delta: '+5.4%',
    deltaClass: 'text-emerald-600',
    icon: 'check',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    caption: 'Under active clinical care',
  },
  {
    label: 'Monitoring',
    value: '24',
    delta: 'Live monitoring',
    deltaClass: 'text-cyan-600',
    icon: 'bolt',
    iconWrap: 'bg-cyan-50 text-cyan-600',
    caption: 'Real-time telemetry stream',
  },
  {
    label: 'Average Age',
    value: '47',
    delta: 'Across registry',
    deltaClass: 'text-slate-500',
    icon: 'calendar',
    iconWrap: 'bg-indigo-50 text-indigo-600',
    caption: 'Patient cohort demographics',
  },
];

function StatIcon({ kind }: { kind: string }) {
  if (kind === 'check') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (kind === 'bolt') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  if (kind === 'calendar') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

export function Dashboard() {
  const { patients, deletePatient } = usePatients();
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const latestPatient = patients.reduce((latest, patient) => {
    if (!latest) return patient;
    return Date.parse(patient.createdAt ?? '') > Date.parse(latest.createdAt ?? '') ? patient : latest;
  }, patients[0]);

  async function onDeletePatient(id: string, name: string) {
    if (!window.confirm(`Delete ${name} (${id}) from the patient registry?`)) return;

    setDeletingPatientId(id);
    setActionError('');
    setActionMessage('');
    try {
      await deletePatient(id);
      setActionMessage(`Patient ${name} (${id}) was deleted.`);
    } catch {
      setActionError(`Could not delete ${name}. Check the backend connection and try again.`);
    } finally {
      setDeletingPatientId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Dashboard" subtitle="Unified patient intelligence and clinical insights" />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white shadow-xl sm:p-8 lg:flex-row">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-xs font-semibold text-cyan-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live monitoring active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans">
              One patient context, assembled.
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Monitor patient health, identify emerging risks, and support preventive clinical decisions from one unified
              workspace.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/patients"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-2"
              >
                <span>View Patient Registry</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to={`/patient/${latestPatient?.id ?? 'P001'}`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
              >
                {latestPatient
                  ? `Open ${latestPatient.name} (${latestPatient.id}) 360`
                  : 'Open Patient 360'}
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-72 h-44 flex items-center justify-center select-none">
            <svg className="w-full h-full text-cyan-400/20" viewBox="0 0 280 140">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <line x1="0" y1="70" x2="280" y2="70" stroke="#334155" strokeWidth="0.75" strokeDasharray="2,2" />
              <line x1="0" y1="35" x2="280" y2="35" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="105" x2="280" y2="105" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              <path
                d="M 0,70 L 40,70 L 48,64 L 54,70 L 65,70 L 72,25 L 80,115 L 88,60 L 95,74 L 102,70 L 140,70 L 148,64 L 154,70 L 165,70 L 172,25 L 180,115 L 188,60 L 195,74 L 202,70 L 280,70"
                fill="none"
                stroke="url(#waveGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="172" cy="25" r="4" fill="#06b6d4" className="animate-ping" opacity="0.8" />
              <circle cx="172" cy="25" r="4" fill="#06b6d4" />
            </svg>
            <span className="absolute bottom-2 text-[10px] text-slate-400 font-mono tracking-wider">
              HEMODYNAMIC TELEMETRY &bull; 72 BPM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconWrap}`}>
                  <StatIcon kind={card.icon} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
               <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
  {card.label === 'Total Patients' ? patients.length : card.value}
</span>
                <span className={`inline-flex items-center text-xs font-bold ${card.deltaClass}`}>{card.delta}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">{card.caption}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertCard />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Quick Patient Access</h3>
              <Link to="/patients" className="text-xs text-blue-600 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {getInitials(patient.name)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{patient.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {patient.id} &bull; {patient.condition}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/patient/${patient.id}`}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded transition"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Patient Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Recently monitored patients with clinical risk status</p>
            </div>
            <Link
              to="/patients"
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg transition self-start sm:self-auto"
            >
              Manage Registry &rarr;
            </Link>
          </div>

          {(actionMessage || actionError) && (
            <div
              role={actionError ? 'alert' : 'status'}
              className={`mx-6 mt-4 rounded-lg border px-3 py-2 text-xs font-semibold ${
                actionError
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {actionError || actionMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Patient</th>
                  <th className="py-3 px-4">S.No</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal">
                {patients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {getInitials(patient.name)}
                        </div>
                        <span className="font-bold text-slate-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{index + 1}</td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.age}</td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.gender}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{patient.condition}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(patient.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(patient.status)}`} />
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex w-[72px] shrink-0 items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getRiskBadge(patient.riskLevel)}`}>
                          {patient.riskLevel}
                        </span>
                        <Link
                          to="/patients"
                          state={{ editPatient: patient }}
                          aria-label={`Edit ${patient.name}`}
                          title="Edit patient"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m16.862 4.487 2.651 2.651M8 16l8.5-8.5a1.875 1.875 0 0 1 2.652 2.652L10.652 18.65a4 4 0 0 1-1.697.98L6 20l.37-2.956A4 4 0 0 1 8 16Z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => void onDeletePatient(patient.id, patient.name)}
                          disabled={deletingPatientId === patient.id}
                          aria-label={`Delete ${patient.name}`}
                          title="Delete patient"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          {deletingPatientId === patient.id ? (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 7h12m-10 0 .7 12h6.6L16 7M9 7V4h6v3m-5 4v5m4-5v5" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/patient/${patient.id}`}
                          aria-label={`View ${patient.name}`}
                          title="View patient"
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition space-x-1"
                        >
                          <span>View 360</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
