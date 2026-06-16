# Service State Checklist

Use this checklist before responding to endpoint alerts, 404 responses, missing pages, or stale monitors.

The purpose is to prevent restoring a removed or deprecated service by mistake.

## Required Decision

Before mitigation, classify the target service or endpoint as one of the following:

| State | Meaning | Correct Action |
|---|---|---|
| active | Current production service or endpoint | Investigate and restore if broken |
| degraded | Active service with partial failure | Mitigate and monitor |
| deprecated | Still present but planned for removal | Confirm expected behavior before restoring |
| removed | Intentionally removed from active service portfolio | Do not restore by default; remove stale monitor or navigation |
| replaced | Superseded by another endpoint/page/service | Redirect, update monitor, or remove stale references |
| unknown | State cannot be confirmed from docs/code | Stop and verify before changing production |

## Mandatory Sources to Check

Check these documents before restoring an endpoint or page:

1. `README.md`
2. `docs/services.md`
3. `docs/operations.md`
4. `docs/runbook.md`
5. Latest files under `docs/incidents/`
6. `apps/api/src/index.js` for active API routes
7. `apps/landing/` for active frontend pages
8. Grafana Synthetic Monitoring target list

## 404 Alert Decision Flow

```text
Alert fires or endpoint returns 404
↓
Check docs/services.md
↓
Is the service active?
├─ yes → investigate deployment, route, code, Cloudflare, and recent commits
├─ no, removed/deprecated/replaced → do not restore by default
└─ unknown → verify service intent before production changes
```

## Removed Service Handling

If the target is a removed service:

- Do not redeploy or recreate the endpoint just to satisfy an old monitor.
- Disable or remove stale Grafana Synthetic Monitoring checks.
- Remove or update stale alert rules.
- Remove stale frontend navigation links.
- Keep historical documentation, but mark it as removed.
- Record the finding under `docs/incidents/` if an alert fired.

## Documentation Update Rule

For new operational records, prefer one file per incident:

```text
docs/incidents/YYYYMMDD-NNN-short-description.md
```

Avoid directly rewriting the large aggregate file:

```text
docs/incidents.md
```

Only update `docs/incidents.md` when the full current content is safely loaded and the change is small and verified.

## AWS Cost Simulator Example

AWS Cost Simulator is currently classified as:

```text
removed
```

Therefore, an alert for `/api/aws-cost-simulator` should be treated first as a possible stale monitor / service-state mismatch.

Correct first response:

```text
Check whether the monitor should still exist before restoring the API route.
```

Not the default first response:

```text
Redeploy or recreate the API route.
```
