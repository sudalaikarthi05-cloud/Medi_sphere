import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../lib/auth';
import { getInitials } from '../lib/ui';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Dashboard', subtitle = 'Unified patient intelligence and clinical insights' }: HeaderProps) {
  const { isDemoMode } = usePatients();
  const { currentUser, isAdmin } = useAuth();

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

        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          title="Clinical Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

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
