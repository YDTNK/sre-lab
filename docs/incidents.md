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

---

### 20260614-002

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / deployment check

### Summary

Worker auto deployment through GitHub Actions was configured and verified successfully.

### Impact

No user-facing incident occurred.

This record documents the successful setup of the Workers API deployment pipeline.

### Detection

Manual verification after GitHub Actions workflow execution.

### Initial Checks

- Deploy Worker workflow was created
- GitHub Secrets were configured
- API dependencies were installed in GitHub Actions
- API syntax check passed
- Wrangler deploy completed successfully
- Deploy Worker job succeeded
- Cloudflare Workers API remained available after deployment

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | GitHub Secrets for Cloudflare were configured |
| 2026-06-14 | Deploy Worker workflow was added |
| 2026-06-14 | Deploy Worker workflow ran successfully |
| 2026-06-14 | Workers API auto deployment was verified |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Workers API deployment was validated through the successful GitHub Actions Deploy Worker workflow.

### Prevention / Follow-up Actions

- [ ] Continue monitoring Workers API after deployments
- [ ] Review GitHub Actions warnings related to Node.js runtime migration
- [ ] Add deployment status badge to README
- [ ] Add real AI API integration after rate limiting and cost control are designed

---

### 20260614-003

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / API safety check

### Summary

Workers API safety hardening was implemented and verified successfully.

### Impact

No user-facing incident occurred.

This record documents the successful implementation and validation of request safety controls before real AI API integration.

### Detection

Manual verification after deployment.

### Initial Checks

- Standardized JSON error response was implemented
- Method validation was verified
- Path validation was verified
- JSON parse error handling was verified
- Content-Type validation was verified
- Request size limit was implemented
- Total input length limit was implemented
- Existing mock response behavior was preserved
- Production API curl tests were completed

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Valid POST | 200 | Passed |
| Empty JSON body | 400 / missing_input | Passed |
| Invalid JSON | 400 / invalid_json | Passed |
| Unsupported method | 405 / method_not_allowed | Passed |
| Unknown path | 404 / not_found | Passed |
| Missing JSON Content-Type | 415 / unsupported_media_type | Passed |
| Input too large | 413 / input_too_large | Passed |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Workers API validation logic was hardened |
| 2026-06-14 | GitHub commit was pushed to main |
| 2026-06-14 | Production API safety curl tests were completed |
| 2026-06-14 | API safety verification was documented |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Production API returned expected responses for valid requests and invalid request patterns.

### Prevention / Follow-up Actions

- [ ] Add rate limiting before real AI API integration
- [ ] Add AI API timeout handling
- [ ] Add fallback response for AI API failures
- [ ] Add usage tracking
- [ ] Add estimated cost tracking
- [ ] Add cost incident runbook

---

### 20260614-004

### Service

SRE Lab Workers API

### Alert Rule

Manual design record / API safety planning

### Summary

Rate limiting design was defined before real AI API integration.

### Impact

No user-facing incident occurred.

This record documents the planned rate limiting approach to reduce abuse and prevent unexpected AI API cost spikes.

### Detection

Manual design review.

### Initial Checks

- API safety hardening was already implemented
- Standardized error response format was already implemented
- Request size limit was already implemented
- Total input length limit was already implemented
- Real AI API integration has not started yet
- Rate limiting is required before connecting a paid AI API

### Design Decision

- Rate limiting storage: Cloudflare KV
- Target endpoint: POST /api/moving-assistant
- Initial minute limit: 10 requests / minute / client IP
- Initial daily limit: 50 requests / day / client IP
- Limit exceeded response: 429 Too Many Requests
- Error code: rate_limited
- Retry header: Retry-After: 60

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Rate limiting requirement was identified |
| 2026-06-14 | Cloudflare KV was selected as the initial implementation approach |
| 2026-06-14 | Initial limits were defined |
| 2026-06-14 | Rate limiting design was documented |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a design and planning record.

### Prevention / Follow-up Actions

- [ ] Create Cloudflare KV namespace for rate limiting
- [ ] Bind KV namespace to the Workers API
- [ ] Implement IP-based minute and daily counters
- [ ] Return 429 / rate_limited when limits are exceeded
- [ ] Add Retry-After: 60 header
- [ ] Verify production behavior with curl
- [ ] Confirm Grafana API check remains healthy
- [ ] Add usage and cost tracking before real AI API integration

---

### 20260614-005

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / rate limiting check

### Summary

KV-based rate limiting was implemented and verified successfully for the Workers API.

### Impact

No user-facing incident occurred.

This record documents the successful implementation and production verification of IP-based rate limiting before real AI API integration.

### Detection

Manual verification after GitHub Actions deployment.

### Initial Checks

- Cloudflare KV namespace was created
- RATE_LIMIT_KV binding was added to wrangler.toml
- Workers API was updated with KV-based rate limiting
- Cloudflare API Token permissions were updated to include Workers KV Storage edit access
- Deploy Worker workflow was re-run successfully
- Production API rate limit test was completed

### Implementation Details

- Storage: Cloudflare KV
- Binding: RATE_LIMIT_KV
- Target endpoint: POST /api/moving-assistant
- Minute limit: 10 requests / minute / client IP
- Daily limit: 50 requests / day / client IP
- Rate limit exceeded status: 429 Too Many Requests
- Error code: rate_limited
- Retry header: Retry-After: 60

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Requests 1-10 | 200 | Passed |
| Request 11 | 429 / rate_limited | Passed |
| Request 12 | 429 / rate_limited | Passed |
| Retry-After header | Retry-After: 60 | Passed |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Cloudflare KV namespace was created |
| 2026-06-14 | RATE_LIMIT_KV binding was added to wrangler.toml |
| 2026-06-14 | KV-based rate limiting was implemented |
| 2026-06-14 | Deploy Worker initially failed due to missing KV token permission |
| 2026-06-14 | Cloudflare API Token was updated with Workers KV Storage edit permission |
| 2026-06-14 | Deploy Worker was re-run successfully |
| 2026-06-14 | Production rate limit behavior was verified |

### Root Cause

No user-facing incident occurred.

The deployment initially failed because the GitHub Actions Cloudflare API Token did not have Workers KV Storage edit permission required for KV bindings.

### Mitigation

A new Cloudflare API Token with Workers KV Storage edit permission was created and saved as the GitHub Actions secret CLOUDFLARE_API_TOKEN.

### Recovery Validation

Deploy Worker workflow completed successfully after updating the Cloudflare API Token.

Production API returned HTTP 200 for the first 10 requests and HTTP 429 / rate_limited with Retry-After: 60 from the 11th request.

### Prevention / Follow-up Actions

- [ ] Continue monitoring Grafana API check after rate limiting deployment
- [ ] Confirm valid API requests recover after the 1-minute rate limit window
- [ ] Add usage tracking before real AI API integration
- [ ] Add estimated cost tracking before real AI API integration
- [ ] Add cost incident runbook
- [ ] Review rate limit values after real usage data is available

---

### 20260614-006

### Service

SRE Lab Workers API

### Alert Rule

Manual design record / usage and cost planning

### Summary

Usage and cost tracking design was defined before real AI API integration.

### Impact

No user-facing incident occurred.

This record documents the planned approach for usage counting, estimated AI API cost tracking, and cost threshold control before connecting a paid AI API.

### Detection

Manual design review.

### Initial Checks

- API safety hardening was completed
- KV-based rate limiting was implemented and verified
- Real AI API integration has not started yet
- Usage and cost tracking is required before connecting a paid AI API
- Cost control is required because SRE Lab is not monetized yet

### Design Decision

- Initial storage: Cloudflare KV
- Future storage option: Cloudflare D1 or another database
- Monthly budget: 500 JPY
- Monthly warning threshold: 300 JPY
- Monthly stop threshold: 500 JPY
- Daily soft limit: 50 JPY
- Daily hard limit: 100 JPY
- Cost limit response: 503 / cost_limit_reached

### Planned Metrics

- API request count
- API success count
- API error count
- Rate limited request count
- AI API call count
- AI API success count
- AI API error count
- Estimated input tokens
- Estimated output tokens
- Estimated cost in JPY

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Usage and cost tracking requirement was identified |
| 2026-06-14 | Cloudflare KV was selected as the initial tracking storage |
| 2026-06-14 | Initial monthly budget and thresholds were defined |
| 2026-06-14 | Cost limit response design was documented |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a design and planning record.

### Prevention / Follow-up Actions

- [ ] Add usage counter logic
- [ ] Add estimated token tracking
- [ ] Add estimated cost tracking
- [ ] Add monthly cost threshold check
- [ ] Add cost_limit_reached response
- [ ] Add docs/cost.md
- [ ] Verify AI API calls are blocked after the stop threshold
- [ ] Review thresholds after real usage data is available

