export interface UserSession {
  email: string;
  name: string;
  role: string;
  token: string;
}

export const USER_KEY = 'medisphere_user';
export const TOKEN_KEY = 'medisphere_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): UserSession | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (!parsed || typeof parsed !== 'object' || !parsed.email) return null;
    return {
      email: String(parsed.email),
      name: String(parsed.name ?? parsed.email),
      role: String(parsed.role ?? 'ROLE_USER'),
      token: String(parsed.token ?? ''),
    };
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdminRole(role: string | null | undefined): boolean {
  return (role ?? '').toUpperCase() === 'ROLE_ADMIN';
}
