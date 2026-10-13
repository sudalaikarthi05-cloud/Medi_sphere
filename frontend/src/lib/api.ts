import { clearSession, getToken } from './session';

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

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string; error?: string; details?: Record<string, string> };
    if (data?.details && typeof data.details === 'object') {
      const first = Object.values(data.details)[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  } catch {
    // non-JSON body
  }
  return `Request failed (${response.status})`;
}

interface RequestOptions extends RequestInit {
  /** Auth calls must not trigger the global 401/403 logout redirect. */
  skipAuthRedirect?: boolean;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...buildHeaders(), ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);

    // An expired/invalid session must be dropped, but only when the user was
    // actually holding a token (login/register failures stay on the page).
    if ((response.status === 401 || response.status === 403) && !init?.skipAuthRedirect && getToken()) {
      clearSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
