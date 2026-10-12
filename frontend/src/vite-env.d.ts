/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL for the Medisphere backend REST API.
   *
   * - Omit during `npm run dev` to use http://localhost:8080/api
   * - Omit in a production build to use the relative path "/api",
   *   which nginx proxies to the backend container
   *   (see frontend-react/nginx.conf)
   * - Set explicitly to call a backend on another host, e.g.
   *   VITE_API_BASE_URL=https://api.example.com/api
   *
   * Vite only exposes variables prefixed with VITE_ to the client
   * bundle. Never put a secret in a VITE_* variable; it is shipped
   * to every browser in plaintext.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
