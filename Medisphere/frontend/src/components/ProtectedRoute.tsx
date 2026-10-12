import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth';

const LOGGED_IN_KEY = 'medisphere_logged_in';

/**
 * Port of the Angular functional `authGuard`. Preserves the demo bypass so the
 * React build behaves identically to the Angular reference.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Read the persisted flag directly so the first render can pass the guard;
  // AuthProvider rehydrates the actual session in an effect.
  const hasSession = isAuthenticated || localStorage.getItem(LOGGED_IN_KEY) === 'true';

  if (hasSession) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
}
