export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssessment {
  id?: string;
  patientId: string;
  level: RiskLevel;
  score: number; // 0-100
  message: string;
  contributingFactors: string[];
  recommendations: string[];
  insightLabel: string;
  disclaimer: string;
  modelArchitecture?: string;
  evaluatedAt: string;
}

export interface RiskResponse {
  assessment: RiskAssessment;
  clinicalInsights: string[];
  legalNotice: string;
}
