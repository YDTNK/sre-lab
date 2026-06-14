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

These targets may be updated as the project grows.
