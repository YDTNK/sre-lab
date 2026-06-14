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

---

### 20260614-007

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / usage and cost tracking check

### Summary

Usage and cost tracking foundation was implemented and verified for the Workers API.

### Impact

No user-facing incident occurred.

This record documents the successful implementation and production verification of Cloudflare KV based usage tracking before real AI API integration.

### Detection

Manual verification after GitHub Actions deployment.

### Initial Checks

- Usage and cost tracking design was documented
- Cloudflare KV based rate limiting was already implemented
- The Workers API was updated with usage tracking counters
- The mock response behavior was preserved
- Real AI API integration has not started yet

### Implementation Details

- Storage: Cloudflare KV
- Binding: RATE_LIMIT_KV
- Target endpoint: POST /api/moving-assistant
- API request counter: usage:moving-assistant:api_requests:{yyyyMMdd}
- API success counter: usage:moving-assistant:api_success:{yyyyMMdd}
- API error counter: usage:moving-assistant:api_errors:{yyyyMMdd}
- Rate limited counter: usage:moving-assistant:rate_limited:{yyyyMMdd}
- Cost key foundation: cost:moving-assistant:estimated_jpy:{yyyyMMdd}
- Monthly cost key foundation: cost:moving-assistant:estimated_jpy:{yyyyMM}
- Monthly stop threshold foundation: 500 JPY
- Current mock estimated cost: 0 JPY

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Deploy Worker | Success | Passed |
| CI | Success | Passed |
| Valid POST | 200 | Passed |
| Rate limited requests | 429 / rate_limited | Passed |
| api_requests key | Numeric value | Passed |
| api_success key | Numeric value | Passed |
| rate_limited key | Numeric value | Passed |
| api_errors key | Numeric value | Passed |

### Observed KV Values

| Key | Value |
|---|---:|
| usage:moving-assistant:api_requests:20260614 | 13 |
| usage:moving-assistant:api_success:20260614 | 10 |
| usage:moving-assistant:rate_limited:20260614 | 3 |
| usage:moving-assistant:api_errors:20260614 | 7 |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | Usage and cost tracking foundation was implemented |
| 2026-06-14 | Changes were pushed to main |
| 2026-06-14 | CI workflow completed successfully |
| 2026-06-14 | Deploy Worker workflow completed successfully |
| 2026-06-14 | Production API returned expected 200 response |
| 2026-06-14 | Rate limiting behavior remained functional |
| 2026-06-14 | Usage tracking KV values were verified |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Production API behavior remained healthy after usage tracking was added.

The Workers API returned 200 for valid requests and 429 / rate_limited for requests exceeding the configured minute limit.

Cloudflare KV stored usage counters as expected.

### Prevention / Follow-up Actions

- [ ] Add estimated AI token tracking after real AI API integration
- [ ] Add estimated AI API cost calculation after model selection
- [ ] Add cost_limit_reached test case
- [ ] Add docs/cost.md
- [ ] Review usage and cost values during initial AI rollout
- [ ] Consider moving historical usage records to D1 if reporting requirements grow

---

### 20260614-008

### Service

SRE Lab Workers API

### Alert Rule

Manual design record / real AI API integration strategy

### Summary

The initial real AI API integration provider and model strategy were defined.

### Impact

No user-facing incident occurred.

This record documents the decision to use OpenAI API for the first AI Moving Assistant integration while reserving Claude API for future infrastructure-focused services.

### Detection

Manual design review before real AI API integration.

### Initial Checks

- Workers API safety hardening was completed
- KV-based rate limiting was implemented and verified
- Usage and cost tracking foundation was implemented and verified
- Real AI API integration has not started yet
- AI provider and model strategy must be decided before implementation

### Design Decision

- Initial provider: OpenAI API
- Initial model class: low-cost mini/nano model
- Claude API: reserved for future Terraform Review AI and AI Incident Summarizer
- API key location: Cloudflare Workers Secret
- Planned secret name: OPENAI_API_KEY
- Planned model config: AI_MODEL
- Monthly budget: 500 JPY
- Monthly warning threshold: 300 JPY
- Monthly stop threshold: 500 JPY
- Service AI diagnoses per day: 20-50
- AI diagnoses per IP per day: 5
- Timeout: 8 seconds
- Fallback response: required
- AI response validation: required
- Estimated cost tracking: required

### Rationale

AI Moving Assistant requires short, structured Japanese JSON responses.

The initial goal is safe AI integration under a small monthly budget, not maximum reasoning quality.

OpenAI API was selected for the first integration because it is suitable for low-cost structured JSON generation and simple Cloudflare Workers integration.

Claude API remains a strong future candidate for longer and more complex services, especially Terraform Review AI and AI Incident Summarizer.

### Planned Safety Controls

- API key must not be exposed to frontend
- AI call must happen only inside Cloudflare Workers
- Existing API validation must remain active
- Existing KV-based rate limiting must remain active
- AI-specific daily limits must be added
- Timeout handling must be added
- Fallback response must be added
- AI response validation must be added
- Estimated token and cost tracking must be added
- Monthly cost stop threshold must block AI calls

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | OpenAI API was selected as the first AI provider |
| 2026-06-14 | Claude API was reserved for future infrastructure-focused services |
| 2026-06-14 | Monthly AI budget and limits were confirmed |
| 2026-06-14 | Timeout, fallback, and response validation were defined as required controls |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a design and planning record.

### Prevention / Follow-up Actions

- [ ] Add OPENAI_API_KEY as a Cloudflare Workers Secret
- [ ] Add AI_MODEL configuration
- [ ] Implement OpenAI API call from Worker
- [ ] Add AI API timeout handling
- [ ] Add fallback response
- [ ] Add AI response validation
- [ ] Add AI daily usage limits
- [ ] Add estimated token tracking
- [ ] Add estimated cost calculation
- [ ] Verify production behavior after deployment

---

### 20260614-009

### Service

SRE Lab Workers API

### Alert Rule

Manual configuration record / OpenAI secret and model setup

### Summary

OpenAI API secret and model configuration preparation was completed before implementation.

### Impact

No user-facing incident occurred.

This record documents the preparation of Cloudflare Workers Secret management and model configuration for the first real AI API integration.

### Detection

Manual configuration review before OpenAI API implementation.

### Initial Checks

- Real AI API integration strategy was documented
- OpenAI API was selected as the first provider
- Claude API was reserved for future infrastructure-focused services
- Usage and cost tracking foundation was implemented
- OPENAI_API_KEY was registered as a Cloudflare Workers Secret
- Secret handling must be prepared before code implementation

### Configuration Decision

- Secret name: OPENAI_API_KEY
- Secret location: Cloudflare Workers Secret
- Model variable: AI_MODEL
- Initial model value: gpt-4.1-nano
- Frontend API key exposure: prohibited
- Repository API key storage: prohibited
- Missing secret behavior: fallback/mock response
- Secret rotation runbook: required

### Setup Command

```bash
cd apps/api
npx wrangler secret put OPENAI_API_KEY
```

### Safety Controls

- API key must not be pasted into chat logs
- API key must not be committed to GitHub
- API key must not be placed in frontend JavaScript
- OpenAI API must be called only from Cloudflare Workers
- AI_MODEL may be stored in wrangler.toml because it is not secret
- Worker must safely fallback if OPENAI_API_KEY is missing

### Verification Results

| Case | Expected | Result |
|---|---|---|
| OPENAI_API_KEY secret registration | Success | Passed |
| AI_MODEL configuration | Present in wrangler.toml | Pending |
| API key in repository | Not present | Pending |
| CI | Success | Pending |
| Deploy Worker | Success | Pending |
| Existing mock API behavior | Preserved | Pending |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | OPENAI_API_KEY was registered as a Cloudflare Workers Secret |
| 2026-06-14 | AI_MODEL configuration policy was defined |
| 2026-06-14 | Missing-secret fallback behavior was defined |
| 2026-06-14 | Secret rotation runbook was documented |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a configuration preparation record.

### Prevention / Follow-up Actions

- [ ] Verify deploy succeeds after model configuration
- [ ] Confirm no API key exists in repository files
- [ ] Implement OpenAI API call from Worker
- [ ] Add missing-secret fallback
- [ ] Add AI timeout handling
- [ ] Add AI response validation
- [ ] Add estimated cost calculation

---

### 20260614-010

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / OpenAI API Worker integration check

### Summary

The Workers API was updated to call OpenAI API from Cloudflare Workers, and both fallback and generated responses were verified in production.

### Impact

No user-facing incident occurred.

The production API continued to return HTTP 200 with a valid JSON response during both OpenAI API failure and successful AI generation.

### Detection

Manual production verification after Cloudflare Workers deployment.

### Initial Checks

- OPENAI_API_KEY was configured as a Cloudflare Workers Secret
- AI_MODEL was configured in wrangler.toml
- OpenAI API call was implemented inside the Worker
- Timeout handling was implemented
- AI response validation was implemented
- Fallback response was implemented
- Usage counters for ai_calls, ai_success, and ai_errors were added
- OpenAI API billing credit was added after initial HTTP 429 verification

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Worker deploy | Success | Passed |
| Valid POST | 200 | Passed |
| Worker OpenAI call path | Executed | Passed |
| OpenAI API failure | Fallback response | Passed |
| fallbackReason | openai_http_429 | Passed |
| OpenAI API billing credit | Available | Passed |
| Successful AI response | aiStatus: generated | Passed |
| Response shape validation | Valid JSON shape | Passed |

### Observed Production Responses

Fallback response:

- HTTP status: 200
- aiStatus: fallback
- fallbackReason: openai_http_429

Generated response:

- HTTP status: 200
- aiStatus: generated
- AI-generated Japanese moving preparation advice returned successfully

### Root Cause

The first OpenAI API attempt returned HTTP 429 because API billing credit was not available.

After adding API credit, the Worker successfully received a generated AI response.

### Mitigation

OpenAI API credit was added with auto recharge disabled.

The Worker fallback response protected the production API while OpenAI API returned HTTP 429.

### Recovery Validation

The Workers API returned HTTP 200 and a valid generated JSON response after OpenAI API credit was added.

Fallback behavior was also verified before successful generation.

### Prevention / Follow-up Actions

- [ ] Add estimated token and cost calculation
- [ ] Add AI-specific daily usage limit
- [ ] Add cost_limit_reached test case
- [ ] Record OpenAI usage and cost after initial rollout
- [ ] Confirm Grafana API check remains healthy
- [ ] Review prompt and response validation after several real requests

---

### 20260614-011

### Service

SRE Lab Workers API

### Alert Rule

Manual verification / AI cost tracking and daily limit check

### Summary

AI-specific daily limits and estimated cost tracking were implemented and verified in production.

### Impact

No user-facing incident occurred.

The production API continued to return valid JSON responses while enforcing AI-specific daily limits and recording estimated AI usage cost.

### Detection

Manual production verification after GitHub Actions deployment.

### Initial Checks

- OpenAI API Worker integration was already verified
- AI-generated responses were already working in production
- Usage tracking foundation was already implemented
- KV-based rate limiting was already implemented
- Monthly cost stop threshold foundation was already available

### Implementation Details

- Service AI daily limit: 30 requests per day
- Per-IP AI daily limit: 5 requests per day
- AI limit response: 429 / ai_limit_reached
- AI limit Retry-After: 86400
- Estimated output tokens: 500
- Estimated input token strategy: conservative text length approximation
- Estimated cost is recorded in JPY
- Daily and monthly estimated cost keys are stored in Cloudflare KV

### Verification Results

| Case | Expected | Result |
|---|---|---|
| CI | Success | Passed |
| Deploy Worker | Success | Passed |
| Valid POST | 200 | Passed |
| AI generation | aiStatus: generated | Passed |
| estimatedUsage in response | Present | Passed |
| Daily estimated cost key | Numeric value | Passed |
| Monthly estimated cost key | Numeric value | Passed |
| Input token key | Numeric value | Passed |
| Output token key | Numeric value | Passed |
| Per-IP AI daily limit | 429 / ai_limit_reached | Passed |
| Retry-After header | 86400 | Passed |

### Observed Production Response

- HTTP status: 200
- aiStatus: generated
- estimatedInputTokens: 84
- estimatedOutputTokens: 500
- estimatedCostJpy: 0.04168

### Observed KV Values

| Key | Value |
|---|---:|
| usage:moving-assistant:ai_calls:20260614 | 5 |
| usage:moving-assistant:ai_success:20260614 | 2 |
| cost:moving-assistant:input_tokens:20260614 | 84 |
| cost:moving-assistant:output_tokens:20260614 | 500 |
| cost:moving-assistant:estimated_jpy:20260614 | 0.04168 |
| cost:moving-assistant:estimated_jpy:202606 | 0.04168 |

### AI Limit Verification

| Request | Result |
|---:|---|
| 1 | 200 / generated |
| 2 | 200 / generated |
| 3 | 200 / generated |
| 4 | 200 / generated |
| 5 | 429 / ai_limit_reached |
| 6 | 429 / ai_limit_reached |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | AI cost tracking and daily limits were implemented |
| 2026-06-14 | Changes were pushed to main |
| 2026-06-14 | CI workflow completed successfully |
| 2026-06-14 | Deploy Worker workflow completed successfully |
| 2026-06-14 | Production API returned generated AI response with estimatedUsage |
| 2026-06-14 | Cloudflare KV cost keys were verified |
| 2026-06-14 | Per-IP AI daily limit was verified with ai_limit_reached |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Production API returned valid AI-generated JSON before the AI-specific limit was reached.

After the per-IP AI daily limit was reached, the API returned 429 / ai_limit_reached with Retry-After: 86400.

Cloudflare KV recorded estimated input tokens, output tokens, and daily/monthly estimated cost values.

### Prevention / Follow-up Actions

- [ ] Add docs/cost.md
- [ ] Add cost_limit_reached test case
- [ ] Compare estimated cost with OpenAI Platform usage
- [ ] Review AI limit thresholds after initial usage data is collected
- [ ] Consider adding Grafana alerting for cost threshold in the future

---

### 20260614-012

### Service

SRE Lab Workers API / Cost Operations

### Alert Rule

Manual documentation record / cost operations setup

### Summary

Cost operations documentation was added after AI cost tracking and AI-specific daily limits were implemented.

### Impact

No user-facing incident occurred.

This record documents the creation of cost operations guidance for OpenAI API usage, Cloudflare KV cost tracking, and monthly budget control.

### Detection

Manual documentation review after AI cost tracking verification.

### Initial Checks

- OpenAI API Worker integration was completed
- AI cost tracking was implemented and verified
- AI-specific daily limits were implemented and verified
- OpenAI credit was configured with auto recharge off
- Estimated daily and monthly cost keys were verified in Cloudflare KV

### Documentation Added

- docs/cost.md
- Cost Operations section in docs/operations.md
- AI Cost Limit Runbook section in docs/runbook.md
- README reference to docs/cost.md

### Current Cost Policy

| Item | Value |
|---|---:|
| OpenAI initial credit | 5 USD |
| Auto recharge | Off |
| Monthly AI budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily hard limit | 100 JPY |
| Service AI daily limit | 30 requests / day |
| Per-IP AI daily limit | 5 requests / day |

### Cost Tracking Keys

- cost:moving-assistant:input_tokens:{yyyyMMdd}
- cost:moving-assistant:output_tokens:{yyyyMMdd}
- cost:moving-assistant:estimated_jpy:{yyyyMMdd}
- cost:moving-assistant:estimated_jpy:{yyyyMM}

### Verification Results

| Case | Expected | Result |
|---|---|---|
| docs/cost.md | Created | Passed |
| docs/operations.md | Cost Operations added | Passed |
| docs/runbook.md | AI Cost Limit Runbook added | Passed |
| README.md | docs/cost.md referenced | Passed |

### Timeline

| Time | Event |
|---|---|
| 2026-06-14 | AI cost tracking was verified |
| 2026-06-14 | AI-specific daily limits were verified |
| 2026-06-14 | Cost operations documentation was added |
| 2026-06-14 | Operational record was added |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a cost operations documentation record.

### Prevention / Follow-up Actions

- [ ] Add cost_limit_reached test case
- [ ] Compare Cloudflare KV estimated cost with OpenAI Platform usage
- [ ] Review cost thresholds after several days of real AI usage
- [ ] Consider Grafana alerting for cost thresholds in the future
- [ ] Consider D1 for historical cost reporting

---

### 20260614-013

### Service

SRE Lab Workers API / AI Cost Control

### Alert Rule

Manual verification / cost_limit_reached behavior check

### Summary

The cost_limit_reached behavior was manually verified by temporarily setting the monthly estimated cost key to the stop threshold.

### Impact

No user-facing incident occurred.

The production API correctly blocked AI diagnosis when the monthly estimated cost reached the configured stop threshold.

### Detection

Manual production verification using Cloudflare KV and curl.

### Initial Checks

- AI cost tracking was already implemented
- Cost operations documentation was already added
- Monthly estimated cost key existed in Cloudflare KV
- Monthly stop threshold was configured as 500 JPY
- OpenAI API integration was already working

### Test Procedure

1. Read the current monthly estimated cost value from Cloudflare KV.
2. Temporarily set cost:moving-assistant:estimated_jpy:202606 to 500.
3. Send a valid POST request to the production API.
4. Confirm the API returns 503 / cost_limit_reached.
5. Restore the monthly estimated cost value to the original value.
6. Confirm the API no longer returns cost_limit_reached.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Monthly cost key override | 500 | Passed |
| Valid POST while cost is at threshold | 503 | Passed |
| Error code | cost_limit_reached | Passed |
| OpenAI API call | Not executed | Passed by behavior |
| Monthly cost key restore | Original value | Passed |
| Post-restore behavior | Not cost_limit_reached | Passed |

### Expected Production Response During Test

```json
{
  "error": {
    "code": "cost_limit_reached",
    "message": "AI diagnosis is temporarily unavailable due to usage limits."
  }
}
```

### Root Cause

No incident occurred.

This was a controlled test of the cost stop threshold behavior.

### Mitigation

The monthly estimated cost key was restored to the original value after the test.

### Recovery Validation

After restoring the monthly estimated cost key, the API no longer returned cost_limit_reached.

If the per-IP AI daily limit had already been reached, 429 / ai_limit_reached was accepted as a valid post-restore response.

### Prevention / Follow-up Actions

- [ ] Compare estimated KV cost with OpenAI Platform usage
- [ ] Review cost threshold values after several days of AI usage
- [ ] Consider adding automated cost-limit tests for non-production environments
- [ ] Consider adding Grafana alerting for cost threshold in the future

---

### 20260614-014

### Service

SRE Lab Documentation / Real AI API Integration

### Alert Rule

Manual documentation record / Phase 6 final documentation update

### Summary

README and AI API design documentation were updated to reflect the completed Real AI API Integration phase.

### Impact

No user-facing incident occurred.

This record documents the final portfolio documentation update after OpenAI API integration, fallback, AI response validation, usage tracking, cost tracking, and cost limit verification were completed.

### Detection

Manual documentation review after Phase 6-6 completion.

### Initial Checks

- OpenAI API Worker integration was verified
- Fallback behavior was verified
- AI-generated response was verified
- AI-specific daily limits were verified
- Estimated AI cost tracking was verified
- cost_limit_reached behavior was verified
- Cost operations documentation was added

### Documentation Updated

- README.md
- docs/ai-api-design.md
- docs/incidents.md

### Updated README Scope

- Current AI Moving Assistant behavior
- Real AI API Integration section
- Updated architecture diagram
- Updated SRE / Operations Features
- Updated documentation table
- Updated current scope
- Updated roadmap

### Phase 6 Completion Summary

| Phase | Status |
|---|---|
| Phase 6-1 Real AI API Integration design | Completed |
| Phase 6-2 OpenAI API secret and model config | Completed |
| Phase 6-3 Worker OpenAI API integration | Completed |
| Phase 6-4 AI cost tracking and daily limits | Completed |
| Phase 6-5 Cost operations documentation | Completed |
| Phase 6-6 cost_limit_reached verification | Completed |
| Phase 6-7 Final README and documentation update | Completed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a documentation and portfolio readiness record.

### Prevention / Follow-up Actions

- [ ] Review README after adding future usage dashboard
- [ ] Review docs after adding second service
- [ ] Keep operational records updated after each major phase
- [ ] Compare estimated cost with OpenAI Platform usage after several days\n\n---\n\n### 20260614-015\n\n### Service\n\nSRE Lab Usage / Cost Monitoring\n\n### Alert Rule\n\nManual documentation record / usage and cost snapshot setup\n\n### Summary\n\nUsage and cost snapshot documentation was added to begin Phase 7 Usage / Cost Monitoring.\n\n### Impact\n\nNo user-facing incident occurred.\n\nThis record documents the start of Phase 7 by adding a manual snapshot report and operational procedures for usage and cost monitoring.\n\n### Detection\n\nManual documentation review after Phase 6 completion.\n\n### Initial Checks\n\n- Real AI API Integration was completed\n- AI usage tracking was implemented\n- AI cost tracking was implemented\n- AI-specific daily limits were implemented\n- Cost operations documentation was added\n- cost_limit_reached behavior was verified\n\n### Documentation Added\n\n- docs/usage-cost-report.md\n- Usage / Cost Snapshot Procedure in docs/cost.md\n- Daily Usage / Cost Snapshot section in docs/operations.md\n\n### Phase 7 Scope\n\n- Manual usage and cost snapshot\n- Cloudflare KV usage review\n- Cloudflare KV estimated cost review\n- OpenAI Platform usage comparison\n- Future dashboard design\n\n### Verification Results\n\n| Case | Expected | Result |\n|---|---|---|\n| docs/usage-cost-report.md | Created | Passed |\n| docs/cost.md | Snapshot procedure added | Passed |\n| docs/operations.md | Daily snapshot procedure added | Passed |\n| Phase 7 start | Documented | Passed |\n\n### Root Cause\n\nNo incident occurred.\n\n### Mitigation\n\nNo mitigation was required.\n\n### Recovery Validation\n\nNot applicable. This is a usage and cost monitoring documentation record.\n\n### Prevention / Follow-up Actions\n\n- [ ] Fill the first real usage/cost snapshot\n- [ ] Compare Cloudflare KV estimated cost with OpenAI Platform usage\n- [ ] Review whether daily or weekly cadence is appropriate\n- [ ] Design future usage/cost dashboard\n\n

---

### 20260614-016

### Service

SRE Lab Usage / Cost Monitoring

### Alert Rule

Manual verification / initial usage and cost snapshot

### Summary

The first manual usage and cost snapshot was recorded for AI Moving Assistant.

### Impact

No user-facing incident occurred.

This record documents the first Phase 7 usage and cost monitoring snapshot after Real AI API Integration was completed.

### Detection

Manual Cloudflare KV and OpenAI Platform review.

### Snapshot Values

| Metric | Value |
|---|---:|
| api_requests | 26 |
| api_success | 19 |
| api_errors | 82 |
| rate_limited | 3 |
| ai_calls | 9 |
| ai_success | 6 |
| ai_errors | 3 |
| ai_limited | 3 |
| input_tokens | 108 |
| output_tokens | 2500 |
| estimated_daily_jpy | 0.20216 |
| estimated_monthly_jpy | 0.20216 |
| OpenAI Platform requests | 0 |
| OpenAI Platform tokens | 0 |
| OpenAI Platform cost | $0.00 |

### Assessment

Initial usage and cost monitoring is in normal status.

The high api_errors count is expected because API safety, rate limit, AI limit, and cost limit behavior were manually tested on the same day.

Cloudflare KV estimated usage and OpenAI Platform Usage did not match at the time of the snapshot.

OpenAI Platform Usage showed 0 requests, 0 tokens, and $0.00 even though the Worker had returned aiStatus: generated during production verification.

This is not treated as an incident at this stage because it may be caused by reporting delay, project/group filter, or usage aggregation timing.

### Initial Checks

- API usage counters were available in Cloudflare KV
- AI usage counters were available in Cloudflare KV
- Estimated token counters were available in Cloudflare KV
- Estimated daily and monthly cost counters were available in Cloudflare KV
- OpenAI Platform billing and usage were checked manually
- Auto recharge remained off

### Documentation Updated

- docs/usage-cost-report.md
- docs/incidents.md

### Verification Results

| Case | Expected | Result |
|---|---|---|
| API usage counters | Available | Passed |
| AI usage counters | Available | Passed |
| Estimated cost counters | Available | Passed |
| OpenAI Platform check | Completed | Passed with note |
| Usage/cost report | Updated | Passed |

### Root Cause

No user-facing incident occurred.

OpenAI Platform usage mismatch cause is not confirmed.

Possible causes include reporting delay, project/group filter, or usage aggregation timing.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a usage and cost monitoring record.

### Prevention / Follow-up Actions

- [ ] Continue daily snapshots during initial AI rollout
- [ ] Recheck OpenAI Platform Usage later
- [ ] Compare Cloudflare KV estimated cost with OpenAI Platform usage
- [ ] Review AI limit thresholds after several days of data
- [ ] Consider future dashboard design

---

### 20260614-017

### Service

SRE Lab Usage / Cost Monitoring

### Alert Rule

Manual documentation record / usage source of truth policy

### Summary

A usage source-of-truth and OpenAI Usage recheck policy was documented after the first usage and cost snapshot.

### Impact

No user-facing incident occurred.

This record documents the monitoring policy for handling Cloudflare KV usage values and OpenAI Platform Usage mismatch during the initial AI rollout.

### Detection

Manual review after the first usage and cost snapshot.

### Observed Context

- Cloudflare KV recorded AI usage and estimated cost
- Worker returned aiStatus: generated during production verification
- OpenAI Platform Usage showed 0 requests, 0 tokens, and $0.00 at the time of snapshot
- OpenAI auto recharge remained off

### Policy Decision

Cloudflare KV is treated as the primary source for immediate operational decisions.

OpenAI Platform Usage is treated as a secondary reconciliation source because it may be affected by reporting delay, project or group filters, and usage aggregation timing.

### Documentation Updated

- docs/cost.md
- docs/operations.md
- docs/usage-cost-report.md
- docs/incidents.md

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Usage source-of-truth policy | Documented | Passed |
| OpenAI Usage recheck policy | Documented | Passed |
| KV as primary operational source | Documented | Passed |
| OpenAI Platform as reconciliation source | Documented | Passed |
| Mismatch handling | Documented | Passed |

### Assessment

No incident is declared at this stage.

The OpenAI Usage mismatch should be rechecked later while continuing to use Cloudflare KV for immediate cost guard decisions.

### Root Cause

No confirmed root cause.

Possible causes include OpenAI Usage reporting delay, project or group filter mismatch, API key project mismatch, usage aggregation timing, or small spend rounding.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a monitoring policy documentation record.

### Prevention / Follow-up Actions

- [ ] Recheck OpenAI Platform Usage later
- [ ] Confirm OpenAI project and API key project alignment
- [ ] Continue using Cloudflare KV for immediate cost guard decisions
- [ ] Compare KV estimated usage with OpenAI Platform usage after reporting updates
- [ ] Consider dashboard design in a later Phase 7 step

---

### 20260614-018

### Service

SRE Lab Usage / Cost Monitoring

### Alert Rule

Manual documentation record / future usage and cost dashboard design

### Summary

A future usage and cost dashboard design was documented for SRE Lab.

### Impact

No user-facing incident occurred.

This record documents the future dashboard design for usage, AI usage, estimated cost, and multi-service cost monitoring.

### Detection

Manual documentation planning during Phase 7 Usage / Cost Monitoring.

### Initial Checks

- Manual usage and cost snapshots were already added
- Cloudflare KV was defined as the primary operational source
- OpenAI Platform Usage was defined as a secondary reconciliation source
- Cost operations documentation was already available

### Documentation Added

- docs/dashboard-design.md
- Future Usage / Cost Dashboard section in docs/cost.md
- Future Dashboard Operations section in docs/operations.md
- README reference to docs/dashboard-design.md

### Design Decision

The dashboard will not be implemented immediately.

SRE Lab will continue using Cloudflare KV and manual Markdown snapshots during the early AI rollout.

A future dashboard may use Cloudflare D1 for historical reporting and a lightweight internal dashboard for service, usage, and cost summaries.

### Recommended Staged Path

| Stage | Approach | Status |
|---|---|---|
| Stage 1 | KV + manual snapshot | Current |
| Stage 2 | KV + generated Markdown report | Future |
| Stage 3 | D1 daily summary table | Future |
| Stage 4 | Lightweight dashboard page | Future |
| Stage 5 | Multi-service dashboard | Future |

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Dashboard design document | Created | Passed |
| Cost documentation | Dashboard section added | Passed |
| Operations documentation | Dashboard operations section added | Passed |
| README | Dashboard document referenced | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a future dashboard design record.

### Prevention / Follow-up Actions

- [ ] Continue manual usage and cost snapshots
- [ ] Recheck OpenAI Platform Usage later
- [ ] Decide whether KV remains enough after several days of usage
- [ ] Consider D1 before adding multiple services
- [ ] Defer dashboard implementation until usage data justifies it

---

### 20260614-019

### Service

SRE Lab Documentation / Usage and Cost Monitoring

### Alert Rule

Manual documentation record / Phase 7 final documentation update

### Summary

README and operational documentation were updated to reflect the completed Phase 7 Usage / Cost Monitoring work.

### Impact

No user-facing incident occurred.

This record documents the final documentation update for Phase 7 and confirms that SRE Lab is ready to move toward Phase 8 Second Service planning.

### Detection

Manual documentation review after Phase 7-4 completion.

### Initial Checks

- Usage and cost snapshot procedure was completed
- Initial usage and cost snapshot was recorded
- Usage source-of-truth policy was documented
- OpenAI Usage recheck policy was documented
- Future usage/cost dashboard design was documented

### Documentation Updated

- README.md
- docs/operations.md
- docs/cost.md
- docs/incidents.md

### Phase 7 Completion Summary

| Phase | Status |
|---|---|
| Phase 7-1 Usage / Cost Snapshot procedure | Completed |
| Phase 7-2 Initial Usage / Cost Snapshot | Completed |
| Phase 7-3 Usage source-of-truth policy | Completed |
| Phase 7-4 Future Usage / Cost Dashboard design | Completed |
| Phase 7-5 Final README and docs update | Completed |

### Current Monitoring Model

| Area | Source |
|---|---|
| Immediate usage review | Cloudflare KV |
| Immediate estimated cost review | Cloudflare KV |
| Actual usage reconciliation | OpenAI Platform Usage |
| Manual snapshot report | docs/usage-cost-report.md |
| Future dashboard design | docs/dashboard-design.md |

### Next Phase

Phase 8: Second Service.

Recommended candidate:

- AWS Cost Simulator

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a final documentation update for Phase 7.

### Prevention / Follow-up Actions

- [ ] Start Phase 8 Second Service planning
- [ ] Keep usage/cost snapshots during initial AI rollout
- [ ] Recheck OpenAI Platform Usage later
- [ ] Decide whether generated reports or dashboard are needed after more usage data

---

### 20260614-020

### Service

SRE Lab Second Service Planning

### Alert Rule

Manual documentation record / Phase 8 second service planning

### Summary

Phase 8 was started and AWS Cost Simulator was selected as the planned second service for SRE Lab.

### Impact

No user-facing incident occurred.

This record documents the start of Phase 8 and the initial design decision for the second service.

### Detection

Manual planning after Phase 7 Usage / Cost Monitoring completion.

### Initial Checks

- Phase 7 Usage / Cost Monitoring was completed
- AI Moving Assistant had API safety, AI integration, cost tracking, and usage monitoring
- SRE Lab was ready to move from one service to a multi-service direction

### Design Decision

AWS Cost Simulator was selected as the planned second service.

Reasons:

- Aligns with AWS SAA learning
- Aligns with Terraform learning
- Demonstrates cloud cost awareness
- Adds SRE / FinOps portfolio value
- Can be implemented without paid AI API dependency in the MVP
- Can later support SEO, technical articles, and monetization experiments

### Documentation Updated

- README.md
- docs/services.md
- docs/operations.md
- docs/aws-cost-simulator.md
- docs/incidents.md

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Second service candidate | Selected | Passed |
| AWS Cost Simulator design | Documented | Passed |
| Services documentation | Updated | Passed |
| Operations documentation | Updated | Passed |
| README | Updated | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a second service planning record.

### Prevention / Follow-up Actions

- [ ] Design AWS Cost Simulator frontend UI
- [ ] Add Workers API endpoint
- [ ] Implement deterministic cost calculation
- [ ] Add API safety validation
- [ ] Add synthetic monitoring after implementation
- [ ] Update README and operational docs after MVP release

---

### 20260614-021

### Service

SRE Lab Frontend Navigation / Second Service Planning

### Alert Rule

Manual documentation record / dedicated service page design

### Summary

A frontend navigation policy was documented for SRE Lab multi-service operation.

### Impact

No user-facing incident occurred.

This record documents the decision to avoid mixing unrelated service forms on a single page.

### Detection

Manual design review during Phase 8-2.

### Design Decision

SRE Lab top page will act as a service directory and each service will have a dedicated page.

Initial structure:

- index.html
- moving-assistant.html
- aws-cost-simulator.html

### Reason

- Avoid confusing unrelated service flows
- Keep each service purpose clear
- Improve SEO and portfolio storytelling
- Make page-level and endpoint-level monitoring easier
- Support future multi-service SRE Lab growth

### Documentation Updated

- README.md
- docs/frontend-navigation.md
- docs/aws-cost-simulator.md
- docs/services.md
- docs/operations.md
- docs/incidents.md

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Service navigation policy | Documented | Passed |
| Dedicated page policy | Documented | Passed |
| AWS Cost Simulator frontend design | Documented | Passed |
| README navigation design | Updated | Passed |
| Operational record | Added | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a frontend navigation design record.

### Prevention / Follow-up Actions

- [ ] Convert or preserve AI Moving Assistant as a dedicated page
- [ ] Add AWS Cost Simulator dedicated page
- [ ] Keep top page as a service directory
- [ ] Add page-level monitoring after implementation
- [ ] Add AWS Cost Simulator API endpoint after frontend design is stable

---

### 20260614-022

### Service

SRE Lab Frontend / Multi-service Page Split

### Alert Rule

Manual documentation record / frontend page split implementation

### Summary

The frontend structure was split into a service directory page and dedicated service pages.

### Impact

No user-facing incident occurred.

This record documents Phase 8-3 frontend page split implementation for SRE Lab.

### Detection

Manual implementation and local file verification during Phase 8-3.

### Changes

- apps/landing/index.html was changed into the SRE Lab top page and service directory
- apps/landing/moving-assistant.html was created from the existing AI Moving Assistant page
- apps/landing/aws-cost-simulator.html was created as a placeholder page
- apps/landing/styles.css was updated for service cards and navigation links
- moving-assistant.html received a back link to the SRE Lab top page

### Design Decision

SRE Lab now separates service navigation from individual service UIs.

The top page is used as the service directory.

Each service has a dedicated page.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Top page | Service directory | Passed |
| AI Moving Assistant page | Dedicated page exists | Passed |
| AWS Cost Simulator page | Placeholder page exists | Passed |
| Top page links | Link to both service pages | Passed |
| Service page back links | Link back to index.html | Passed |
| CSS | Service card and nav styles added | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a frontend implementation record.

### Prevention / Follow-up Actions

- [ ] Verify Cloudflare Pages deployment after push
- [ ] Confirm top page opens in production
- [ ] Confirm moving-assistant.html opens in production
- [ ] Confirm aws-cost-simulator.html opens in production
- [ ] Add AWS Cost Simulator form in the next Phase 8 step
- [ ] Add monitoring for dedicated service pages later

---

### 20260614-023

### Service

SRE Lab AWS Cost Simulator Frontend

### Alert Rule

Manual documentation record / frontend UI implementation

### Summary

The AWS Cost Simulator placeholder page was updated with the initial frontend UI form.

### Impact

No user-facing incident occurred.

This record documents Phase 8-4 frontend UI implementation for AWS Cost Simulator.

### Detection

Manual implementation and local file verification during Phase 8-4.

### Changes

- Added AWS Cost Simulator input form
- Added region selector
- Added EC2 instance type selector
- Added EC2 instance count input
- Added EC2 monthly hours input
- Added EBS storage input
- Added S3 storage input
- Added data transfer input
- Added disabled calculate button for future API integration
- Added result preview section
- Added form styles to apps/landing/styles.css

### Design Decision

The AWS Cost Simulator UI is implemented before the Workers API endpoint.

The calculate button remains disabled until the deterministic calculation API is implemented.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| AWS Cost Simulator form | Present | Passed |
| Input fields | Present | Passed |
| Result preview | Present | Passed |
| Calculate button | Disabled | Passed |
| CSS form styles | Added | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a frontend UI implementation record.

### Prevention / Follow-up Actions

- [ ] Add Workers API endpoint for AWS Cost Simulator
- [ ] Implement deterministic calculation logic
- [ ] Enable calculate button after API integration
- [ ] Add API safety validation
- [ ] Add synthetic monitoring after endpoint release

---

### 20260614-024

### Service

SRE Lab AWS Cost Simulator API

### Alert Rule

Manual documentation record / Workers API endpoint implementation

### Summary

A new Workers API endpoint was added for AWS Cost Simulator.

### Impact

No user-facing incident occurred.

This record documents Phase 8-5 Workers API endpoint implementation for the second SRE Lab service.

### Detection

Manual implementation and syntax verification during Phase 8-5.

### Changes

- Added AWS Cost Simulator API path
- Added POST /api/aws-cost-simulator route handling
- Added JSON request validation for the new endpoint
- Added request size checks for the new endpoint
- Added mock estimate response for endpoint verification
- Preserved existing POST /api/moving-assistant behavior

### Design Decision

The AWS Cost Simulator endpoint starts with a mock response.

Deterministic cost calculation is intentionally deferred to the next phase.

The endpoint does not call OpenAI API or any paid external API.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| API syntax check | Pass | Passed |
| AWS Cost Simulator path | Added | Passed |
| Mock response | Implemented | Passed |
| Existing Moving Assistant path | Preserved | Passed |
| Paid AI API call | Not used | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is an API endpoint implementation record.

### Prevention / Follow-up Actions

- [ ] Deploy Worker through GitHub Actions
- [ ] Verify POST /api/aws-cost-simulator in production
- [ ] Implement deterministic cost calculation in Phase 8-6
- [ ] Add stronger input validation in Phase 8-7
- [ ] Add monitoring after endpoint behavior is stable

---

### 20260614-025

### Service

SRE Lab AWS Cost Simulator API

### Alert Rule

Manual documentation record / deterministic cost calculation

### Summary

Deterministic cost calculation was implemented for AWS Cost Simulator.

### Impact

No user-facing incident occurred.

This record documents Phase 8-6 deterministic cost calculation implementation.

### Detection

Manual implementation and syntax verification during Phase 8-6.

### Changes

- Replaced mock 0-cost response with deterministic calculation
- Added fixed USD to JPY rate
- Added fixed EC2 hourly pricing table
- Added fixed EBS GB-month estimate
- Added fixed S3 GB-month estimate
- Added fixed data transfer estimate
- Added total monthly USD calculation
- Added total monthly JPY calculation
- Added per-resource cost breakdown
- Added educational assumptions and disclaimer

### Design Decision

AWS Cost Simulator uses fixed approximate prices for the MVP.

The service does not call AWS Pricing API.

The service does not call OpenAI API or any paid AI API.

The output is explicitly educational and approximate.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| API syntax check | Pass | Passed |
| Deterministic calculation | Implemented | Passed |
| Mock 0-cost response | Replaced | Passed |
| Paid AI API call | Not used | Passed |
| Educational disclaimer | Present | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a deterministic calculation implementation record.

### Prevention / Follow-up Actions

- [ ] Deploy Worker through GitHub Actions
- [ ] Verify POST /api/aws-cost-simulator in production
- [ ] Connect frontend form to the API
- [ ] Add stronger input validation in Phase 8-7
- [ ] Add synthetic monitoring after endpoint behavior is stable

---

### 20260614-026

### Service

SRE Lab AWS Cost Simulator API

### Alert Rule

Manual documentation record / API validation implementation

### Summary

Input validation was added to the AWS Cost Simulator API endpoint.

### Impact

No user-facing incident occurred.

This record documents Phase 8-7 API safety and validation implementation.

### Detection

Manual implementation and syntax verification during Phase 8-7.

### Changes

- Added region whitelist
- Added EC2 instance type whitelist
- Added numeric input range validation
- Added finite number validation
- Added 400 / invalid_input response for unsupported or out-of-range values
- Preserved deterministic calculation for valid input
- Preserved existing Moving Assistant behavior

### Validation Rules

| Field | Rule |
|---|---|
| region | ap-northeast-1 or us-east-1 |
| ec2InstanceType | t3.micro, t3.small, or t3.medium |
| ec2InstanceCount | 0 to 20 |
| ec2HoursPerMonth | 0 to 744 |
| ebsGb | 0 to 1000 |
| s3Gb | 0 to 1000 |
| dataTransferGb | 0 to 1000 |

### Verification Results

| Case | Expected | Result |
|---|---|---|
| API syntax check | Pass | Passed |
| Valid input | 200 deterministic estimate | Pending production check |
| Invalid region | 400 invalid_input | Pending production check |
| Invalid instance type | 400 invalid_input | Pending production check |
| Out-of-range number | 400 invalid_input | Pending production check |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is an API safety implementation record.

### Prevention / Follow-up Actions

- [ ] Deploy Worker through GitHub Actions
- [ ] Verify valid input in production
- [ ] Verify invalid region in production
- [ ] Verify invalid instance type in production
- [ ] Verify out-of-range numeric input in production
- [ ] Connect frontend form to the API after validation is stable

---

### 20260614-027

### Service

SRE Lab AWS Cost Simulator

### Alert Rule

sre-lab-aws-cost-simulator-api-down

### Summary

AWS Cost Simulator was documented as an operational service and prepared for dedicated monitoring.

### Impact

No user-facing incident occurred.

This record documents Phase 8-8 monitoring and documentation update for AWS Cost Simulator.

### Detection

Manual production verification and documentation review after Phase 8-7.

### Changes

- Updated README with AWS Cost Simulator status
- Updated AWS Cost Simulator documentation
- Updated operations guide with AWS Cost Simulator checks
- Documented recommended Grafana Synthetic Monitoring target
- Documented recommended alert rule
- Documented production curl check
- Documented expected success and validation behavior

### Production Endpoint

POST https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator

### Recommended Monitoring

| Item | Value |
|---|---|
| Check name | sre-lab-aws-cost-simulator-api |
| Alert rule | sre-lab-aws-cost-simulator-api-down |
| Method | POST |
| Expected status | 2xx |
| Probe | Tokyo, JP |
| Frequency | 60s |
| Runbook | docs/runbook.md |

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Valid AWS Cost Simulator request | 200 deterministic estimate | Passed |
| Invalid region | 400 invalid_input | Passed |
| Invalid instance type | 400 invalid_input | Passed |
| Out-of-range numeric input | 400 invalid_input | Passed |
| Documentation update | Completed | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a monitoring and documentation update record.

### Prevention / Follow-up Actions

- [ ] Add Grafana Synthetic Monitoring check
- [ ] Add Grafana alert rule
- [ ] Verify alert routing to existing email contact point
- [ ] Connect frontend form to API in a future phase

---

### 20260614-028

### Service

SRE Lab AWS Cost Simulator Frontend

### Alert Rule

Manual documentation record / frontend API integration

### Summary

AWS Cost Simulator frontend was connected to the Workers API endpoint.

### Impact

No user-facing incident occurred.

This record documents Phase 9-A frontend to API integration.

### Detection

Manual implementation and frontend verification planning.

### Changes

- Enabled Calculate estimate button
- Added frontend JavaScript submit handler
- Added POST request to AWS Cost Simulator Workers API
- Added JSON request body generation from form fields
- Added result rendering for total monthly estimate
- Added resource breakdown rendering
- Added assumptions and disclaimer rendering
- Added error rendering for API and network errors
- Added result box styling

### Production Endpoint

POST https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator

### Design Decision

The frontend connects to the deterministic AWS Cost Simulator API.

The frontend does not call AWS Pricing API.

The frontend does not call OpenAI API or any paid AI API.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Frontend form submit | Calls Workers API | Pending production check |
| Valid input | Shows deterministic estimate | Pending production check |
| API error | Shows error message | Pending production check |
| Network error | Shows fallback error | Pending production check |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a frontend API integration record.

### Prevention / Follow-up Actions

- [ ] Verify production frontend page
- [ ] Verify successful estimate rendering
- [ ] Verify invalid input error rendering
- [ ] Update docs if needed after browser verification

---

### 20260614-029

### Service

SRE Lab Multi-Service Portfolio

### Alert Rule

Manual documentation record / portfolio polish

### Summary

README and service documentation were updated to reflect SRE Lab as a multi-service operations lab.

### Impact

No user-facing incident occurred.

This record documents Phase 9-B README and documentation polish after AWS Cost Simulator frontend API integration.

### Detection

Manual documentation review after Phase 9-A.

### Changes

- Updated README from single-service wording to multi-service wording
- Documented AI Moving Assistant and AWS Cost Simulator as current services
- Replaced second-service planning language with multi-service operating status
- Updated services documentation with multi-service operating status
- Updated AWS Cost Simulator documentation with frontend API integration status
- Clarified service-specific monitoring and alerting value

### Verification Results

| Case | Expected | Result |
|---|---|---|
| README reflects multiple services | Updated | Passed |
| AWS Cost Simulator documented as active service | Updated | Passed |
| Service docs reflect multi-service operation | Updated | Passed |
| Operational record added | Added | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a documentation polish record.

### Prevention / Follow-up Actions

- [ ] Continue keeping README aligned with actual production status
- [ ] Update docs when adding future services
- [ ] Keep monitoring and alerting status reflected in operational records

---

### 20260614-030

### Service

SRE Lab Multi-Service Portfolio

### Alert Rule

Manual documentation record / portfolio submission package

### Summary

A portfolio submission package was added for interviews and repository review.

### Impact

No user-facing incident occurred.

This record documents Phase 9-C portfolio submission package creation.

### Detection

Manual documentation planning after multi-service implementation and monitoring setup.

### Changes

- Added docs/portfolio-submission.md
- Summarized live URLs
- Summarized current services
- Summarized technical stack
- Summarized SRE and platform engineering points
- Summarized reliability design
- Summarized monitoring and alerting
- Summarized cost and safety design
- Added interview explanation
- Added next improvement candidates
- Added documentation link to README

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Portfolio submission document | Added | Passed |
| README documentation table | Updated | Passed |
| Operational record | Added | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a documentation and portfolio packaging record.

### Prevention / Follow-up Actions

- [ ] Keep portfolio submission package aligned with future service changes
- [ ] Update interview explanation after adding future services
- [ ] Add screenshots or architecture visuals in a future polish phase

---

### 20260614-031

### Service

SRE Lab Portfolio Documentation

### Alert Rule

Manual documentation record / Japanese localization

### Summary

README, portfolio submission document, and public service UI were localized toward Japanese presentation.

### Impact

No user-facing incident occurred.

This record documents Phase 9-D Japanese portfolio localization.

### Detection

Manual portfolio review identified mixed English and Japanese wording across documentation and site UI.

### Changes

- Rewrote README as Japanese-first portfolio documentation
- Rewrote docs/portfolio-submission.md as Japanese-first submission material
- Localized SRE Lab top page copy
- Localized AWS Cost Simulator page copy
- Kept service names and technical terms in English where appropriate
- Preserved code, API paths, metrics, alert names, and commit conventions in English

### Design Decision

Public-facing explanations and portfolio materials should be Japanese-first because the primary review context is Japanese interviews and portfolio screening.

Service names and technical terms remain English where they are standard industry terms.

### Verification Results

| Case | Expected | Result |
|---|---|---|
| README Japanese-first | Updated | Pending review |
| Portfolio submission Japanese-first | Updated | Pending review |
| Top page UI Japanese-first | Updated | Pending review |
| AWS Cost Simulator UI Japanese-first | Updated | Pending review |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a localization and portfolio polish record.

### Prevention / Follow-up Actions

- [ ] Keep future public-facing docs Japanese-first
- [ ] Keep technical identifiers in English
- [ ] Review AI Moving Assistant page wording if needed
- [ ] Review Runbook and Operations docs for future Japanese polish

---

### 20260614-032

### Service

SRE Lab Portfolio

### Alert Rule

Manual documentation record / final portfolio review

### Summary

Final portfolio review identified and fixed remaining outdated public UI wording before screenshot capture.

### Impact

No user-facing incident occurred.

This record documents Phase 9-E final portfolio review and screenshot preparation.

### Detection

Manual GitHub and public UI review after Japanese localization.

### Changes

- Reviewed README for portfolio submission readiness
- Reviewed docs/portfolio-submission.md for interview readiness
- Reviewed SRE Lab top page copy
- Updated outdated AWS Cost Simulator status from planned to production
- Updated top page service descriptions to Japanese-first wording
- Updated AWS Cost Simulator initial result message to Japanese
- Prepared screenshot checklist for final portfolio submission

### Verification Results

| Case | Expected | Result |
|---|---|---|
| README review | Ready for submission | Passed |
| Portfolio submission document review | Ready for interviews | Passed |
| Top page wording | Japanese-first and current | Updated |
| AWS Cost Simulator status | Production, not planned | Updated |
| AWS Cost Simulator result placeholder | Japanese | Updated |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a portfolio review and polish record.

### Screenshot Targets

- SRE Lab top page
- AI Moving Assistant page
- AWS Cost Simulator form
- AWS Cost Simulator result
- Grafana Synthetic Monitoring checks
- Grafana Alert rules
- GitHub Actions CI and Deploy Worker badges
- docs/portfolio-submission.md
- docs/incidents.md

### Prevention / Follow-up Actions

- [ ] Capture final screenshots after Cloudflare Pages deployment
- [ ] Check public pages after deploy
- [ ] Keep page status labels aligned with actual production status

---

### 20260614-033

### Service

SRE Lab Portfolio README

### Alert Rule

Manual documentation record / README Japanese wording polish

### Summary

README wording was polished to reduce unnatural English-heavy headings and bullet points for Japanese portfolio submission.

### Impact

No user-facing incident occurred.

This record documents additional README localization polish after final wording review.

### Detection

Manual review identified that the README still contained many English headings and bullet points, making it look partially localized.

### Changes

- Replaced English section headings with natural Japanese headings
- Rewrote English-heavy bullet points into Japanese-first descriptions
- Kept service names, product names, API paths, metric names, and alert names in English where appropriate
- Preserved technical clarity while improving Japanese readability for portfolio submission

### Verification Results

| Case | Expected | Result |
|---|---|---|
| README headings | Japanese-first | Updated |
| README bullet points | Japanese-first | Updated |
| Technical identifiers | Preserved | Passed |
| Portfolio readability | Improved | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a documentation polish record.

### Prevention / Follow-up Actions

- [ ] Keep future README updates Japanese-first
- [ ] Preserve technical terms in English only when they improve clarity
- [ ] Re-check GitHub rendering after push

---

### 20260614-034

### Service

SRE Lab Portfolio README

### Alert Rule

Manual documentation record / README rewrite

### Summary

README was rewritten as a Japanese-first portfolio document instead of translating the previous English-oriented structure.

### Impact

No user-facing incident occurred.

This record documents the README rewrite for natural Japanese portfolio presentation.

### Detection

Manual review identified that the README still looked like an English README translated into Japanese, especially in headings and bullet points.

### Changes

- Removed interview script section from README
- Rebuilt README structure for Japanese portfolio submission
- Replaced translation-like headings with natural Japanese headings
- Rewrote bullet points as Japanese-first descriptions
- Preserved technical names, API paths, alert names, and product names where appropriate
- Added clearer sections for API safety, CI/CD, operations documentation, and future improvements

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Interview script section | Removed | Passed |
| Japanese heading structure | Natural Japanese | Updated |
| Bullet point wording | Japanese-first | Updated |
| Technical identifiers | Preserved | Passed |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a documentation rewrite record.

### Prevention / Follow-up Actions

- [ ] Keep README Japanese-first for portfolio submission
- [ ] Keep interview scripts outside the main README
- [ ] Use docs/portfolio-submission.md for detailed interview preparation

---

### 20260614-035

### Service

SRE Lab Public Site

### Alert Rule

Manual documentation record / Japanese-first site rebuild

### Summary

The public site pages were rebuilt as Japanese-first portfolio pages instead of partially translated English-based pages.

### Impact

No user-facing incident occurred.

This record documents the Japanese-first public site rebuild for final portfolio presentation.

### Detection

Manual review identified that the public site still contained English-based wording, outdated status labels, and translation-like structure.

### Changes

- Rebuilt SRE Lab top page copy as Japanese-first portfolio content
- Rebuilt AI Moving Assistant page copy as Japanese-first service UI
- Rebuilt AWS Cost Simulator page copy as Japanese-first service UI
- Removed outdated planned / phase wording from public service pages
- Preserved form IDs and JavaScript API connections
- Preserved service names, API paths, and technical terms where appropriate
- Improved screenshot readiness for portfolio submission

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Top page wording | Japanese-first | Updated |
| AI Moving Assistant wording | Japanese-first | Updated |
| AWS Cost Simulator wording | Japanese-first | Updated |
| Form IDs | Preserved | Passed |
| API endpoints | Preserved | Passed |
| JavaScript behavior | Preserved | Pending browser check |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a public site wording and structure rebuild.

### Prevention / Follow-up Actions

- [ ] Run browser check after Cloudflare Pages deployment
- [ ] Verify AI Moving Assistant form submission
- [ ] Verify AWS Cost Simulator calculation
- [ ] Capture final screenshots

---

### 20260614-036

### Service

Cloud and AI Tools Public Site

### Alert Rule

Manual documentation record / design system CSS

### Summary

A shared CSS design system was introduced for the public tool site.

### Impact

No user-facing incident occurred.

This record documents Phase 9-G-1 design system CSS creation.

### Detection

Manual review identified that the public site layout, typography, spacing, cards, buttons, forms, and result panels looked too basic for portfolio screenshots and public presentation.

### Changes

- Rebuilt apps/landing/styles.css as a shared design system
- Added design tokens for colors, spacing, radius, shadow, and container width
- Improved typography scale
- Improved hero layout
- Improved service cards
- Improved buttons
- Improved forms and input focus states
- Improved result panels
- Added responsive layout rules
- Preserved existing class names used by current HTML pages

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Existing class names | Preserved | Passed |
| Top page layout | Improved | Pending browser check |
| AI Moving Assistant layout | Improved | Pending browser check |
| AWS Cost Simulator layout | Improved | Pending browser check |
| Responsive layout | Added | Pending browser check |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a design system improvement record.

### Prevention / Follow-up Actions

- [ ] Rebuild top page HTML using the new design system
- [ ] Rebuild AI Moving Assistant HTML using the new design system
- [ ] Rebuild AWS Cost Simulator HTML using the new design system
- [ ] Verify public pages after Cloudflare Pages deployment

---

### 20260614-037

### Service

Cloud and AI Tools Public Site

### Alert Rule

Manual documentation record / top page rebuild

### Summary

The public top page was rebuilt as a customer-facing landing page for the Cloud and AI tools site.

### Impact

No user-facing incident occurred.

This record documents Phase 9-G-2 top page rebuild.

### Detection

Manual review identified that the top page should behave as a customer-facing service entry point rather than a portfolio explanation page.

### Changes

- Rebuilt apps/landing/index.html
- Used クラウドとAIの便利ツール集 as the public site name
- Removed SRE Lab and portfolio wording from the public top page
- Added customer-facing hero copy
- Added tool cards for AI引越し診断 and AWS料金試算
- Added usage flow section
- Added general disclaimer section
- Added future tool candidates section
- Preserved links to existing service pages

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Public site name | クラウドとAIの便利ツール集 | Updated |
| Portfolio wording | Not shown | Passed |
| Service cards | Shown | Passed |
| Existing links | Preserved | Passed |
| Browser check | Required after deploy | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a public top page rebuild.

### Prevention / Follow-up Actions

- [ ] Rebuild AI Moving Assistant page using the same design system
- [ ] Rebuild AWS Cost Simulator page using the same design system
- [ ] Verify public page after Cloudflare Pages deployment

---

### 20260614-038

### Service

AI Moving Assistant Public Page

### Alert Rule

Manual documentation record / AI Moving Assistant page rebuild

### Summary

The AI Moving Assistant public page was rebuilt as a customer-facing AI tool page using the shared design system.

### Impact

No user-facing incident occurred.

This record documents Phase 9-G-3 moving-assistant.html rebuild.

### Detection

Manual review identified that the AI Moving Assistant page needed clearer customer-facing layout, wording, and result guidance.

### Changes

- Rebuilt apps/landing/moving-assistant.html
- Removed SRE and portfolio wording from the public page
- Improved hero copy for customer-facing use
- Improved input form guidance
- Added result explanation before the result panel
- Added usage instructions
- Added customer-facing disclaimer
- Preserved form IDs
- Preserved result container ID
- Preserved production API endpoint
- Preserved JavaScript submission behavior

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Customer-facing wording | Updated | Passed |
| Form ID moving-form | Preserved | Passed |
| Result ID result | Preserved | Passed |
| Production API endpoint | Preserved | Passed |
| Browser check | Required after deploy | Pending |
| Form submission | Required after deploy | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a public page rebuild.

### Prevention / Follow-up Actions

- [ ] Rebuild AWS Cost Simulator page using the same design system
- [ ] Verify AI Moving Assistant form after Cloudflare Pages deployment
- [ ] Capture final page screenshot

---

### 20260614-039

### Service

AWS Cost Simulator Public Page and API

### Alert Rule

Manual documentation record / AWS Cost Simulator page rebuild and API localization

### Summary

The AWS Cost Simulator public page was rebuilt using the shared design system, and API response assumptions/disclaimer were localized to Japanese.

### Impact

No user-facing incident occurred.

This record documents Phase 9-G-4 AWS Cost Simulator page rebuild and API localization.

### Detection

Manual review identified that the AWS Cost Simulator page needed a more polished user-facing layout and that the result assumptions were still displayed in English.

### Changes

- Rebuilt apps/landing/aws-cost-simulator.html
- Removed SRE and portfolio wording from the public page
- Improved hero copy for customer-facing use
- Improved form guidance
- Improved result panel wording
- Preserved form IDs
- Preserved result container ID
- Preserved production API endpoint
- Localized AWS Cost Simulator summary to Japanese
- Localized assumptions to Japanese
- Localized disclaimer to Japanese

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Customer-facing wording | Updated | Passed |
| Form ID aws-cost-form | Preserved | Passed |
| Button ID calculate-button | Preserved | Passed |
| Result ID aws-cost-result | Preserved | Passed |
| API endpoint | Preserved | Passed |
| AWS assumptions | Japanese | Passed |
| API syntax check | Pass | Pending |
| Browser check | Required after deploy | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a public page and API wording improvement.

### Prevention / Follow-up Actions

- [ ] Verify API syntax check
- [ ] Verify Workers deployment
- [ ] Verify AWS Cost Simulator calculation in browser
- [ ] Confirm assumptions are displayed in Japanese
- [ ] Capture final page screenshot

---

### 20260614-041

### Service

Cloud and AI Tools Public Site

### Alert Rule

Manual documentation record / reference-based CSS redesign

### Summary

The public site CSS was redesigned based on the final reference-based wireframe.

### Impact

No user-facing incident occurred.

This record documents Phase 9-H-3 CSS redesign.

### Detection

Manual design review identified that the previous CSS improved the site but still did not sufficiently match high-quality commercial reference layouts.

### Changes

- Rebuilt apps/landing/styles.css
- Added shared header styles
- Added reference-based hero layout
- Added preview card styles
- Added tool card and scenario card styles
- Added calculator two-column layout styles
- Added sticky result panel support
- Added breakdown card styles
- Added shared footer styles
- Preserved existing class compatibility where possible
- Added responsive layout rules for mobile

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Header styles | Added | Passed |
| Hero styles | Added | Passed |
| Tool card styles | Added | Passed |
| Calculator layout styles | Added | Passed |
| Result card styles | Added | Passed |
| Footer styles | Added | Passed |
| Mobile rules | Added | Passed |
| Browser check | Required after HTML rebuild | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a CSS design improvement record.

### Prevention / Follow-up Actions

- [ ] Rebuild HTML pages using the final wireframe
- [ ] Verify public pages after deployment
- [ ] Capture screenshots after final HTML rebuild

---

### 20260614-042

### Service

Cloud and AI Tools Public Site

### Alert Rule

Manual documentation record / top page HTML rebuild

### Summary

The top page HTML was rebuilt based on the final reference-based wireframe.

### Impact

No user-facing incident occurred.

This record documents Phase 9-H-4-1 index.html rebuild.

### Detection

Manual design review identified that the top page needed to follow the final reference-based layout rather than a generic landing page structure.

### Changes

- Rebuilt apps/landing/index.html
- Added shared header
- Added reference-based hero
- Added preview cards
- Added purpose-based tool cards
- Added usage scenario cards
- Added notice section
- Added footer
- Removed portfolio and SRE wording from public page
- Preserved existing links to service pages
- Avoided new external dependencies

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Site name | クラウドとAIの便利ツール集 | Passed |
| Header | Added | Passed |
| Hero | Reference-based | Passed |
| Tool cards | Added | Passed |
| Usage scenarios | Added | Passed |
| Notice section | Added | Passed |
| Footer | Added | Passed |
| External dependencies | None added | Passed |
| Browser check | Required after deploy | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is a top page HTML rebuild.

### Prevention / Follow-up Actions

- [ ] Rebuild AI Moving Assistant HTML
- [ ] Rebuild AWS Cost Simulator HTML
- [ ] Verify public pages after Cloudflare Pages deployment

---

### 20260614-043

### Service

AI Moving Assistant Public Page

### Alert Rule

Manual documentation record / AI Moving Assistant HTML rebuild

### Summary

The AI Moving Assistant page HTML was rebuilt based on the final reference-based wireframe.

### Impact

No user-facing incident occurred.

This record documents Phase 9-H-4-2 moving-assistant.html rebuild.

### Detection

Manual design review identified that the AI Moving Assistant page needed an input-first structure based on a moving-service reference layout.

### Changes

- Rebuilt apps/landing/moving-assistant.html
- Added shared header
- Added back link to top page
- Added hero section
- Emphasized the input form
- Added diagnosis result section
- Added 3-step usage section
- Added notice section
- Added shared footer
- Preserved API endpoint /api/moving-assistant
- Preserved client-side rendering for result output
- Removed portfolio and SRE wording from public page
- Avoided new external dependencies

### Verification Results

| Case | Expected | Result |
|---|---|---|
| Page structure | Hero / Form / Result / Usage / Notice / Footer | Passed |
| Site name | クラウドとAIの便利ツール集 | Passed |
| Form ID | movingAssistantForm | Passed |
| Result ID | result | Passed |
| API endpoint | /api/moving-assistant | Passed |
| External dependencies | None added | Passed |
| Browser check | Required after deploy | Pending |

### Root Cause

No incident occurred.

### Mitigation

No mitigation was required.

### Recovery Validation

Not applicable. This is an AI Moving Assistant HTML rebuild.

### Prevention / Follow-up Actions

- [ ] Rebuild AWS Cost Simulator HTML
- [ ] Verify AI Moving Assistant page after Cloudflare Pages deployment
- [ ] Confirm production API response rendering
