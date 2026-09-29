import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { usePatients } from '../hooks/usePatients';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getInitials, getRiskBadge, getStatusBadge, getStatusDot } from '../lib/ui';

type FormField = 'name' | 'age' | 'gender' | 'condition';

const CONDITION_FILTERS = ['Hypertension', 'Diabetes', 'Cardiac Risk', 'Type 2 Diabetes', 'Healthy'];

const CONDITION_OPTIONS = [
  'Healthy',
  'Hypertension',
  'Diabetes',
  'Cardiac Risk',
  'Respiratory Condition',
  'Type 2 Diabetes',
];

const EMPTY_FORM: Record<FormField, string> = { name: '', age: '', gender: '', condition: '' };

export function Patients() {
  const { patients, isLoading, loadPatients, addPatient } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Debounced so typing does not fire a request per keystroke (Angular fired on every input event)
  useEffect(() => {
    loadPatients({ search: debouncedSearch, condition: selectedCondition });
  }, [debouncedSearch, selectedCondition, loadPatients]);

  function onSearchChange(value: string) {
    setSearchQuery(value);
  }

  function onConditionChange(value: string) {
    setSelectedCondition(value);
  }

  function closeAddModal() {
    setShowAddModal(false);
  }

  function openAddModal() {
    setForm({ ...EMPTY_FORM });
    setTouched({});
    setShowAddModal(true);
  }

  function markTouched(field: FormField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function fieldInvalid(field: FormField): boolean {
    if (!touched[field]) return false;
    if (field === 'name') return form.name.trim().length < 2;
    if (field === 'age') {
      const age = Number(form.age);
      return form.age === '' || Number.isNaN(age) || age < 0 || age > 130;
    }
    return form[field] === '';
  }

  const formValid =
    form.name.trim().length >= 2 &&
    form.age !== '' &&
    !Number.isNaN(Number(form.age)) &&
    Number(form.age) >= 0 &&
    Number(form.age) <= 130 &&
    form.gender !== '' &&
    form.condition !== '';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formValid) {
      setTouched({ name: true, age: true, gender: true, condition: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addPatient({
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        condition: form.condition,
      });
      closeAddModal();
      setSuccessMessage(`Successfully added patient ${created.name} (${created.id}) to registry.`);
    } catch {
      closeAddModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Patients" subtitle="Manage and monitor the patient registry" />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
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

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, ID (P001), or condition..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <select
              value={selectedCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              aria-label="Filter patients by condition"
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Conditions</option>
              {CONDITION_FILTERS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>

            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Patient</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60">
                          {getInitials(patient.name)}
                        </div>
                        <span className="font-bold text-slate-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{patient.id}</td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.age} yrs</td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.gender}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{patient.condition}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(patient.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(patient.status)}`} />
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getRiskBadge(patient.riskLevel)}`}>
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/patient/${patient.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition space-x-1"
                      >
                        <span>View 360</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">
                      {isLoading ? 'Loading registry...' : 'No matching patient records found in registry.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">Add New Patient</h3>
              </div>
              <button onClick={closeAddModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={() => markTouched('name')}
                  placeholder="e.g. Ramesh Chandra"
                  className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldInvalid('name') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {fieldInvalid('name') && <p className="text-[11px] text-rose-500 mt-1">Full name is required</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientAge" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="patientAge"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    onBlur={() => markTouched('age')}
                    placeholder="e.g. 48"
                    className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldInvalid('age') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {fieldInvalid('age') && <p className="text-[11px] text-rose-500 mt-1">Valid age (0-130) required</p>}
                </div>

                <div>
                  <label htmlFor="patientGender" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="patientGender"
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    onBlur={() => markTouched('gender')}
                    className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldInvalid('gender') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldInvalid('gender') && <p className="text-[11px] text-rose-500 mt-1">Gender selection is required</p>}
                </div>
              </div>

              <div>
                <label htmlFor="patientCondition" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Condition <span className="text-rose-500">*</span>
                </label>
                <select
                  id="patientCondition"
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  onBlur={() => markTouched('condition')}
                  className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldInvalid('condition') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select Condition</option>
                  {CONDITION_OPTIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
                {fieldInvalid('condition') && <p className="text-[11px] text-rose-500 mt-1">Condition is required</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAddModal}
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
                  <span>Add Patient</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
