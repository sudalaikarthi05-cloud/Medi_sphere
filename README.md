# Medisphere Cognitive Twin

An AI-assisted healthcare management platform for **Digital Health Twins**: real-time patient
monitoring, longitudinal clinical records, FHIR-oriented interoperability, and clinical decision
support.

> **Disclaimer:** This is an educational / demonstration project. All patient data, vital trends,
> and risk predictions shown in the UI are **synthetic**. Nothing produced here is a medically
> validated diagnosis, and this software is **not a medical device**. Do not use it for real patient
> care.

---

## Table of Contents

- [Status](#status)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Authentication & Authorization](#authentication--authorization)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [The AI Service](#the-ai-service)
- [Kubernetes](#kubernetes)
- [Security Notice](#security-notice)
- [Known Issues](#known-issues)
- [Development](#development)

---

## Status

The frontend is complete and verified. The backend compiles and runs, but **several integration
paths are unfinished or misconfigured**. Read this before relying on the system.

| Component | State | Notes |
| --- | --- | --- |
| `frontend-react` | Working | Login/register, dashboard, patient list, patient 360, bookings, admin area. Builds clean. |
| `backend` | Working (core) | Spring Boot REST API, MongoDB repositories, real JWT auth + roles + per-user ownership, Kafka wiring. |
| Kafka | Partially wired | Producer/consumer exist; `docker-compose` sets `KAFKA_ENABLED=true` but no topics are provisioned. |
| MongoDB | Wired | Backend now reads `MONGODB_URI`; the Compose `mongodb` container actually receives data. |
| Config | Externalized | All env-specific values are placeholders; `prod` profile fails fast without secrets. |
| `ai/` | Simulation only | A pure-Python FedAvg **simulation**. No TensorFlow, no TFF, no real training. Not wired into the backend or Compose. |
| `ai-service/` | Empty placeholder | 5 zero-byte files. |
| `database/` | Empty placeholder | 3 zero-byte files. |
| `docs/` | Empty placeholder | 3 zero-byte files (including a 0-byte `architecture.png`). |
| `infrastructure/kubernetes` | Untested | Manifests reference images that have never been built or pushed. |
| CI/CD | Absent | No pipeline, no lint/test gating, no image publishing. |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Browser                                                                 │
│  React 19 SPA  ──►  http://localhost:8080/api  (hardcoded, see below)     │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                      ┌────────────▼────────────┐
                      │  Spring Boot 3.4.3      │
                      │  backend  (port 8080)   │
                      │  ├─ REST controllers    │
                      │  ├─ JWT auth filter     │
                      │  ├─ Clinical services   │
                      │  ├─ Kafka producer      │
                      │  └─ FHIR client         │
                      └──┬───────────┬──────────┘
                         │           │
              ┌──────────▼───┐   ┌───▼──────────────┐
              │  MongoDB     │   │  Apache Kafka    │
              │  (patients,  │   │  (vitals events) │
              │   vitals,    │   └──────────────────┘
              │   labs)      │
              └──────────────┘

  ┌───────────────────────────────────────────────────────────────────┐
  │  ai/service.py  (port 5000)  —  NOT wired into the above         │
  │  Python stdlib HTTP server + FedAvg simulation, stdlib only      │
  └───────────────────────────────────────────────────────────────────┘
```

`frontend-react/nginx.conf` also defines a `/api/` → `backend:8080/api/` reverse proxy for the
containerized build. The production bundle uses the **relative** `/api` path, so that proxy is now
actually used; `npm run dev` still targets `http://localhost:8080/api` directly. Override with
`VITE_API_BASE_URL`. See [Configuration](#configuration).

---

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Frontend | React / React DOM | 19.2.8 |
| | React Router | 7.18.4 |
| | TypeScript | ~6.0.2 |
| | Vite | ^8.3.0 |
| | Tailwind CSS | ^4.3.3 |
| | Linter | oxlint 1.81.0 |
| Backend | Spring Boot | 3.4.3 |
| | Java | 21 |
| | Spring Data MongoDB | managed |
| | Spring Security | managed |
| | Spring Kafka | managed |
| | JJWT | 0.12.6 |
| Data | MongoDB | 7.0 (`mongo:7.0`) |
| Streaming | Kafka + Zookeeper | Confluent 7.5.0 |
| AI | Python stdlib `http.server` | — (no ML framework) |
| Packaging | Docker / Docker Compose | — |
| Orchestration | Kubernetes | — |

---

## Quick Start

### Prerequisites

- **Node.js 20+** and npm
- **JDK 21** and Maven 3.9+ (only for local backend runs)
- **Docker + Docker Compose v2** (only for the containerized stack)

### 1. Frontend (recommended starting point)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. Accounts are **real and MongoDB-backed**: use **Create Account** to
register, or **Sign In** with an existing account (see [Authentication & Authorization](#authentication--authorization)).
Sign-in/registration require the backend to be running. After you are signed in, the patient views
ship with synthetic fallback data, so they still render if the API later becomes unreachable —
`src/lib/fallbackData.ts` supplies patients, vitals, labs, and care plans as a fallback.

Production build:

```bash
npm run build      # tsc -b && vite build  → dist/
npm run preview
```

### 2. Backend

Run from the **repository root** so the root `.env` is loaded:

```bash
mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.workingDirectory=$(pwd)
```

> **Do not** use `cd backend && mvn spring-boot:run`. The Spring Boot plugin defaults its working
> directory to the project basedir (`backend/`), so `spring.config.import=optional:file:.env` finds
> no `.env` there. `MONGODB_URI` then stays unset and the app fails at startup with
> `The connection string is invalid`. The `spring-boot.run.workingDirectory` override above points
> the process at the repo root instead.

The API starts on `http://localhost:8080`. Health check:

```bash
curl http://localhost:8080/api/health/status
```

On Windows PowerShell, use `-Dspring-boot.run.workingDirectory=C:\path\to\medisphere`.

> The backend reads `MONGODB_URI`. Out of the box it targets a **local** MongoDB, so start one
> (e.g. `docker compose up mongodb`) or set the Atlas values in the root `.env`. If MongoDB is
> unavailable, patient creation returns an error instead of reporting an in-memory record as saved.

### 3. Full stack with Docker Compose

```bash
cp .env.example .env     # optional; see Configuration
docker compose up --build
```

Services and ports:

| Service | Port | Notes |
| --- | --- | --- |
| `frontend` | `80` | Nginx serving the built React SPA |
| `backend` | `8080` | Spring Boot |
| `mongodb` | `27017` | Auth-enabled, `mongo_data` volume |
| `zookeeper` | `2181` | Kafka coordination |
| `kafka` | `9092` | Single broker, KRaft-style listener config |

Open <http://localhost>.

> **Caveat:** Compose sets `MONGODB_ENABLED=true` and points `MONGODB_URI` at the `mongodb` service,
> which the backend now reads correctly, so that container will receive data.

Tear down (including data):

```bash
docker compose down -v
```

---

## Authentication & Authorization

Accounts are **real and MongoDB-backed**. There are no hardcoded demo credentials any more.

### Register / sign in

- `POST /api/auth/register` with `{ name, email, password }` (password >= 6 characters) creates a user
  and returns `{ token, email, name, role }`.
- `POST /api/auth/login` with `{ email, password }` returns the same shape.
- Passwords are stored as **BCrypt hashes**; the hash is never returned by any endpoint.
- The returned **JWT** carries the user's role. The SPA stores it and sends it as
  `Authorization: Bearer <token>` on every request (`src/lib/session.ts`, `src/lib/api.ts`).

### Roles

| Role | How it is assigned |
| --- | --- |
| `ROLE_USER` | Default for every account. |
| `ROLE_ADMIN` | Email listed in the `ADMIN_EMAILS` env var (comma-separated, case-insensitive). |

The role is recomputed on every login, so **removing an email from `ADMIN_EMAILS` demotes that user on
their next login**. Roles are never hardcoded in source.

### Ownership

- Each patient has an `owner_email`, taken from the JWT on create and preserved on update.
- A normal user only ever sees and edits **their own** patients; vitals, risk, and lab endpoints are
  scoped the same way. Cross-user access returns **404** so record existence is never revealed.
- Seed patients (no owner) are visible to **admins only**.
- Admins bypass ownership and have a read-only area at `/admin` (users, all patients, all bookings).

### Route guards

`ProtectedRoute` requires a valid session; `AdminRoute` additionally requires `ROLE_ADMIN` and
redirects normal users to `/dashboard`. Any **401/403** from the API clears the stored session and
redirects to `/login`. These guards are UX conveniences layered on top of server-side enforcement.

---

## Project Structure

```
medisphere-cognitive-twin/
├── backend/                        # Spring Boot API (canonical)
│   ├── Dockerfile
│   ├── pom.xml
│   ├── src/main/java/com/medisphere/backend/
│   │   ├── controller/             # Patient, Vital, Risk, LabReport, Auth, Health, FHIR, Booking, Admin
│   │   ├── service/                # Clinical + simulation services (+ Booking, Admin)
│   │   ├── model/                  # JPA/Mongo documents (Patient, User, Booking, …)
│   │   ├── repository/             # Spring Data MongoDB repositories
│   │   ├── security/               # JWT filter + config + ownership enforcement
│   │   ├── kafka/                  # Producer / consumer
│   │   ├── fhir/                   # FHIR + SMART on FHIR client
│   │   ├── audit/                  # Audit logging
│   │   └── exception/              # Global error handling
│   ├── src/main/resources/application.properties
│   └── medisphere-backend/         # ⚠ STALE DUPLICATE — not the canonical backend
│
├── frontend-react/                 # React 19 + Vite SPA (canonical frontend)
│   ├── Dockerfile                  # multi-stage: node:24-alpine → nginx:alpine
│   ├── nginx.conf                  # SPA fallback + /api reverse proxy
│   ├── src/
│   │   ├── components/             # Header, Sidebar, AdminRoute, cards, DigitalTwin, ErrorBoundary…
│   │   ├── pages/                  # Login, Dashboard, Patients, Patient360, Bookings, Admin
│   │   ├── hooks/                  # usePatients, useTelemetry
│   │   ├── lib/                    # api.ts, auth.tsx, session.ts, fallbackData.ts, ui.ts
│   │   ├── services/               # patients.ts, bookings.ts, admin.ts
│   │   ├── App.tsx, main.tsx
│   │   └── index.css
│   └── index.html
│
├── ai/                             # ⚠ Python FedAvg SIMULATION (not a real ML service)
│   ├── service.py                  # stdlib HTTP server, port 5000
│   └── federated_risk_model.py     # FedAvg + rule-based scorer
│
├── ai-service/                     # ⚠ 5 zero-byte placeholder files
├── database/                       # ⚠ 3 zero-byte placeholder files
├── docs/                           # ⚠ 3 zero-byte placeholder files
│
├── infrastructure/kubernetes/      # ⚠ untested manifests
├── docker-compose.yml
└── .env.example
```

---

## API Reference

Base URL: `http://localhost:8080`

Verified from the controller annotations in `backend/src/main/java/com/medisphere/backend/controller`
(28 endpoints across 9 controllers).

**Security:** every endpoint requires a valid JWT (`Authorization: Bearer <token>`) **except**
`/api/auth/**`, which is public. `/api/admin/**` additionally requires `ROLE_ADMIN`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account (returns JWT + role) |
| `POST` | `/api/auth/login` | Sign in (returns JWT + role) |
| `GET` | `/api/health` | Service health |
| `GET` | `/api/health/status` | Detailed runtime status |
| `GET` | `/api/health/audit-logs` | Audit trail |
| `GET` | `/api/patients` | List / filter / search own patients (admin: all) |
| `GET` | `/api/patients/{id}` | Single patient record |
| `GET` | `/api/patients/{id}/360` | Aggregated 360° clinical view |
| `POST` | `/api/patients` | Create patient (owned by caller) |
| `PUT` | `/api/patients/{id}` | Update patient |
| `DELETE` | `/api/patients/{id}` | Soft-delete patient |
| `GET` | `/api/patients/{id}/vitals` | Vital signs history |
| `POST` | `/api/patients/{id}/vitals` | Record a vital reading |
| `POST` | `/api/patients/{id}/vitals/simulate` | Generate a synthetic vital reading |
| `GET` | `/api/patients/{id}/risk` | Current risk assessment |
| `GET` | `/api/patients/{id}/insights` | Risk drivers / insights |
| `GET` | `/api/patients/{id}/labs` | Lab reports |
| `GET` | `/api/patients/{id}/preventive-care` | Preventive care plan |
| `GET` | `/api/bookings` | List own bookings (admin: all) |
| `POST` | `/api/bookings` | Create a booking for an owned patient |
| `DELETE` | `/api/bookings/{id}` | Cancel a booking |
| `GET` | `/api/admin/users` | All users + patient/booking counts |
| `GET` | `/api/admin/users/{email}/details` | A user's patients + bookings |
| `GET` | `/api/admin/patients` | All patients (search / filter) |
| `GET` | `/api/admin/bookings` | All bookings (search / filter) |
| `GET` | `/api/fhir/metadata` | FHIR capability statement |
| `GET` | `/api/fhir/Patient/{id}` | FHIR `Patient` resource |
| `GET` | `/api/fhir/Observation` | FHIR `Observation` resources |

Note the asymmetry: risk insights live at `/insights`, **not** `/risk/insights`.

Spring Boot Actuator also exposes `health`, `info`, and `metrics` at `/actuator/*` per
`application.properties`.

Controllers are annotated with `@CrossOrigin`, so the Vite dev server on `:5173` can call the API on
`:8080` directly.

---

## Configuration

Every environment-specific value is injected via an env var. Copy `.env.example` to `.env` and edit;
the backend loads it automatically when started from the repository root or `backend/`.

```bash
cp .env.example .env
```

For MongoDB Atlas, put the connection string in the root `.env` (not in frontend variables):

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/medisphere?retryWrites=true&w=majority
MONGODB_DATABASE=medisphere
MONGODB_ENABLED=true
DEMO_MODE=false
```

Replace the placeholders with the Atlas database user's credentials, and allow your current IP
address in the Atlas Network Access settings. Keep `.env` private; do not commit it or paste its
credentials into source code.

### Required in production

With `SPRING_PROFILES_ACTIVE=prod`, these have **no default** and the backend refuses to start without
them (`application-prod.properties`):

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Full MongoDB connection string |
| `JWT_SECRET` | HMAC signing key, **minimum 32 bytes** for HS256 |

```bash
openssl rand -base64 48   # generate a JWT secret
```

Missing either one produces a startup failure like `Could not resolve placeholder 'MONGODB_URI'`,
rather than silently starting with a published key.

### Full variable reference

| Variable | Default | Read by | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | `mongodb://localhost:27017/medisphere` | backend | Dev falls back to **local** Mongo, never a remote host |
| `MONGODB_DATABASE` | `medisphere` | backend | |
| `MONGODB_ENABLED` | `false` | backend | Feature flag |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` | backend | In Compose, overridden to `kafka:9092` |
| `KAFKA_CONSUMER_GROUP` | `medisphere-group` | backend | |
| `KAFKA_ENABLED` | `false` | backend | Feature flag; `true` in Compose |
| `DEMO_MODE` | `true` | backend | Forced `false` in the `prod` profile |
| `JWT_SECRET` | dev-only placeholder | backend | **No default in `prod`** |
| `JWT_EXPIRATION_MS` | `86400000` | backend | 24 h |
| `ADMIN_EMAILS` | (empty) | backend | Comma-separated admin allow-list (case-insensitive); grants `ROLE_ADMIN` |
| `SERVER_PORT` | `8080` | backend | |
| `FHIR_CLIENT_ID` | `medisphere-client` | `SmartAuthConfig` | |
| `FHIR_AUTHORIZE_URL` | `http://localhost:8081/oauth/authorize` | `SmartAuthConfig` | |
| `FHIR_TOKEN_URL` | `http://localhost:8081/oauth/token` | `SmartAuthConfig` | |
| `VITE_API_BASE_URL` | dev: `http://localhost:8080/api`, prod: `/api` | frontend | See below |
| `MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD` | `admin` / dev-only | Compose only | Seeds the local Mongo container |

> **Never put a secret in a `VITE_*` variable.** Vite inlines those into the client bundle, so they
> ship to every browser in plaintext.

### Frontend API base URL

`src/lib/api.ts` resolves its base URL at build time:

| Mode | Resolves to | Effect |
| --- | --- | --- |
| `npm run dev` | `http://localhost:8080/api` | Backend on the host |
| production build | `/api` (relative) | nginx proxies to the `backend` container |
| `VITE_API_BASE_URL` set | that value | Wins in both modes |

The production default is relative, so the SPA works behind the reverse proxy in
`frontend-react/nginx.conf` without hardcoding a hostname.

### Keep a Render deployment awake

Render's free web services suspend after 15 minutes without inbound requests. The
`.github/workflows/render-keepalive.yml` workflow pings the Spring Boot `/health` endpoint every
10 minutes from GitHub Actions; a scheduler inside the backend would stop when that backend suspends
and could not wake it.

To enable it:

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and
   add a repository variable named `RENDER_BACKEND_URL` with the service's public base URL, such as
   `https://your-service.onrender.com` (no `/health` suffix).
2. Ensure GitHub Actions is enabled and this workflow is on the repository's default branch.
3. Optionally run **Actions → Keep Render backend awake → Run workflow** to verify the URL.

The workflow fails visibly if the variable is missing or the health request returns an HTTP error.
GitHub scheduled workflows can occasionally start late, so this is a keep-awake workaround rather
than an uptime guarantee.

### Removed variables

`FHIR_BASE_URL`, `FHIR_CLIENT_SECRET`, and `AI_SERVICE_URL` were previously declared in
`.env.example`, `docker-compose.yml`, and `application.properties` but **no code ever read them**
(`FhirService` serves mocked resources and makes no outbound HTTP call; the AI service is not
integrated). They have been removed so the config reflects reality. Reintroduce them when the real
FHIR client and AI integration land — see [Known Issues](#known-issues).

---

## The AI Service

`ai/` contains a **conceptual demonstration** of federated learning. It is honest about this in its
own module docstring, and the README repeats it here so nobody is misled:

- **No TensorFlow. No TensorFlow Federated.** `federated_risk_model.py` imports only `math`,
  `random`, and `typing`. There are no model graphs, no autodiff, and no real optimizer.
- **"Training" is `random.random()`.** `HospitalNode.local_train()` nudges weights with random
  values plus noise. It is a mock of a local training step, not gradient descent.
- **FedAvg aggregation is real arithmetic**, but over randomly perturbed weights.
- **`predict_risk()` never uses the trained weights.** It is a hand-written threshold scorer over
  age, blood pressure, glucose, and heart rate. `global_weights` is computed, stored, and reported
  back — but not referenced by the inference path.
- The `model_architecture` field in the response string says
  `"TensorFlow Federated FedAvg (3 Distributed Hospital Nodes)"`. **This is aspirational text, not a
  description of the code.**
- `confidence` is hardcoded to `0.92`.
- It is **not in `docker-compose.yml`**, **not in the Kubernetes manifests**, and the backend
  **never calls it** (`AI_SERVICE_URL` is unused).

You can run it standalone to see the simulation:

```bash
cd ai
python federated_risk_model.py     # runs one aggregation round + a sample prediction
python service.py                  # serves GET /health and POST /predict/risk on :5000
```

`ai-service/` is a separate, **empty** scaffold (5 zero-byte files) and does nothing.

---

## Kubernetes

`infrastructure/kubernetes/` contains 10 manifests: `backend-deployment.yaml`, `backend-service.yaml`,
`frontend-deployment.yaml`, `frontend-service.yaml`, `mongodb-deployment.yaml`, `mongodb-service.yaml`,
`kafka-deployment.yaml`, `kafka-service.yaml`, `configmap.yaml`, `secret.yaml`.

**These have never been applied or tested.** Before using them:

1. Build and push the images. Both Deployments reference `medisphere/backend:latest` and
   `medisphere/frontend:latest`, which do not exist in any registry.
2. **`medisphere/frontend:latest` is stale** — it predates the React rewrite. Rebuild it from
   `frontend-react/Dockerfile`.
3. **No Zookeeper manifest.** Compose runs `cp-zookeeper:7.5.0`, but the cluster manifests do not
   deploy it, so the Kafka StatefulSet/Deployment has no coordination backend unless it is
   configured for KRaft.
4. `secret.yaml` contains **plaintext credentials** committed to the repository. Replace it with a
   sealed secret, External Secrets Operator, or a managed secret store.

---

## Security Notice

### 1. Resolved: hardcoded credentials are gone

`backend/src/main/resources/application.properties` previously contained a **live MongoDB Atlas
connection string with a real username and password** as a hardcoded literal. Because it was not a
`${MONGODB_URI}` placeholder, it silently overrode the environment variable — which is why the
Docker Compose `mongodb` container never received any data and the backend always dialled Atlas
instead.

This is now fixed:

- The URI is `${MONGODB_URI:...}`, defaulting to **local** MongoDB in development.
- The credential was removed from the working tree **and purged from git history**.
- `infrastructure/kubernetes/secret.yaml` is now a placeholder template, safe to commit.

> **The Atlas password must still be rotated.** It was published to a remote repository, and purging
> history does not un-leak a credential that was pushed. Treat it as compromised, rotate it in the
> Atlas UI, and review access logs. Anyone who cloned the repository before the purge still has it.

### 2. Production has no default secrets

`application-prod.properties` declares `MONGODB_URI` and `JWT_SECRET` with **no fallback value**, so
a production deploy that forgets either one fails at startup rather than running with a published
signing key. Development keeps an obviously-unsafe placeholder so a local run needs no setup.

The `prod` profile is activated by `SPRING_PROFILES_ACTIVE=prod`, which
`infrastructure/kubernetes/configmap.yaml` already set — but the profile file did not exist until
now, so the flag previously did nothing.

### 3. Resolved: authentication is now real

The previous client-side, hardcoded credential check has been replaced with server-enforced auth:

- `src/lib/auth.tsx` now calls `POST /api/auth/register` / `POST /api/auth/login` and stores the
  returned JWT and user (`src/lib/session.ts`).
- `src/lib/api.ts` attaches `Authorization: Bearer <token>` to every request and clears the session +
  redirects to `/login` on **401/403**.
- The backend derives the user and role from the JWT and enforces access on **every** endpoint
  (`/api/auth/**` is public; `/api/admin/**` requires `ROLE_ADMIN`), so `ProtectedRoute` / `AdminRoute`
  are UX guards on top of real server-side enforcement, not the security boundary.

Role membership is driven by `ADMIN_EMAILS`; curate that list to control admin access. `@CrossOrigin`
is still broad — tighten it before any real deployment.

### 4. Remaining gaps

- `secret.yaml` is a template; real credentials must come from a secret manager (Sealed Secrets,
  External Secrets Operator, or your orchestrator's native store).
- No rate limiting, no TLS termination, no input-hardening review.
- MongoDB is exposed on `27017` and Kafka on `9092` in Compose with no authentication beyond
  Mongo's root user.
- The `.env` file is gitignored, but `.env.example` and the manifests are not.

---

## Known Issues

| # | Issue | Impact |
| --- | --- | --- |
| ~~1~~ | ~~Hardcoded Atlas credentials~~ | **Fixed** — externalized to `MONGODB_URI`, purged from history. Rotate the Atlas password regardless. |
| ~~2~~ | ~~`MONGODB_URI` / `MONGODB_DATABASE` / `AI_SERVICE_URL` never read~~ | **Fixed** — the first two now resolve; the inert third was removed. |
| ~~3~~ | ~~React hardcodes `http://localhost:8080/api`~~ | **Fixed** — resolved via `VITE_API_BASE_URL`, relative `/api` in production. |
| 4 | Kafka advertises `localhost:29092` but only `9092` is published | Host-side tools get unusable broker metadata. In-container clients (the backend) are fine. |
| 5 | No Kafka topics provisioned | `KAFKA_ENABLED=true` in Compose with no topic bootstrap |
| 6 | K8s images never built; `medisphere/frontend:latest` is pre-React | Cluster manifests will not pull |
| 7 | No Zookeeper manifest for the Kafka workload | Kafka has no coordination backend in-cluster |
| 8 | `ai/` claims TFF but is stdlib simulation | Documentation would overstate the AI capability |
| 9 | 11 tracked zero-byte files in `ai-service/`, `database/`, `docs/` | Placeholders that look like real deliverables |
| 10 | No frontend test suite | `npm run build` and `npm run lint` are the only gates |
| 11 | Stale duplicate backend at `backend/medisphere-backend/` | Risk of editing the wrong tree |
| 12 | No CI/CD | Nothing prevents these from regressing |
| 13 | FHIR client is mocked; no real FHIR server exists | `FHIR_BASE_URL` was removed because nothing read it. The `/api/fhir/*` endpoints serve static data. |
| 14 | Kafka consumer double-writes vitals | `VitalController` saves to Mongo *and* publishes, then the consumer saves the same record again |
| ~~15~~ | ~~Hardcoded demo auth + client-only `ProtectedRoute`~~ | **Fixed** — real MongoDB auth with JWT, roles, ownership, and server-side enforcement; `AdminRoute` guards the admin area. |

**A prior white-page crash** — where a Mongo record with `name: null` made `getInitials()` call
`.trim()` on `null` and blank the whole SPA — is fixed. `src/lib/ui.ts` is now null-safe and
`src/services/patients.ts` drops malformed records. There is also an `ErrorBoundary` in
`src/components/ErrorBoundary.tsx` so one bad record cannot blank the app again.

---

## Development

### Frontend commands

```bash
npm run dev        # Vite dev server on :5173
npm run build      # type-check + production build
npm run lint       # oxlint
npm run preview    # serve the production build
```

`npm run lint` currently reports non-blocking warnings (`react-hooks/set-state-in-effect`, purity
checks on `Date.now()`, and `react-refresh` export-shape notes).

### Backend commands

```bash
mvn spring-boot:run      # run
mvn clean package        # build → target/backend-1.0.0-SNAPSHOT.jar
mvn test                 # tests
```

### Running the stack locally (verified)

Run the two commands below in separate terminals, from the **repository root**:

```bash
# Terminal 1 — backend (loads the root .env, see Quick Start)
mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.workingDirectory=$(pwd)

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

Smoke-test both (all three should succeed):

```bash
curl http://localhost:8080/api/health/status          # → {"status":"UP",...,"mongodb":"ONLINE"}
curl http://localhost:5173/                           # → 200, <title>Medisphere Cognitive Twin</title>
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"localtest@example.com","password":"secret123"}'   # → 200 + JWT
```

### Conventions

- TypeScript strict mode; components under `frontend-react/src/components`.
- API access goes through `src/lib/api.ts`; never call `fetch` directly from a component.
- New data should be added to `src/lib/fallbackData.ts` so the UI stays usable offline.
- Controllers live in `backend/src/main/java/com/medisphere/backend/controller` — **not** in the
  stale `backend/medisphere-backend/` copy.

---

## License

No license has been declared. Add one before publishing.

## Acknowledgements

Synthetic patient data throughout. The federated-learning module is a teaching simulation, not a
clinical model.
