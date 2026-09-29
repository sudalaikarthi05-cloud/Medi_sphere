import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchPatients, createPatient } from '../services/patients';
import type { PatientFilters } from '../services/patients';
import type { Patient, PatientFormData } from '../types';

interface PatientsContextValue {
  patients: Patient[];
  isDemoMode: boolean;
  isLoading: boolean;
  loadPatients: (filters?: PatientFilters) => void;
  addPatient: (formData: PatientFormData) => Promise<Patient>;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

/**
 * Shared patient registry state. Equivalent to the Angular PatientService being
 * provided in root with a signal, so the sidebar, dashboard and registry all
 * observe the same list.
 */
export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequestId = useRef(0);

  const loadPatients = useCallback((filters: PatientFilters = {}) => {
    const requestId = ++latestRequestId.current;
    setIsLoading(true);

    fetchPatients(filters, () => setIsDemoMode(true))
      .then((data) => {
        // Ignore responses from superseded filter requests
        if (requestId !== latestRequestId.current) return;
        setPatients(data);
      })
      .finally(() => {
        if (requestId === latestRequestId.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const addPatient = useCallback(async (formData: PatientFormData) => {
    const created = await createPatient(formData);
    setPatients((prev) => [created, ...prev]);
    return created;
  }, []);

  const value = useMemo(
    () => ({ patients, isDemoMode, isLoading, loadPatients, addPatient }),
    [patients, isDemoMode, isLoading, loadPatients, addPatient],
  );

  return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
}

export function usePatients(): PatientsContextValue {
  const ctx = useContext(PatientsContext);
  if (!ctx) {
    throw new Error('usePatients must be used inside a <PatientsProvider>');
  }
  return ctx;
}
