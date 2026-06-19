# Reliability Demo API Runbook

## Purpose

Runbook for Reliability Demo API production checks and incident response.

## Active targets

```text
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/health
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/status
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/fallback
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/slow?delayMs=1000
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/error
```

## Expected responses

| Endpoint | Expected status | Notes |
|---|---:|---|
| `/api/health` | 200 | Primary uptime check |
| `/api/status` | 200 | Service inventory |
| `/api/fallback` | 200 | Expected degraded/fallback demo |
| `/api/slow?delayMs=1000` | 200 | Controlled latency |
| `/api/error` | 500 | Intentional demo error |

`/api/error` returning 500 is expected. Do not treat a manual request to this endpoint as an incident by itself.

## Health failure response

1. Confirm Reliability Demo API is still active in `docs/services.md`.
2. Test `/api/health` and `/api/status` with curl.
3. Check the latest Deploy Worker workflow.
4. Check recent changes to `apps/api/src/index.js`.
5. Run `bash scripts/smoke-test.sh` from a local environment that can resolve the Worker domain.
6. If a recent deployment caused the failure, revert or redeploy the previous working Worker version.
7. Record an incident under `docs/incidents/` if there was monitor-visible or user-visible impact.

## Latency investigation

1. Confirm the requested `delayMs` value.
2. Verify the response reports `delayMs` no greater than 5000.
3. Compare `/api/health` latency with `/api/slow` latency.
4. If `/api/health` is also slow, investigate Cloudflare Worker or network conditions.
5. If only `/api/slow` is slow within the requested delay, treat it as expected demo behavior.

## Fallback behavior

`/api/fallback` intentionally returns HTTP 200 with fallback mode active.

Use it to demonstrate graceful degradation without creating a real dependency outage.

## SLO reference

```text
docs/slo/reliability-demo-api.md
```

## Postmortem reference

```text
docs/postmortems/template.md
```