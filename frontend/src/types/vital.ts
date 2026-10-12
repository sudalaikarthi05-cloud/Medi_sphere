export type VitalStatus = 'Normal' | 'Attention' | 'Critical';

export interface Vital {
  id?: string;
  patientId: string;
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spo2: number;
  temperature: number;
  bloodPressureFormatted?: string;
  status: VitalStatus;
  timestamp: string;
}

export interface VitalResponse {
  vital: Vital;
  isRealTime: boolean;
  source: 'KAFKA_STREAM' | 'DEMO_SIMULATOR';
}
