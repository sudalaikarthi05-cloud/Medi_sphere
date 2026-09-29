import { api } from '../lib/api';
import { buildFallbackCare, buildFallbackLabs } from '../lib/fallbackData';
import type { LabReport, PreventiveCare } from '../types/lab';

export async function fetchPatientLabs(patientId: string): Promise<LabReport[]> {
  try {
    return await api.get<LabReport[]>(`/patients/${patientId}/labs`);
  } catch {
    return buildFallbackLabs(patientId, false);
  }
}

export async function fetchPreventiveCare(patientId: string): Promise<PreventiveCare[]> {
  try {
    return await api.get<PreventiveCare[]>(`/patients/${patientId}/preventive-care`);
  } catch {
    return buildFallbackCare(patientId, false);
  }
}
