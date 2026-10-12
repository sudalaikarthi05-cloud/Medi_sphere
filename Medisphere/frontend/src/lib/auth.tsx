import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface UserSession {
  email: string;
  name: string;
  role: string;
  title: string;
  token?: string;
}

const USER_KEY = 'medisphere_user';
const TOKEN_KEY = 'medisphere_token';
const LOGGED_IN_KEY = 'medisphere_logged_in';

const DEMO_EMAIL = 'doctor@medisphere.demo';
const DEMO_PASSWORD = 'demo123';

const DEFAULT_USER: UserSession = {
  email: DEMO_EMAIL,
  name: 'Dr. Ananya Sharma',
  role: 'Clinical Administrator',
  title: 'Chief Medical Intelligence Officer',
  token: 'medisphere-session-demo-token-jwt',
};

interface AuthContextValue {
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Mirrors the Angular AuthService demo behaviour exactly:
 * hardcoded demo credentials, session persisted in localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const user: UserSession = { ...DEFAULT_USER, email };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, user.token ?? 'medisphere-jwt-token');
      localStorage.setItem(LOGGED_IN_KEY, 'true');
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGGED_IN_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved) as UserSession);
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    } else if (localStorage.getItem(LOGGED_IN_KEY) === 'true') {
      login(DEMO_EMAIL, DEMO_PASSWORD);
    }
  }, [login, logout]);

  const value = useMemo(
    () => ({ currentUser, isAuthenticated, login, logout }),
    [currentUser, isAuthenticated, login, logout],
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
