# API Call Examples: Local vs Production

## Local Development (e.g., Vite dev server on localhost:3000)
- Backend runs on http://localhost:8080
- Frontend should call: http://localhost:8080/api/health

Example (fetch):
`	s
const res = await fetch('http://localhost:8080/api/health');
const data = await res.json();
`

Example (axios):
`	s
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8080/api' });
const { data } = await api.get('/health');
`

## Production (Render)
- Backend runs as a Web Service on Render at your app URL, e.g. https://medisphere-backend.onrender.com
- Frontend (also deployed) calls via same domain if proxied, or directly to backend URL
- With /api/* rewrites (if using reverse proxy) call relative path: /api/health
- Without proxy, call absolute backend URL: https://your-backend.onrender.com/api/health

Best practice: use environment variable for base URL in frontend.
`	s
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const res = await fetch(${API_BASE}/health);
`

Set VITE_API_BASE_URL in local .env for local dev, or leave empty to use relative paths in production.