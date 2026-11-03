# Pulse-path Backend

Local NestJS REST foundation for the Pulse-path PoC. The service binds to `127.0.0.1` and does not require a database, provider API, hosted service, or paid infrastructure.

## Setup

From the repository root, install the shared npm workspace lockfile:

```powershell
npm ci
```

Copy `backend/.env.example` to `backend/.env` if local overrides are needed. Configuration accepts `PORT`, `CORS_ORIGINS` (comma-separated explicit HTTP or HTTPS origins), `THROTTLE_LIMIT`, and `THROTTLE_TTL_MS`. Defaults are port `3001`, origin `http://localhost:3000`, and 60 requests per 60 seconds. Wildcard origins, paths, malformed ports, and non-positive limits are rejected.

## Commands

Run from the repository root:

```powershell
npm run start:dev --workspace @pulse-path/backend
npm run typecheck --workspace @pulse-path/backend
npm run lint --workspace @pulse-path/backend
npm test --workspace @pulse-path/backend
npm run test:e2e --workspace @pulse-path/backend
npm run build --workspace @pulse-path/backend
npm run openapi:check --workspace @pulse-path/backend
```

Local Swagger UI is available at `http://127.0.0.1:3001/docs`; the OpenAPI JSON is at `http://127.0.0.1:3001/openapi.json`. `/api/v1` is the shared client API prefix. This foundation adds no product resource endpoints; the test-only controller and synthetic DTO are registered only in the local test module and do not ship in the production module.

Request validation rejects malformed and undeclared fields. Error responses use the shared safe body and omit rejected values and internal exception details. Throttling uses in-memory storage in this single process and is a local PoC policy, not a distributed or production rate limiter.
