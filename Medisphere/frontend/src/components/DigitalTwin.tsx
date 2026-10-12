import type { Vital } from '../types/vital';

interface DigitalTwinProps {
  vitals: Vital | null;
  isLive?: boolean;
}

export function DigitalTwin({ vitals, isLive = true }: DigitalTwinProps) {
  const heartRate = vitals?.heartRate || 72;
  const systolic = vitals?.systolicBp || 128;
  const diastolic = vitals?.diastolicBp || 82;
  const spo2 = vitals?.spo2 || 98;
  const temperature = vitals?.temperature || 98.4;
  const status = vitals?.status || 'Normal';

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 text-white shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <h3 className="text-base font-bold text-white tracking-wide">Live Physiological Overview</h3>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
              Cognitive Twin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Data synchronized from available patient sources and simulated sensor feeds.</p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/60 text-xs text-emerald-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Monitoring active</span>
        </div>
      </div>

      <div className="relative py-8 flex flex-col md:flex-row items-center justify-center min-h-[380px] z-10">
        <div className="w-full md:w-56 space-y-5 mb-6 md:mb-0">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-3.5 hover:border-rose-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Heart Rate</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">{status}</span>
            </div>
            <div className="mt-1.5 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">{heartRate}</span>
              <span className="text-xs text-slate-400">bpm</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Sensor: Cardiac Lead II</span>
              <span className="text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">Cardiac &rarr;</span>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-3.5 hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Blood Pressure</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Hemodynamic</span>
            </div>
            <div className="mt-1.5 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
                {systolic}/{diastolic}
              </span>
              <span className="text-xs text-slate-400">mmHg</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Arterial Vascular</span>
              <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">Brachial &rarr;</span>
            </div>
          </div>
        </div>

        <div className="relative w-64 h-80 flex items-center justify-center mx-4 select-none">
          <svg
            className="w-56 h-80 text-slate-700 drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            viewBox="0 0 200 300"
            fill="currentColor"
          >
            <ellipse cx="100" cy="35" rx="20" ry="24" className="text-slate-800 fill-current opacity-90" />
            <path d="M93 58 h14 v12 h-14 z" className="text-slate-800 fill-current" />
            <path
              d="M60 70 C70 65, 130 65, 140 70 C148 74, 150 90, 145 120 L138 175 C136 182, 128 185, 120 185 L80 185 C72 185, 64 182, 62 175 L55 120 C50 90, 52 74, 60 70 Z"
              className="text-slate-800 fill-current opacity-80"
            />
            <path d="M56 75 L38 135 C36 142, 32 155, 30 170 C28 180, 24 185, 20 178 C17 170, 20 150, 25 130 L45 72 Z" className="text-slate-800/80 fill-current" />
            <path d="M144 75 L162 135 C164 142, 168 155, 170 170 C172 180, 176 185, 180 178 C183 170, 180 150, 175 130 L155 72 Z" className="text-slate-800/80 fill-current" />
            <path d="M78 185 L74 245 C72 260, 70 280, 68 290 C67 296, 60 297, 60 290 L65 240 L70 185 Z" className="text-slate-800/70 fill-current" />
            <path d="M122 185 L126 245 C128 260, 130 280, 132 290 C133 296, 140 297, 140 290 L135 240 L130 185 Z" className="text-slate-800/70 fill-current" />
          </svg>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 300">
            <line x1="108" y1="105" x2="30" y2="70" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
            <line x1="62" y1="125" x2="30" y2="150" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
            <line x1="172" y1="165" x2="175" y2="70" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
            <line x1="100" y1="135" x2="175" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />

            <circle cx="108" cy="105" r="4" fill="#f43f5e" className="animate-ping" opacity="0.7" />
            <circle cx="108" cy="105" r="5" fill="#f43f5e" />
            <circle cx="62" cy="125" r="4" fill="#3b82f6" />
            <circle cx="172" cy="165" r="4" fill="#06b6d4" />
            <circle cx="100" cy="135" r="4" fill="#f59e0b" />
          </svg>
        </div>

        <div className="w-full md:w-56 space-y-5 mt-6 md:mt-0">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-3.5 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SpO2 Saturation</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Oxygenation</span>
            </div>
            <div className="mt-1.5 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">{spo2}</span>
              <span className="text-xs text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-cyan-400 font-semibold group-hover:-translate-x-1 transition-transform">&larr; Peripheral</span>
              <span>Pulse Oximetry</span>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-3.5 hover:border-amber-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Temperature</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Homeostasis</span>
            </div>
            <div className="mt-1.5 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">{temperature}</span>
              <span className="text-xs text-slate-400">°F</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-amber-400 font-semibold group-hover:-translate-x-1 transition-transform">&larr; Thermal Core</span>
              <span>Continuous Telemetry</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
        <span className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Demonstration visualization model for software project. Not a clinically validated digital twin.</span>
        </span>
        <span className="text-slate-400">Kafka Stream: {isLive ? 'Simulated Active' : 'Idle'}</span>
      </div>
    </div>
  );
}
