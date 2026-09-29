import type { Vital } from '../types/vital';
import type { RiskAssessment } from '../types/risk';
import type { LabReport, PreventiveCare } from '../types/lab';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: string; // "Active" | "Monitoring" | "Discharged"
  riskLevel: string; // "Low" | "Medium" | "High"
  riskScore: number; // 0-100
  assignedDoctor?: string;
  roomNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient360Response {
  patient: Patient;
  currentVitals: Vital;
  riskAssessment: RiskAssessment;
  labReports: LabReport[];
  preventiveCare: PreventiveCare[];
  dataSource: 'LIVE_CLINICAL' | 'SYNTHETIC_DEMO';
}

export interface PatientFormData {
  name: string;
  age: number | string;
  gender: string;
  condition: string;
  status?: string;
}

export type { Vital, RiskAssessment, LabReport, PreventiveCare };
