import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { usePatients } from '../hooks/usePatients';

const linkBase =
  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-150';
const linkActive = 'bg-blue-600/20 text-cyan-300 border-r-2 border-cyan-400';

export function Sidebar() {
  const { logout } = useAuth();
  const { patients } = usePatients();
  const navigate = useNavigate();

  // Angular always linked the first patient; keep parity by defaulting to P001
  const currentPatientId = patients.length > 0 ? patients[0].id : 'P001';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 select-none">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-white uppercase font-sans">MEDISPHERE</h1>
            <p className="text-xs text-cyan-400 font-medium tracking-wide uppercase">Cognitive Twin</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Clinical Intelligence
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/patients" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Patients</span>
        </NavLink>

        <NavLink to={`/patient/${currentPatientId}`} className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>Patient 360</span>
        </NavLink>
      </div>

      <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 mx-3 rounded-lg mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">System Status</span>
          <span className="flex items-center text-emerald-400 font-semibold space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>All systems operational</span>
          </span>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-700/60 border border-blue-500/30 flex items-center justify-center text-white font-semibold text-xs">
              AS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-100 truncate">Dr. Ananya Sharma</p>
              <p className="text-[11px] text-slate-400 truncate">Clinical Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
