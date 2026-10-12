import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { VitalCard } from '../components/VitalCard';
import { RiskCard } from '../components/RiskCard';
import { DigitalTwin } from '../components/DigitalTwin';
import { LabReportCard } from '../components/LabReportCard';
import { useTelemetry } from '../hooks/useTelemetry';
import { fetchPatient360 } from '../services/patients';
import { getInitials, getRiskBadge, getStatusBadge, getStatusDot } from '../lib/ui';
import type { Patient360Response } from '../types';

const DEFAULT_INSIGHTS = [
  'Blood pressure trend has remained elevated over recent observations.',
  'Glucose values show a mild upward trend.',
  'Regular monitoring is recommended based on available synthetic data.',
];

const HIGH_RISK_INSIGHTS = [
  'Telemetry shows acute systolic spike with concurrent marginal troponin elevation.',
  'Cardiovascular risk index exceeds 80th percentile for peer demographic.',
  'Clinical protocol triggers immediate bedside review notification.',
];

export function Patient360() {
  const { id = 'P001' } = useParams();
  const [data, setData] = useState<Patient360Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const { vitals: liveVitals, lastUpdated, refresh } = useTelemetry(id);

  // Prefer the newest reading: telemetry pushes override the snapshot from the 360 payload
  const currentVitals = liveVitals ?? data?.currentVitals ?? null;
  const clinicalInsights = data?.patient?.riskLevel === 'High' ? HIGH_RISK_INSIGHTS : DEFAULT_INSIGHTS;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');

    fetchPatient360(id, () => {})
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to load this patient record. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const patient = data?.patient;
  const vitalStatus = currentVitals?.status || 'Normal';
  const bpFormatted = currentVitals ? `${currentVitals.systolicBp}/${currentVitals.diastolicBp}` : '128/82';

  const handleTelemetry = useCallback(() => void refresh(), [refresh]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Patient 360" subtitle="Unified clinical context & cognitive twin intelligence" />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/patients"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Patients</span>
          </Link>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-sm text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold text-slate-800">Live Telemetry</span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-mono text-slate-500 text-[11px]">{lastUpdated}</span>
            </div>

            <button
              onClick={handleTelemetry}
              title="Simulate Real-time Sensor Packet"
              className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-full text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Push Telemetry</span>
            </button>
          </div>
        </div>

        {loadError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-sm">
            {loadError}
          </div>
        )}

        {isLoading && !data && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-xs text-slate-400 shadow-sm">
            Assembling patient context...
          </div>
        )}

        {patient && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/15 ring-4 ring-blue-50">
                {getInitials(patient.name)}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {patient.id}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(patient.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(patient.status)}`} />
                    {patient.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                  <span>
                    <strong className="text-slate-700 font-semibold">{patient.age}</strong> years
                  </span>
                  <span>&bull;</span>
                  <span>
                    <strong className="text-slate-700 font-semibold">{patient.gender}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Condition: <strong className="text-slate-800 font-semibold">{patient.condition}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Attending: <strong className="text-slate-700 font-semibold">{patient.assignedDoctor || 'Dr. Ananya Sharma'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-auto">
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Risk Classification
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-0.5 ${getRiskBadge(patient.riskLevel)}`}
                >
                  {patient.riskLevel} (Score: {patient.riskScore})
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <VitalCard
            label="Heart Rate"
            value={currentVitals?.heartRate || 72}
            unit="bpm"
            status={vitalStatus}
            updatedTime={lastUpdated}
            type="heart"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          />

          <VitalCard
            label="Blood Pressure"
            value={bpFormatted}
            unit="mmHg"
            status={vitalStatus}
            updatedTime={lastUpdated}
            type="bp"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          <VitalCard
            label="SpO2"
            value={currentVitals?.spo2 || 98}
            unit="%"
            status={vitalStatus}
            updatedTime={lastUpdated}
            type="spo2"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            }
          />

          <VitalCard
            label="Temperature"
            value={currentVitals?.temperature || 98.4}
            unit="°F"
            status={vitalStatus}
            updatedTime={lastUpdated}
            type="temp"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
        </div>

        <div>
          <DigitalTwin vitals={currentVitals} isLive />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskCard risk={data?.riskAssessment ?? null} />

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">AI-Assisted Clinical Insights</h3>
                    <p className="text-[11px] text-slate-500">TensorFlow Federated pattern detection</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  TFF Inference
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {clinicalInsights.map((insight) => (
                  <div key={insight} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-400">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                <strong>Decision-Support Notice:</strong> AI-generated decision-support information based on synthetic
                healthcare data. This is not a medically validated diagnosis.
              </span>
            </div>
          </div>
        </div>

        <LabReportCard labs={data?.labReports || []} preventiveCare={data?.preventiveCare || []} />
      </main>
    </div>
  );
}
