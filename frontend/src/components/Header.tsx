import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../lib/auth';
import { getInitials } from '../lib/ui';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Dashboard', subtitle = 'Unified patient intelligence and clinical insights' }: HeaderProps) {
  const { patients, isDemoMode } = usePatients();
  const { currentUser, isAdmin } = useAuth();
  const showNotifications = isAdmin && title === 'Admin';
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const seriousPatients = patients
    .filter(
      (patient) =>
        patient.riskLevel.toUpperCase() === 'HIGH' &&
        patient.status.toLowerCase() !== 'discharged',
    )
    .sort((first, second) => second.riskScore - first.riskScore);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4 lg:px-8">
      <div className="min-w-0">
        <div className="flex items-center space-x-3">
          <h2 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
          {isDemoMode && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/60">
              SYNTHETIC DEMO DATA
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] font-normal text-slate-500 sm:text-xs">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center space-x-2 sm:space-x-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/70 rounded-full text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Live telemetry active</span>
        </div>

        {showNotifications && (
          <div className="relative">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Clinical Notifications"
              aria-label={`Clinical notifications: ${seriousPatients.length} high-risk patients`}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="true"
              onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {seriousPatients.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {seriousPatients.length > 99 ? '99+' : seriousPatients.length}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                role="menu"
                aria-label="High-risk patient notifications"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">High-risk patients</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Patients needing close attention</p>
                </div>
                {seriousPatients.length > 0 ? (
                  <ul className="max-h-80 overflow-y-auto py-1">
                    {seriousPatients.map((patient) => (
                      <li key={patient.id}>
                        <Link
                          to={`/patient/${encodeURIComponent(patient.id)}`}
                          role="menuitem"
                          className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-rose-50 focus:bg-rose-50 focus:outline-none"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-slate-800">{patient.name}</span>
                            <span className="block truncate text-xs text-slate-500">{patient.condition}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                            High · {patient.riskScore}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-5 text-sm text-slate-500">No high-risk patients right now.</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-sm ring-2 ring-blue-100 sm:h-10 sm:w-10">
            {getInitials(currentUser?.name ?? 'User')}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-slate-900 leading-tight">{currentUser?.name ?? 'Clinician'}</div>
            <div className="text-xs text-slate-500 font-medium">{isAdmin ? 'Administrator' : 'Clinician'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
