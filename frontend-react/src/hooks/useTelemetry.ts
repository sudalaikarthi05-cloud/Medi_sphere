import { useCallback, useEffect, useRef, useState } from 'react';
import { pushTelemetry } from '../services/vitals';
import type { Vital } from '../types/vital';

/**
 * Polls simulated telemetry for a patient on an interval, mirroring the Angular
 * component's `interval(6000)` subscription - but with correct cleanup and no
 * state update after unmount.
 */
export function useTelemetry(patientId: string, intervalMs = 6000) {
  const [vitals, setVitals] = useState<Vital | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const mountedRef = useRef(true);
  const busyRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await pushTelemetry(patientId);
      if (!mountedRef.current) return;
      setVitals(res.vital);
      setLastUpdated(res.vital.timestamp);
    } finally {
      busyRef.current = false;
    }
  }, [patientId]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), intervalMs);
    return () => window.clearInterval(timer);
  }, [refresh, intervalMs]);

  return { vitals, lastUpdated, refresh };
}
