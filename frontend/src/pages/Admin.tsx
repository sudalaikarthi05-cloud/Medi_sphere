import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  fetchAdminUserDetails,
  fetchAdminUsers,
  fetchAllBookings,
  fetchAllPatients,
} from '../services/admin';
import type { AdminUser, AdminUserDetails, Booking, Patient } from '../types';

type Tab = 'users' | 'patients' | 'bookings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'patients', label: 'All Patients' },
  { id: 'bookings', label: 'All Bookings' },
];

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function formatDateTime(value: string | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function roleBadge(role: string | null | undefined): string {
  return (role ?? '').toUpperCase() === 'ROLE_ADMIN'
    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
    : 'bg-slate-100 text-slate-600 border border-slate-200';
}

function bookingStatusBadge(status: string | null | undefined): string {
  switch ((status ?? '').toLowerCase()) {
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'completed':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
}

export function Admin() {
  const [tab, setTab] = useState<Tab>('users');
  const [error, setError] = useState('');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingSearch, setBookingSearch] = useState('');

  const [detailEmail, setDetailEmail] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const debouncedPatientSearch = useDebouncedValue(patientSearch, 300);
  const debouncedBookingSearch = useDebouncedValue(bookingSearch, 300);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setError('');
    try {
      setUsers(await fetchAdminUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load users.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (tab !== 'patients') return;
    let active = true;
    setPatientsLoading(true);
    setError('');
    fetchAllPatients({ search: debouncedPatientSearch })
      .then((data) => {
        if (active) setPatients(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load patients.');
      })
      .finally(() => {
        if (active) setPatientsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, debouncedPatientSearch]);

  useEffect(() => {
    if (tab !== 'bookings') return;
    let active = true;
    setBookingsLoading(true);
    setError('');
    fetchAllBookings({ search: debouncedBookingSearch })
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load bookings.');
      })
      .finally(() => {
        if (active) setBookingsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, debouncedBookingSearch]);

  const patientNameById = useMemo(() => {
    const map = new Map<string, string>();
    patients.forEach((patient) => map.set(patient.id, patient.name));
    return map;
  }, [patients]);

  async function openDetails(email: string) {
    setDetailEmail(email);
    setDetails(null);
    setDetailsLoading(true);
    try {
      setDetails(await fetchAdminUserDetails(email));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load user details.');
      setDetailEmail(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Admin" subtitle="Read-only overview across all users, patients and bookings" />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setTab(entry.id)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${
                  tab === entry.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {tab === 'patients' && (
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name, ID, owner or condition..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          )}

          {tab === 'bookings' && (
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by patient, doctor, owner..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          )}
        </div>

        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Patients</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{formatDate(user.joinedDate)}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{user.patientCount}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{user.bookingCount}</td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => void openDetails(user.email)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                      {usersLoading ? 'Loading users...' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'patients' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Patient</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Archived</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{patient.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{patient.age}</td>
                      <td className="py-3.5 px-4 text-slate-600">{patient.condition}</td>
                      <td className="py-3.5 px-4 text-slate-600">{patient.status}</td>
                      <td className="py-3.5 px-4 text-slate-600">{patient.riskLevel}</td>
                      <td className="py-3.5 px-4 text-slate-500">{patient.ownerEmail ?? '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500">{patient.isDeleted ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                        {patientsLoading ? 'Loading patients...' : 'No patients found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Booking</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Appointment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-semibold text-slate-500">
                        {booking.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {patientNameById.get(booking.patientId) ?? booking.patientId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{booking.doctor || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{booking.department || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{formatDateTime(booking.appointmentDateTime)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${bookingStatusBadge(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{booking.ownerEmail ?? '—'}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                        {bookingsLoading ? 'Loading bookings...' : 'No bookings found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {detailEmail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">User Details</h3>
                <p className="text-xs text-slate-500">{detailEmail}</p>
              </div>
              <button
                onClick={() => {
                  setDetailEmail(null);
                  setDetails(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailsLoading && <p className="py-8 text-center text-xs text-slate-400">Loading details...</p>}

            {!detailsLoading && details && (
              <div className="mt-5 space-y-6">
                <section>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Patients ({details.patients.length})
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase">
                          <th className="py-2 px-4">Patient</th>
                          <th className="py-2 px-4">Condition</th>
                          <th className="py-2 px-4">Status</th>
                          <th className="py-2 px-4">Risk</th>
                          <th className="py-2 px-4">Archived</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {details.patients.map((patient) => (
                          <tr key={patient.id}>
                            <td className="py-2.5 px-4 font-semibold text-slate-800">
                              {patient.name} <span className="text-slate-400 font-mono">({patient.id})</span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">{patient.condition}</td>
                            <td className="py-2.5 px-4 text-slate-600">{patient.status}</td>
                            <td className="py-2.5 px-4 text-slate-600">{patient.riskLevel}</td>
                            <td className="py-2.5 px-4 text-slate-500">{patient.isDeleted ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                        {details.patients.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">
                              No patients.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Bookings ({details.bookings.length})
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase">
                          <th className="py-2 px-4">Patient</th>
                          <th className="py-2 px-4">Doctor</th>
                          <th className="py-2 px-4">Department</th>
                          <th className="py-2 px-4">Appointment</th>
                          <th className="py-2 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {details.bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="py-2.5 px-4 font-mono text-slate-600">{booking.patientId}</td>
                            <td className="py-2.5 px-4 text-slate-600">{booking.doctor || '—'}</td>
                            <td className="py-2.5 px-4 text-slate-600">{booking.department || '—'}</td>
                            <td className="py-2.5 px-4 text-slate-600">{formatDateTime(booking.appointmentDateTime)}</td>
                            <td className="py-2.5 px-4 text-slate-600">{booking.status}</td>
                          </tr>
                        ))}
                        {details.bookings.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">
                              No bookings.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
