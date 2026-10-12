export type LabStatus = 'Normal' | 'Attention' | 'Elevated' | 'Critical';
export type CarePriority = 'High' | 'Medium' | 'Routine';
export type CareStatus = 'Scheduled' | 'Pending' | 'Active' | 'Completed';

export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  value: string;
  unit: string;
  status: LabStatus;
  referenceRange: string;
  date: string;
}

export interface PreventiveCare {
  id: string;
  patientId: string;
  title: string;
  description: string;
  priority: CarePriority;
  status: CareStatus;
  interval: string;
}
