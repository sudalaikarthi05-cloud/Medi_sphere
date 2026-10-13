import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from './api';
import { clearSession, getUser, isAdminRole, saveSession } from './session';
import type { UserSession } from './session';

export type { UserSession } from './session';

interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  title?: string;
}

interface AuthContextValue {
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toSession(response: AuthResponse): UserSession {
  return {
    email: response.email,
    name: response.name,
    role: response.role,
    token: response.token,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Rehydrated synchronously so the route guards work on the very first render.
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getUser());

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<AuthResponse>(
      '/auth/login',
      { email, password },
      { skipAuthRedirect: true },
    );
    const session = toSession(response);
    saveSession(session);
    setCurrentUser(session);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>(
      '/auth/register',
      { name, email, password },
      { skipAuthRedirect: true },
    );
    const session = toSession(response);
    saveSession(session);
    setCurrentUser(session);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      isAdmin: isAdminRole(currentUser?.role),
      login,
      register,
      logout,
    }),
    [currentUser, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
