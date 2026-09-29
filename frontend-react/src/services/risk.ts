import { api } from '../lib/api';
import { buildFallbackRisk } from '../lib/fallbackData';
import type { Patient } from '../types';
import type { RiskAssessment, RiskResponse } from '../types/risk';

const DEFAULT_INVIEWS = [
  'Blood pressure trend has remained elevated over recent observations.',
  'Glucose values show a mild upward trend.',
  'Regular monitoring is recommended based on available synthetic data.',
];

export async function fetchPatientRisk(
  patientId: string,
  patient: Patient,
): Promise<RiskAssessment> {
  try {
    return await api.get<RiskAssessment>(`/patients/${patientId}/risk`);
  } catch {
    return buildFallbackRisk(patient);
  }
}

export async function fetchClinicalInsights(patientId: string): Promise<RiskResponse> {
  try {
    return await api.get<RiskResponse>(`/patients/${patientId}/insights`);
  } catch {
    const patient: Patient = {
      id: patientId,
      name: 'Arun Kumar',
      age: 52,
      gender: 'Male',
      condition: 'Hypertension',
      status: 'Active',
      riskLevel: 'Medium',
      riskScore: 62,
      assignedDoctor: 'Dr. Ananya Sharma',
    };
    return {
      assessment: buildFallbackRisk(patient),
      clinicalInsights: DEFAULT_INVIEWS,
      legalNotice: 'Synthetic healthcare data decision-support only. Not medically validated diagnosis.',
    };
  }
}
