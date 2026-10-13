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
  ownerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
}

export type BookingStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  patientId: string;
  ownerEmail?: string;
  doctor?: string;
  department?: string;
  appointmentDateTime?: string;
  reason?: string;
  status: string;
  createdAt?: string;
  isDeleted?: number;
}

export interface BookingFormData {
  patientId: string;
  doctor: string;
  department: string;
  appointmentDateTime: string;
  reason: string;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  joinedDate?: string;
  patientCount: number;
  bookingCount: number;
}

export interface AdminUserDetails {
  patients: Patient[];
  bookings: Booking[];
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
