# Incident Log

This document records incidents, alerts, investigations, mitigations, and reliability improvements for SRE Lab.

## Incident Template

### Incident ID

YYYYMMDD-001

### Service

Examples:

- Landing Page
- AI Moving Assistant API
- Cloudflare Pages
- Cloudflare Workers

### Alert Rule

Examples:

- sre-lab-uptime-down
- sre-lab-api-down
- Manual detection

### Summary

Briefly describe what happened.

### Impact

Describe the user-facing impact.

Examples:

- Landing page unavailable
- AI Moving Assistant diagnosis failed
- Slow response time
- Monitoring false positive
- Deployment failure

### Detection

How was the issue detected?

Examples:

- Grafana alert
- Manual check
- Cloudflare deployment failure
- GitHub Actions failure

### Initial Checks

Record the first checks performed.

Examples:

- Grafana check result
- Browser access result
- curl result
- HTTP status code
- Cloudflare Pages deployment status
- Cloudflare Workers deployment status
- Recent GitHub commits

### Timeline

| Time | Event |
|---|---|
| YYYY-MM-DD HH:MM | Alert fired |
| YYYY-MM-DD HH:MM | Investigation started |
| YYYY-MM-DD HH:MM | Root cause identified |
| YYYY-MM-DD HH:MM | Mitigation completed |
| YYYY-MM-DD HH:MM | Service recovered |

### Root Cause

Describe the technical cause.

### Mitigation

Describe what was done to restore the service.

### Recovery Validation

Record how recovery was confirmed.

Examples:

- Grafana alert returned to normal
- Browser access succeeded
- curl returned HTTP 200
- Frontend displayed API response
- GitHub Actions passed

### Prevention / Follow-up Actions

List improvements to prevent recurrence.

- [ ] Add monitoring
- [ ] Update runbook
- [ ] Improve CI check
- [ ] Add alert tuning
- [ ] Improve error handling

---

## Incidents

No incidents recorded yet.
