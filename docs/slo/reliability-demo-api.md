# Reliability Demo API SLO / SLI

## Service

```text
Service: Reliability Demo API
Status: active MVP
Production base URL: https://sre-lab-api.daisan-tanaka.workers.dev
```

## Production endpoints

| Endpoint | Expected status | Purpose |
|---|---:|---|
| `GET /api/health` | 200 | Primary health / uptime SLI |
| `GET /api/status` | 200 | Service inventory and active-state check |
| `GET /api/fallback` | 200 | Degraded-but-available fallback demo |
| `GET /api/slow?delayMs=1000` | 200 | Controlled latency demo |
| `GET /api/error` | 500 | Intentional 5xx demo; not an availability SLI target |

## SLIs

### Availability SLI

```text
Good events: GET /api/health returns HTTP 200
Total events: all synthetic checks to GET /api/health
```

### Latency SLI

```text
Good events: GET /api/health completes within the latency threshold
Total events: all successful GET /api/health checks
Initial threshold: p95 < 1000 ms
```

### Error-rate SLI

```text
Good events: GET /api/health does not return 5xx
Total events: all GET /api/health checks
```

Do not include `GET /api/error` in production availability calculations because it is intentionally unhealthy for demonstration.

## Initial SLOs

| SLO | Target | Window | Notes |
|---|---:|---|---|
| Availability | 99.0% | 30 days | Based on `GET /api/health` synthetic checks |
| Latency | p95 < 1000 ms | 30 days | Based on `GET /api/health`, not `/api/slow` |
| Error rate | 5xx < 1.0% | 30 days | Excludes intentional `/api/error` demo calls |

## Error budget policy

| State | Action |
|---|---|
| Healthy | Continue normal work |
| 50% consumed | Review recent changes |
| 75% consumed | Prioritize reliability fixes |
| 100% consumed or SLO missed | Create incident or postmortem follow-up |

## Alert candidates

```text
- /api/health returns non-200 for consecutive checks
- /api/health latency exceeds threshold for consecutive checks
- Deploy Worker workflow fails
- Smoke test fails after deployment
```

Do not alert on manual `/api/error` calls because that endpoint is intentionally unhealthy.

## Related docs

```text
docs/runbook.md
docs/incidents/
docs/postmortems/template.md
```

## Current maturity

```text
Maturity: MVP / documentation-backed SLO
Next improvement: connect Grafana Synthetic Monitoring directly to /api/health and /api/status if not already configured.
```