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

### 20260623-001

### Service

Landing Page / Moving Prep Board release candidate

### Alert Rule

Manual preview review

### Summary

During Moving Prep Board release-candidate work, the landing page preview temporarily regressed to browser-default HTML styling because the landing stylesheet was accidentally reduced to a placeholder-only file.

### Impact

Production was not intentionally changed as part of this record, and PRs remained Draft.

The affected preview rendered without the expected service styling:

- Header styling lost
- Buttons lost
- Cards lost
- Spacing lost
- Form layout lost
- Overall LP visual structure collapsed

### Detection

Manual preview review by the user.

### Initial Checks

- User reported that the preview was a major visual regression.
- Repository inspection identified `apps/landing/styles.css` as the affected file.
- `styles.css` had been reduced to a placeholder-only file.

### Timeline

| Time | Event |
|---|---|
| 2026-06-23 | Moving Prep Board release-candidate preview was reviewed |
| 2026-06-23 | Browser-default rendering was reported by the user |
| 2026-06-23 | `apps/landing/styles.css` placeholder-only regression was identified |
| 2026-06-23 | Landing page CSS was restored |
| 2026-06-23 | User confirmed the styled layout had returned |
| 2026-06-23 | Image implementation was split into a separate Draft PR |

### Root Cause

`apps/landing/styles.css` was accidentally replaced with only:

```css
/* Placeholder intentionally not applied */
```

This removed the stylesheet rules required for the landing page layout, causing the browser to render the page with default HTML styling.

### Mitigation

- Restored `apps/landing/styles.css` to the stable landing page stylesheet.
- Stopped image insertion work in PR #6.
- Re-scoped PR #6 as the stable layout / copy / UX baseline.
- Created a separate image-only Draft PR (#59) so image work does not destabilize the layout baseline.
- Added a dedicated image stylesheet in the image PR instead of modifying the main stylesheet directly.

### Recovery Validation

- User confirmed that the preview returned from browser-default rendering to the styled layout.
- PR #6 remains Draft and should not be merged until full preview review and validation are completed.

### Prevention / Follow-up Actions

- [ ] Avoid replacing the entire main stylesheet for visual-only changes.
- [ ] Prefer dedicated, minimal CSS files for isolated image experiments.
- [ ] Keep visual/image work in a separate PR from layout/copy baseline work.
- [ ] Re-check preview URL after every layout or CSS change.
- [ ] Keep PRs Draft until human visual review is complete.

---

### 20260614-001

### Service

SRE Lab Platform

### Alert Rule

Manual detection / readiness check

### Summary

Initial production readiness check was completed for SRE Lab.

### Impact

No user-facing incident occurred.

The purpose of this record is to document the initial operational readiness of the service.

### Detection

Manual check.

### Initial Checks

- Cloudflare Pages frontend was deployed
- Cloudflare Workers API was deployed
- Frontend successfully called the production Workers API
- Grafana Synthetic Monitoring was configured for the landing page
- Grafana Synthetic Monitoring was configured for the API
- Alert rule was configured for the landing page
- Alert rule was configured for the API
- Email contact point was configured
- Runbook was updated
- Operations guide was updated
- Architecture document was updated with Mermaid diagrams
- GitHub Actions CI includes API syntax check

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Frontend and API deployment confirmed |
| 2026-06-14 | Landing page monitoring and alerting configured |
| 2026-06-14 | API monitoring and alerting configured |
| 2026-06-14 | Runbook, incident log, operations guide, and architecture docs updated |
| 2026-06-14 | GitHub Actions CI updated with API syntax check |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Operational readiness was confirmed through deployment checks, API curl tests, Grafana synthetic checks, alert rule configuration, and documentation updates.

### Prevention / Follow-up Actions

- [ ] Continue monitoring landing page and API
- [ ] Review alert behavior after enough monitoring data is collected
- [ ] Add Worker auto-deploy via GitHub Actions
- [ ] Add real AI API integration after cost and error handling are designed
- [ ] Add rate limiting before wider public release
