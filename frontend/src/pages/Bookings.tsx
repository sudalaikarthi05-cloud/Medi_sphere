import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Header } from '../components/Header';
import { usePatients } from '../hooks/usePatients';
import { cancelBooking, createBooking, fetchBookings } from '../services/bookings';
import type { Booking } from '../types';

type FormField = 'patientId' | 'doctor' | 'department' | 'appointmentDateTime';

const EMPTY_FORM: Record<FormField, string> = {
  patientId: '',
  doctor: '',
  department: '',
  appointmentDateTime: '',
};

const DEPARTMENTS = [
  'Cardiology',
  'Endocrinology',
  'General Medicine',
  'Neurology',
  'Orthopedics',
  'Pulmonology',
];

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

function getBookingStatusBadge(status: string | null | undefined): string {
  switch ((status ?? '').toLowerCase()) {
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'completed':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
}

export function Bookings() {
  const { patients } = usePatients();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const patientNameById = useMemo(() => {
    const map = new Map<string, string>();
    patients.forEach((patient) => map.set(patient.id, patient.name));
    return map;
  }, [patients]);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setPageError('');
    try {
      setBookings(await fetchBookings());
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Could not load bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  function openModal() {
    setForm({ ...EMPTY_FORM, patientId: patients[0]?.id ?? '' });
    setTouched({});
    setSubmitError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function markTouched(field: FormField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function fieldInvalid(field: FormField): boolean {
    if (!touched[field]) return false;
    return form[field].trim() === '';
  }

  const formValid =
    form.patientId !== '' &&
    form.doctor.trim().length >= 2 &&
    form.department !== '' &&
    form.appointmentDateTime !== '';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formValid) {
      setTouched({ patientId: true, doctor: true, department: true, appointmentDateTime: true });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createBooking({
        patientId: form.patientId,
        doctor: form.doctor.trim(),
        department: form.department,
        appointmentDateTime: new Date(form.appointmentDateTime).toISOString(),
        reason: '',
      });
      closeModal();
      setSuccessMessage(`Appointment booked with ${form.doctor.trim()} for patient ${form.patientId}.`);
      await loadBookings();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not create the booking.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onCancelBooking(booking: Booking) {
    if (!window.confirm(`Cancel the appointment for patient ${booking.patientId}?`)) return;

    setCancellingId(booking.id);
    setSuccessMessage('');
    setPageError('');
    try {
      await cancelBooking(booking.id);
      setSuccessMessage(`Booking ${booking.id} was cancelled.`);
      await loadBookings();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Could not cancel the booking.');
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Bookings" subtitle="Schedule and manage patient appointments" />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-emerald-600 hover:text-emerald-900 font-bold">
              &times;
            </button>
          </div>
        )}
        {pageError && (
          <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {pageError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Appointment Bookings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Appointments for the patients you own.</p>
          </div>
          <button
            onClick={openModal}
            disabled={patients.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Booking</span>
          </button>
        </div>

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
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-slate-500">
                      {booking.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {patientNameById.get(booking.patientId) ?? 'Unknown patient'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{booking.patientId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{booking.doctor || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{booking.department || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{formatDateTime(booking.appointmentDateTime)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getBookingStatusBadge(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => void onCancelBooking(booking)}
                          disabled={cancellingId === booking.id || booking.status === 'Cancelled'}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                        >
                          {cancellingId === booking.id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                      {isLoading ? 'Loading bookings...' : 'No bookings scheduled yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">New Booking</h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {submitError && (
                <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {submitError}
                </p>
              )}

              <div>
                <label htmlFor="bookingPatient" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Patient <span className="text-rose-500">*</span>
                </label>
                <select
                  id="bookingPatient"
                  value={form.patientId}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                  onBlur={() => markTouched('patientId')}
                  className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldInvalid('patientId') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </option>
                  ))}
                </select>
                {fieldInvalid('patientId') && <p className="text-[11px] text-rose-500 mt-1">Patient is required</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bookingDoctor" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="bookingDoctor"
                    type="text"
                    value={form.doctor}
                    onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                    onBlur={() => markTouched('doctor')}
                    placeholder="e.g. Dr. Rao"
                    className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldInvalid('doctor') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {fieldInvalid('doctor') && <p className="text-[11px] text-rose-500 mt-1">Doctor name is required</p>}
                </div>

                <div>
                  <label htmlFor="bookingDepartment" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="bookingDepartment"
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    onBlur={() => markTouched('department')}
                    className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldInvalid('department') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {fieldInvalid('department') && <p className="text-[11px] text-rose-500 mt-1">Department is required</p>}
                </div>
              </div>

              <div>
                <label htmlFor="bookingDateTime" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Appointment Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="bookingDateTime"
                  type="datetime-local"
                  value={form.appointmentDateTime}
                  onChange={(e) => setForm((f) => ({ ...f, appointmentDateTime: e.target.value }))}
                  onBlur={() => markTouched('appointmentDateTime')}
                  className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldInvalid('appointmentDateTime') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {fieldInvalid('appointmentDateTime') && (
                  <p className="text-[11px] text-rose-500 mt-1">Appointment date and time is required</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formValid || isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
                >
                  {isSubmitting && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Book Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
