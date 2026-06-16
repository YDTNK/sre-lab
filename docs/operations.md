# Operations Guide

This document defines the basic operational workflow for SRE Lab.

## Daily Checks

- Check Cloudflare Pages deployment status
- Check Grafana Synthetic Monitoring status for landing page and API
- Check alert rule status
- Check GitHub Actions status

## Weekly Checks

- Review uptime and response time trends
- Review incidents and follow-up actions
- Review runbook accuracy
- Review cost and usage

## Deployment Checks

Before deployment:

- Confirm GitHub Actions passes
- Confirm landing page files exist
- Confirm README and docs are updated when operational behavior changes

After deployment:

- Confirm Cloudflare Pages deployment succeeded
- Confirm https://sre-lab.pages.dev/ returns HTTP 200
- Confirm Grafana uptime checks for landing page and API remain healthy

## API Operations

The AI Moving Assistant API is operated as a Cloudflare Workers endpoint.

Operational checks:

- Confirm Worker deployment status
- Confirm POST /api/moving-assistant returns HTTP 200
- Confirm Grafana API synthetic check is healthy
- Confirm API alert rule is normal
- Confirm frontend can call the production API endpoint

## Worker Auto Deployment

The Cloudflare Workers API is deployed through GitHub Actions.

### Workflow

- Workflow file: .github/workflows/deploy-worker.yml
- Trigger:
  - Push to main when files under apps/api change
  - Manual workflow dispatch
- Deployment target: sre-lab-api

### Required Secrets

- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

### Deployment Flow

1. Push changes to main
2. GitHub Actions starts the Deploy Worker workflow
3. Install API dependencies
4. Run API syntax check
5. Deploy Cloudflare Worker with wrangler
6. Verify Workers API availability through Grafana Synthetic Monitoring

### Verification

Initial Worker auto deployment was verified successfully.

- Deploy Worker workflow status: succeeded
- API syntax check: passed
- Cloudflare Workers deploy: completed
- Deployment date: 2026-06-14

### Operational Notes

- Do not commit Cloudflare API tokens or account IDs to the repository
- Store deployment secrets only in GitHub Actions Secrets
- Check GitHub Actions after API changes
- Check Grafana Synthetic Monitoring after deployments
- Record deployment-related failures in docs/incidents.md

## API Safety Operations

The Workers API includes safety checks to reduce invalid requests and prepare for future AI API integration.

Operational checks:

- Confirm valid POST returns HTTP 200
- Confirm empty JSON returns 400 / missing_input
- Confirm invalid JSON returns 400 / invalid_json
- Confirm unknown path returns 404 / not_found
- Confirm unsupported method returns 405 / method_not_allowed
- Confirm oversized input returns 413 / input_too_large
- Confirm missing JSON Content-Type returns 415 / unsupported_media_type

Safety controls:

- Request size limit
- Total input length limit
- Content-Type validation
- Standardized error response
- Mock response preserved for valid requests

Follow-up actions:

- Add rate limiting before real AI API integration
- Add usage and cost tracking
- Add cost incident runbook
- Review API safety behavior after each API deployment

## Rate Limiting Operations

Rate limiting will be introduced before real AI API integration.

### Design Decision

- Storage: Cloudflare KV
- Target endpoint: POST /api/moving-assistant
- Initial minute limit: 10 requests / minute / client IP
- Initial daily limit: 50 requests / day / client IP
- Error response: 429 / rate_limited
- Retry header: Retry-After: 60

### Operational Purpose

- Prevent repeated automated POST requests
- Reduce abuse before public AI API usage
- Avoid unexpected AI API cost spikes
- Keep the service safe for low-cost operation

### Operational Checks After Implementation

- Confirm valid requests still return 200
- Confirm more than 10 requests per minute returns 429
- Confirm more than 50 requests per day returns 429
- Confirm Retry-After header is present
- Confirm standardized JSON error response is returned
- Confirm Grafana API monitoring remains healthy
- Record verification results in docs/incidents.md

### Follow-up

Rate limiting must be implemented before connecting OpenAI API, Claude API, or any other paid AI API.


## OpenAI Secret and Model Configuration Operations

This section describes how to manage the OpenAI API key and model configuration.

### Secret Setup

The OpenAI API key must be stored as a Cloudflare Workers Secret.

Command:

```bash
cd apps/api
npx wrangler secret put OPENAI_API_KEY
```

The secret value must not be committed to GitHub or pasted into documentation.

### Model Configuration

The model is configured in wrangler.toml.

Current planned variable:

```toml
[vars]
AI_MODEL = "gpt-4.1-nano"
```

The model value can be changed later without exposing secrets.

### Verification

After setting the secret and model configuration:

1. Confirm wrangler.toml contains AI_MODEL.
2. Confirm OPENAI_API_KEY is configured in Cloudflare Workers secrets.
3. Confirm no API key exists in repository files.
4. Confirm deploy succeeds.
5. Confirm existing mock API behavior remains healthy until real AI integration is implemented.

### Secret Rotation

If the API key is suspected to be exposed:

1. Revoke the exposed OpenAI API key.
2. Create a new OpenAI API key.
3. Update OPENAI_API_KEY using wrangler secret put.
4. Re-deploy the Worker if required.
5. Record the event in docs/incidents.md.

## Cost Operations

Cost operations are required because SRE Lab now calls a real AI API.

The detailed cost policy is documented in docs/cost.md.

### Daily Checks During Initial AI Rollout

- Check Cloudflare KV AI usage counters
- Check Cloudflare KV estimated daily cost
- Check Cloudflare KV estimated monthly cost
- Check OpenAI Platform Usage
- Check OpenAI credit balance
- Confirm auto recharge is off
- Confirm Grafana API check remains healthy

### Weekly Checks

- Review estimated monthly cost trend
- Compare Cloudflare KV estimated cost with OpenAI Platform usage
- Review ai_errors count
- Review ai_limited count
- Decide whether AI daily limits should be adjusted

### Initial Thresholds

| Item | Threshold |
|---|---:|
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily hard limit | 100 JPY |
| Service AI daily limit | 30 requests / day |
| Per-IP AI daily limit | 5 requests / day |

### References

- docs/cost.md
- docs/runbook.md
- docs/incidents.md

## Real AI API Integration Operations

This section defines the operational policy for the first real AI API integration.

### Provider Decision

- Initial provider: OpenAI API
- Initial model class: low-cost mini/nano model
- Claude API: reserved for future Terraform Review AI or AI Incident Summarizer

### Secret Management

The OpenAI API key must be managed as a Cloudflare Workers Secret.

Planned secret:

- OPENAI_API_KEY

The API key must not be committed to GitHub or placed in frontend code.

### Initial Usage Limits

| Item | Initial Value |
|---|---:|
| Monthly budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Service AI diagnoses per day | 20-50 |
| AI diagnoses per IP per day | 5 |
| Timeout | 8 seconds |

### Daily Operation Checks After Implementation

During the initial AI rollout, check the following daily:

- API request count
- AI call count
- AI error count
- Rate limited count
- Estimated daily cost
- Estimated monthly cost
- Grafana API check status
- Whether fallback responses increased

### Deployment Verification After Implementation

After deploying real AI integration:

1. Confirm valid POST returns AI or fallback JSON.
2. Confirm API key is not exposed in frontend.
3. Confirm invalid input still returns standardized errors.
4. Confirm rate limiting still works.
5. Confirm usage counters are recorded.
6. Confirm estimated cost counters are recorded.
7. Confirm timeout returns fallback.
8. Confirm invalid AI response returns fallback.
9. Confirm Grafana API check remains healthy.
10. Record results in docs/incidents.md.

### Rollback Policy

If AI integration causes instability, disable AI API calls and return fallback responses.

Rollback options:

- Disable AI call path in Worker code
- Remove or rotate OPENAI_API_KEY
- Lower AI daily limits
- Lower cost thresholds
- Return mock response until the issue is fixed


## Usage and Cost Tracking Operations

Usage and cost tracking must be introduced before real AI API integration.

### Design Decision

- Initial storage: Cloudflare KV
- Future storage option: Cloudflare D1 or another database
- Monthly budget: 500 JPY
- Monthly warning threshold: 300 JPY
- Monthly stop threshold: 500 JPY
- Daily soft limit: 50 JPY
- Daily hard limit: 100 JPY

### Metrics to Track

API usage:

- API requests
- API successes
- API errors
- Rate limited requests

AI API usage after real AI integration:

- AI API calls
- AI API successes
- AI API errors
- Estimated input tokens
- Estimated output tokens
- Estimated cost in JPY

### Operational Checks After Implementation

- Confirm API request counts are recorded
- Confirm rate limited requests are recorded
- Confirm estimated daily cost is recorded
- Confirm estimated monthly cost is recorded
- Confirm AI API calls stop when the monthly stop threshold is reached
- Confirm cost_limit_reached response is returned
- Record verification results in docs/incidents.md

### Review Cadence

- Daily during initial AI API rollout
- Weekly after stable operation
- Monthly when reviewing revenue and cost balance


## Incident Response Flow

1. Receive alert
2. Check Grafana alert details
3. Check Cloudflare Pages deployment status
4. Check recent GitHub commits
5. Identify root cause
6. Mitigate the issue
7. Record the incident in docs/incidents.md
8. Update runbook if needed

## Cost Control

Current expected monthly cost:

- GitHub: Free
- Cloudflare Pages: Free
- Grafana Cloud: Free tier
- Domain: Not used yet
- AI API: Not used yet

Cost review should be performed before introducing paid services such as AI APIs, custom domains, or external monitoring tools.

## Reliability Targets

Initial reliability targets:

- Availability target: 99.0%
- Expected HTTP status: 200
- Primary probe location: Tokyo, JP
- Alert pending period: 2m

These targets may be updated as the project grows.\n\n## Daily Usage / Cost Snapshot\n\nDuring the initial AI rollout, create a manual usage and cost snapshot.\n\n### Checklist\n\n- Check API usage counters in Cloudflare KV\n- Check AI usage counters in Cloudflare KV\n- Check estimated token usage in Cloudflare KV\n- Check estimated daily cost in Cloudflare KV\n- Check estimated monthly cost in Cloudflare KV\n- Check OpenAI Platform usage\n- Check OpenAI credit balance\n- Confirm auto recharge is off\n- Record results in docs/usage-cost-report.md\n\n### Status Classification\n\n| Status | Meaning |\n|---|---|\n| normal | Usage and cost are within expected range |\n| warning | Usage or cost is approaching threshold |\n| action required | Limit reached, error spike, or unexpected cost increase |\n\n### Related Documents\n\n- docs/cost.md\n- docs/usage-cost-report.md\n- docs/incidents.md\n\n

## OpenAI Usage Recheck Policy

Cloudflare KV is the primary source for immediate SRE Lab usage and cost monitoring.

OpenAI Platform Usage should be used for later reconciliation, not as the only real-time source of truth.

### When OpenAI Usage Shows 0

If OpenAI Platform Usage shows 0 requests, 0 tokens, and $0.00 while the Worker has returned aiStatus: generated, do not immediately treat it as an incident.

Check the following:

- OpenAI Platform project selector
- Usage group or project filter
- API key project
- Usage date range
- Billing credit balance
- Whether usage reporting may be delayed

### Operational Decision

- Use Cloudflare KV values for immediate cost guard decisions
- Use OpenAI Platform Usage for later reconciliation
- Record mismatches in docs/usage-cost-report.md
- Create an operational record if the mismatch persists or affects budget decisions

### Related Documents

- docs/cost.md
- docs/usage-cost-report.md
- docs/incidents.md

## Future Dashboard Operations

A future usage and cost dashboard is planned after manual usage and cost snapshots become repetitive or after additional services are added.

Until then, Cloudflare KV and docs/usage-cost-report.md remain the operational source for usage and cost review.

### Dashboard Design

- docs/dashboard-design.md

### Dashboard Should Show

- API requests
- API success and error counts
- AI calls
- AI success and error counts
- AI limited count
- Estimated daily cost
- Estimated monthly cost
- Monthly cost usage ratio
- Recent operational notes

### When to Implement

Do not implement a dashboard too early.

Consider implementation when one of the following is true:

- Manual snapshots become repetitive
- AI Moving Assistant receives regular external usage
- A second service is added
- Monthly cost becomes non-trivial
- Portfolio presentation would benefit from a visual dashboard

## Phase 7 Usage / Cost Monitoring Summary

Phase 7 introduced usage and cost monitoring operations for AI Moving Assistant.

### Completed Items

- Usage and cost snapshot procedure
- Initial usage and cost snapshot
- Cloudflare KV as the primary operational source
- OpenAI Platform Usage as a secondary reconciliation source
- OpenAI Usage recheck policy
- Future usage/cost dashboard design
- README and documentation update

### Current Operating Model

| Area | Current Approach |
|---|---|
| Immediate usage monitoring | Cloudflare KV |
| Immediate estimated cost monitoring | Cloudflare KV |
| Actual usage reconciliation | OpenAI Platform Usage |
| Manual reporting | docs/usage-cost-report.md |
| Dashboard design | docs/dashboard-design.md |

### Next Phase

The next phase is Phase 8: Second Service.

The recommended second service is AWS Cost Simulator because it aligns with AWS, Terraform, SRE cost awareness, and portfolio storytelling.

## Phase 8 Second Service Operations Plan

Phase 8 starts the second service in SRE Lab.

The selected candidate is AWS Cost Simulator.

Initial operation policy:

- Start with deterministic calculation
- Do not introduce AI API dependency in the MVP
- Reuse the API safety baseline from AI Moving Assistant
- Add synthetic monitoring after endpoint implementation
- Add operational records for each milestone
- Keep the service small enough to operate continuously

Related document:

- docs/aws-cost-simulator.md

## Dedicated Service Page Operations Policy

As SRE Lab adds more services, each service should have a dedicated frontend page and API endpoint.

The top page should remain a service directory and portfolio entry point.

Operational benefits:

- Easier service ownership explanation
- Easier frontend monitoring by page
- Easier API monitoring by endpoint
- Cleaner portfolio storytelling
- Lower risk of confusing unrelated user flows

Initial dedicated pages:

| Service | Page | API Endpoint |
|---|---|---|
| AI Moving Assistant | moving-assistant.html | POST /api/moving-assistant |
| AWS Cost Simulator | aws-cost-simulator.html | POST /api/aws-cost-simulator |

Related document:

- docs/frontend-navigation.md

## AWS Cost Simulator Operations

AWS Cost Simulator is the second service in SRE Lab.

### Production URL

Frontend page:

https://sre-lab.pages.dev/aws-cost-simulator.html

API endpoint:

POST https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator

### Daily Check

Run the following production API check:

curl -i -X POST \
  https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator \
  -H "Content-Type: application/json" \
  -d '{
    "region": "ap-northeast-1",
    "ec2InstanceType": "t3.micro",
    "ec2InstanceCount": 1,
    "ec2HoursPerMonth": 730,
    "ebsGb": 30,
    "s3Gb": 10,
    "dataTransferGb": 10
  }'

Expected result:

HTTP/2 200
mode: deterministic

### Error Validation Checks

Invalid region:

HTTP/2 400
code: invalid_input

Invalid EC2 instance type:

HTTP/2 400
code: invalid_input

Out-of-range numeric input:

HTTP/2 400
code: invalid_input

### Monitoring

Grafana Synthetic Monitoring should include a dedicated POST check for AWS Cost Simulator.

Recommended check name:

sre-lab-aws-cost-simulator-api

Recommended alert rule name:

sre-lab-aws-cost-simulator-api-down

Recommended probe:

Tokyo, JP

Recommended frequency:

60s

Expected status:

2xx

### Runbook

Use the main runbook for first response:

docs/runbook.md

If AWS Cost Simulator API is down but Moving Assistant is healthy, investigate AWS Cost Simulator route handling, validation logic, and deterministic calculation changes first.
