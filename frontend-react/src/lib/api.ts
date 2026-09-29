const DEV_API_BASE_URL = 'http://localhost:8080/api';

/**
 * Resolved once at build time.
 *
 * - `npm run dev`      -> http://localhost:8080/api (backend on the host)
 * - production build   -> /api (relative), so the nginx reverse proxy in
 *                         nginx.conf forwards to the backend container
 * - VITE_API_BASE_URL  -> explicit override, wins in both modes
 *
 * A trailing slash is stripped so `${API_BASE_URL}/patients` never
 * produces a double slash.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? DEV_API_BASE_URL : '/api')
).replace(/\/+$/, '');

const TOKEN_KEY = 'medisphere_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...buildHeaders(), ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
