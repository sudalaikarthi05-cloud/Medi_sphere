import type { Patient, Patient360Response } from '../types';
import type { LabReport, PreventiveCare } from '../types/lab';
import type { RiskAssessment } from '../types/risk';
import type { Vital } from '../types/vital';

const RISK_DISCLAIMER =
  'AI-generated decision-support information based on synthetic healthcare data. This is not a medically validated diagnosis.';

const MODEL_ARCHITECTURE = 'TensorFlow Federated Aggregation (FedAvg across synthetic hospital nodes)';

export const FALLBACK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'Arun Kumar',
    age: 52,
    gender: 'Male',
    condition: 'Hypertension',
    status: 'Active',
    riskLevel: 'Medium',
    riskScore: 62,
    assignedDoctor: 'Dr. Ananya Sharma',
    roomNumber: 'Cardio-402',
  },
  {
    id: 'P002',
    name: 'Priya Sharma',
    age: 44,
    gender: 'Female',
    condition: 'Diabetes',
    status: 'Monitoring',
    riskLevel: 'Low',
    riskScore: 28,
    assignedDoctor: 'Dr. Ananya Sharma',
    roomNumber: 'Endo-205',
  },
  {
    id: 'P003',
    name: 'Rahul Raj',
    age: 61,
    gender: 'Male',
    condition: 'Cardiac Risk',
    status: 'Active',
    riskLevel: 'High',
    riskScore: 84,
    assignedDoctor: 'Dr. Ananya Sharma',
    roomNumber: 'CCU-108',
  },
  {
    id: 'P004',
    name: 'Meena Devi',
    age: 38,
    gender: 'Female',
    condition: 'Healthy',
    status: 'Active',
    riskLevel: 'Low',
    riskScore: 14,
    assignedDoctor: 'Dr. Ananya Sharma',
    roomNumber: 'Wellness-310',
  },
  {
    id: 'P005',
    name: 'Karthik Anand',
    age: 56,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    status: 'Monitoring',
    riskLevel: 'Medium',
    riskScore: 58,
    assignedDoctor: 'Dr. Ananya Sharma',
    roomNumber: 'Endo-214',
  },
];

const HIGH_RISK_LABS: Omit<LabReport, 'id' | 'patientId'>[] = [
  { testName: 'Troponin I', value: '0.05', unit: 'ng/mL', status: 'Attention', referenceRange: '< 0.04 ng/mL', date: '2026-09-10' },
  { testName: 'Total Cholesterol', value: '242', unit: 'mg/dL', status: 'Elevated', referenceRange: '< 200 mg/dL', date: '2026-09-10' },
  { testName: 'LDL Cholesterol', value: '162', unit: 'mg/dL', status: 'Elevated', referenceRange: '< 100 mg/dL', date: '2026-09-10' },
  { testName: 'Blood Glucose', value: '128', unit: 'mg/dL', status: 'Attention', referenceRange: '70 - 99 mg/dL', date: '2026-09-10' },
];

const STANDARD_LABS: Omit<LabReport, 'id' | 'patientId'>[] = [
  { testName: 'Blood Glucose', value: '112', unit: 'mg/dL', status: 'Attention', referenceRange: '70 - 99 mg/dL', date: '2026-09-08' },
  { testName: 'Hemoglobin', value: '13.8', unit: 'g/dL', status: 'Normal', referenceRange: '13.2 - 16.6 g/dL', date: '2026-09-08' },
  { testName: 'Cholesterol', value: '188', unit: 'mg/dL', status: 'Normal', referenceRange: '< 200 mg/dL', date: '2026-09-08' },
  { testName: 'Serum Creatinine', value: '1.0', unit: 'mg/dL', status: 'Normal', referenceRange: '0.7 - 1.3 mg/dL', date: '2026-09-08' },
];

const HIGH_RISK_CARE: Omit<PreventiveCare, 'id' | 'patientId'>[] = [
  { title: 'Continuous cardiac rhythm evaluation', description: 'Holter ambulatory telemetry monitoring', priority: 'High', status: 'Active', interval: 'Continuous' },
  { title: 'Lipid profile reassessment', description: 'Post-statin therapy lipid panel verification', priority: 'High', status: 'Scheduled', interval: 'Monthly' },
  { title: 'Cardiology specialist consultation', description: 'Review ventricular wall motion and exercise tolerance', priority: 'High', status: 'Scheduled', interval: 'Bi-weekly' },
  { title: 'Cardiac rehabilitation program', description: 'Supervised aerobic exercise and stress reduction protocol', priority: 'Medium', status: 'Active', interval: 'Weekly' },
];

const STANDARD_CARE: Omit<PreventiveCare, 'id' | 'patientId'>[] = [
  { title: 'Blood pressure monitoring', description: 'Twice daily home systolic/diastolic recording', priority: 'High', status: 'Active', interval: 'Daily' },
  { title: 'Routine glucose screening', description: 'Fasting blood glucose panel follow-up', priority: 'Medium', status: 'Pending', interval: 'Quarterly' },
  { title: 'Annual cardiovascular assessment', description: 'Echocardiogram and resting ECG examination', priority: 'Medium', status: 'Scheduled', interval: 'Annual' },
  { title: 'Healthy lifestyle review', description: 'Sodium reduction counselling and dietary DASH regimen', priority: 'Routine', status: 'Active', interval: 'Ongoing' },
];

export function buildFallbackLabs(patientId: string, highRisk: boolean): LabReport[] {
  const source = highRisk ? HIGH_RISK_LABS : STANDARD_LABS;
  const start = highRisk ? 5 : 1;
  return source.map((lab, index) => ({
    id: `L00${start + index}`,
    patientId,
    ...lab,
  }));
}

export function buildFallbackCare(patientId: string, highRisk: boolean): PreventiveCare[] {
  const source = highRisk ? HIGH_RISK_CARE : STANDARD_CARE;
  const start = highRisk ? 5 : 1;
  return source.map((care, index) => ({
    id: `PR00${start + index}`,
    patientId,
    ...care,
  }));
}

export function buildFallbackRisk(patient: Patient): RiskAssessment {
  const isHighRisk = patient.riskLevel === 'High';
  return {
    patientId: patient.id,
    level: (patient.riskLevel.toUpperCase() as RiskAssessment['level']) ?? 'MEDIUM',
    score: patient.riskScore,
    message: isHighRisk
      ? 'Elevated cardiovascular risk detected. Focused clinical monitoring advised.'
      : 'Current indicators suggest increased monitoring may be appropriate.',
    contributingFactors: isHighRisk
      ? ['Systolic Blood Pressure', 'Troponin I Marker', 'Age > 60', 'Elevated Lipids']
      : ['Blood Pressure', 'Glucose', 'Age', 'Previous Condition'],
    recommendations: isHighRisk
      ? ['Continuous ECG telemetry', 'Cardiology consult', 'Titrate antihypertensive therapy']
      : [
          'Home blood pressure telemonitoring',
          'Sodium restriction diet',
          'Routine metabolic screen in 30 days',
        ],
    insightLabel: 'AI-Assisted Insight',
    disclaimer: RISK_DISCLAIMER,
    modelArchitecture: MODEL_ARCHITECTURE,
    evaluatedAt: new Date().toISOString(),
  };
}

export function buildFallbackVitals(patient: Patient): Vital {
  const isHighRisk = patient.riskLevel === 'High';
  return {
    patientId: patient.id,
    heartRate: isHighRisk ? 88 : 72,
    systolicBp: isHighRisk ? 154 : 128,
    diastolicBp: isHighRisk ? 94 : 82,
    spo2: isHighRisk ? 96.5 : 98.0,
    temperature: isHighRisk ? 99.1 : 98.4,
    bloodPressureFormatted: isHighRisk ? '154/94 mmHg' : '128/82 mmHg',
    status: isHighRisk ? 'Attention' : 'Normal',
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

export function generateSynthetic360(id: string): Patient360Response {
  const patient: Patient = FALLBACK_PATIENTS.find((p) => p.id === id) ?? {
    id,
    name: 'Arun Kumar',
    age: 52,
    gender: 'Male',
    condition: 'Hypertension',
    status: 'Active',
    riskLevel: 'Medium',
    riskScore: 62,
    assignedDoctor: 'Dr. Ananya Sharma',
  };

  const isHighRisk = patient.riskLevel === 'High';

  return {
    patient,
    currentVitals: buildFallbackVitals(patient),
    riskAssessment: buildFallbackRisk(patient),
    labReports: buildFallbackLabs(id, isHighRisk),
    preventiveCare: buildFallbackCare(id, isHighRisk),
    dataSource: 'SYNTHETIC_DEMO',
  };
}
