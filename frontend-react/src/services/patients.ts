import { api } from '../lib/api';
import { FALLBACK_PATIENTS, generateSynthetic360 } from '../lib/fallbackData';
import type { Patient, Patient360Response, PatientFormData } from '../types';

export interface PatientFilters {
  search?: string;
  condition?: string;
  status?: string;
}

/**
 * The API is a thin pass-through over Mongo, so the collection can contain
 * partially-written documents (all-null fields, missing name). Everything is
 * normalised here so a bad record can never crash a render.
 */
type RawPatient = Partial<Patient> & Record<string, unknown>;

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeRiskLevel(value: unknown): string {
  switch (asText(value).toUpperCase()) {
    case 'HIGH':
      return 'High';
    case 'LOW':
      return 'Low';
    default:
      return 'Medium';
  }
}

/** Returns null for records with no usable identity, so they can be dropped. */
export function normalizePatient(raw: RawPatient | null | undefined): Patient | null {
  if (!raw || typeof raw !== 'object') return null;

  const name = asText(raw.name);
  if (!name) return null;

  return {
    id: asText(raw.id, name),
    name,
    age: asNumber(raw.age),
    gender: asText(raw.gender, 'Unspecified'),
    condition: asText(raw.condition, 'Unspecified'),
    status: asText(raw.status, 'Active'),
    riskLevel: normalizeRiskLevel(raw.riskLevel),
    riskScore: asNumber(raw.riskScore),
    assignedDoctor: asText(raw.assignedDoctor) || undefined,
    roomNumber: asText(raw.roomNumber) || undefined,
    createdAt: asText(raw.createdAt) || undefined,
    updatedAt: asText(raw.updatedAt) || undefined,
  };
}

function normalizePatientList(raw: unknown): Patient[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => normalizePatient(entry as RawPatient))
    .filter((patient): patient is Patient => patient !== null);
}

function normalizeList<T>(raw: unknown): T[] {
  return Array.isArray(raw) ? (raw as T[]) : [];
}

function filterFallback(filters: PatientFilters): Patient[] {
  let list = [...FALLBACK_PATIENTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q),
    );
  }
  if (filters.condition) {
    list = list.filter((p) => p.condition.toLowerCase() === filters.condition!.toLowerCase());
  }
  if (filters.status) {
    list = list.filter((p) => p.status.toLowerCase() === filters.status!.toLowerCase());
  }
  return list;
}

function buildQuery(filters: PatientFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.status) params.set('status', filters.status);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function deriveRisk(condition: string): { riskScore: number; riskLevel: string } {
  const c = condition.toLowerCase();
  if (c.includes('cardiac')) return { riskScore: 80, riskLevel: 'High' };
  if (c.includes('diabetes') || c.includes('hypertension')) {
    return { riskScore: 58, riskLevel: 'Medium' };
  }
  return { riskScore: 30, riskLevel: 'Low' };
}

export async function fetchPatients(
  filters: PatientFilters,
  onDemoMode: () => void,
): Promise<Patient[]> {
  try {
    const raw = await api.get<unknown>(`/patients${buildQuery(filters)}`);
    return normalizePatientList(raw);
  } catch {
    onDemoMode();
    return filterFallback(filters);
  }
}

export async function fetchPatientById(
  id: string,
  onDemoMode: () => void,
): Promise<Patient> {
  try {
    const raw = await api.get<unknown>(`/patients/${id}`);
    return normalizePatient(raw as RawPatient) ?? FALLBACK_PATIENTS[0];
  } catch {
    onDemoMode();
    return FALLBACK_PATIENTS.find((p) => p.id === id) ?? FALLBACK_PATIENTS[0];
  }
}

export async function fetchPatient360(
  id: string,
  onDemoMode: () => void,
): Promise<Patient360Response> {
  try {
    const raw = (await api.get<Record<string, unknown>>(`/patients/${id}/360`)) ?? {};
    const patient = normalizePatient(raw.patient as RawPatient);

    if (!patient) {
      // A record without an identity cannot render a 360 view - use synthetic context
      onDemoMode();
      return generateSynthetic360(id);
    }

    return {
      patient,
      currentVitals: (raw.currentVitals as Patient360Response['currentVitals']) ?? generateSynthetic360(id).currentVitals,
      riskAssessment:
        (raw.riskAssessment as Patient360Response['riskAssessment']) ??
        generateSynthetic360(id).riskAssessment,
      labReports: normalizeList<Patient360Response['labReports'][number]>(raw.labReports),
      preventiveCare: normalizeList<Patient360Response['preventiveCare'][number]>(raw.preventiveCare),
      dataSource: raw.dataSource === 'LIVE_CLINICAL' ? 'LIVE_CLINICAL' : 'SYNTHETIC_DEMO',
    };
  } catch {
    onDemoMode();
    return generateSynthetic360(id);
  }
}

export async function createPatient(formData: PatientFormData): Promise<Patient> {
  try {
    return await api.post<Patient>('/patients', formData);
  } catch {
    // Resilient in-memory fallback for demo mode
    const { riskScore, riskLevel } = deriveRisk(formData.condition);
    return {
      id: `P00${FALLBACK_PATIENTS.length + 1}`,
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      condition: formData.condition,
      status: formData.status || 'Active',
      riskLevel,
      riskScore,
      assignedDoctor: 'Dr. Ananya Sharma',
    };
  }
}
