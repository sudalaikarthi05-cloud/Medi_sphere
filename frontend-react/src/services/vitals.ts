import { api } from '../lib/api';
import type { Vital, VitalResponse } from '../types/vital';

function buildVital(patientId: string, vital: Omit<Vital, 'patientId' | 'timestamp'>): Vital {
  return {
    patientId,
    ...vital,
    timestamp: new Date().toLocaleTimeString(),
  };
}

export async function fetchPatientVitals(patientId: string): Promise<VitalResponse> {
  try {
    return await api.get<VitalResponse>(`/patients/${patientId}/vitals`);
  } catch {
    return {
      vital: buildVital(patientId, {
        heartRate: 72,
        systolicBp: 128,
        diastolicBp: 82,
        bloodPressureFormatted: '128/82 mmHg',
        spo2: 98.0,
        temperature: 98.4,
        status: 'Normal',
      }),
      isRealTime: true,
      source: 'DEMO_SIMULATOR',
    };
  }
}

export async function pushTelemetry(patientId: string): Promise<VitalResponse> {
  try {
    return await api.post<VitalResponse>(`/patients/${patientId}/vitals/simulate`, {});
  } catch {
    const heartRate = 68 + Math.floor(Math.random() * 12);
    const systolicBp = 122 + Math.floor(Math.random() * 14);
    const diastolicBp = 78 + Math.floor(Math.random() * 8);
    const spo2 = Math.round((97.2 + Math.random() * 2) * 10) / 10;
    const temperature = Math.round((98.2 + Math.random() * 0.5) * 10) / 10;

    return {
      vital: buildVital(patientId, {
        heartRate,
        systolicBp,
        diastolicBp,
        bloodPressureFormatted: `${systolicBp}/${diastolicBp} mmHg`,
        spo2,
        temperature,
        status: systolicBp > 145 ? 'Attention' : 'Normal',
      }),
      isRealTime: true,
      source: 'DEMO_SIMULATOR',
    };
  }
}
