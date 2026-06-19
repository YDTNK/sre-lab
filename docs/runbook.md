# Runbook Index

This file is the active runbook index for SRE Lab.

The previous aggregate runbook mixed current Reliability Demo API operations with legacy service context. It has been archived under:

```text
docs/archive/legacy-revenue-route/runbook.md
```

## Current active runbook

Use this file as the source of truth for Reliability Demo API response procedures:

```text
docs/runbooks/reliability-demo-api.md
```

## Current active service

```text
Service: Reliability Demo API
State: implemented / active portfolio demonstration service
Primary health endpoint: GET /api/health
Status endpoint: GET /api/status
```

## Current endpoint expectations

| Endpoint | Expected result | Operational purpose |
|---|---:|---|
| `GET /api/health` | 200 | Primary health and uptime target |
| `GET /api/status` | 200 | Active service state and endpoint inventory |
| `GET /api/slow?delayMs=1000` | 200 | Controlled latency demonstration |
| `GET /api/error` | 500 | Intentional error demonstration |
| `GET /api/fallback` | 200 | Deterministic fallback demonstration |

`/api/error` intentionally returns 500. Do not treat a manual request to that endpoint as a real incident by itself.

## Service State Gate

Before restoring an endpoint, page, monitor, or alert target, confirm whether the target is still active.

Check:

```text
README.md
docs/services.md
docs/service-state-checklist.md
docs/runbooks/reliability-demo-api.md
docs/incidents/
apps/api/src/index.js
apps/landing/
```

If a target is historical, removed, stopped, or unknown, do not restore it by default.

## Incident record policy

For new operational records, prefer one file per record under:

```text
docs/incidents/
```

Avoid recreating a large aggregate incident log.

## Historical context

Legacy service or revenue-route content should be treated as historical only unless the management-side `status.md` explicitly reactivates it.
