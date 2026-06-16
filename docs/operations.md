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
- Review whether active monitors still match `docs/services.md`

## Deployment Checks

Before deployment:

- Confirm GitHub Actions passes
- Confirm landing page files exist
- Confirm README and docs are updated when operational behavior changes
- Confirm the change does not reintroduce removed services unless intentionally approved

After deployment:

- Confirm Cloudflare Pages deployment succeeded
- Confirm https://sre-lab.pages.dev/ returns HTTP 200
- Confirm Grafana uptime checks for landing page and API remain healthy

## Service State Gate

Before responding to a 404 alert, missing endpoint, missing page, or stale monitor, classify the target using `docs/service-state-checklist.md`.

Required checks:

1. Check `README.md` for current project status.
2. Check `docs/services.md` for active, removed, future, and internal services.
3. Check `docs/service-state-checklist.md` for the decision flow.
4. Check recent records under `docs/incidents/`.
5. Check implementation files only after service state is known.

Do not restore a removed or deprecated endpoint only because a monitor is failing.

If a removed service is still monitored, treat the event as a stale monitor or service-state mismatch.

## API Operations

The AI Moving Assistant API is operated as a Cloudflare Workers endpoint.

Operational checks:

- Confirm Worker deployment status
- Confirm POST /api/moving-assistant returns HTTP 200
- Confirm Grafana API synthetic check is healthy
- Confirm API alert rule is normal
- Confirm frontend can call the production API endpoint
- Confirm the monitored endpoint is still active before restoring it

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
- Record deployment-related failures under `docs/incidents/`

## API Safety Operations

The Workers API includes safety checks to reduce invalid requests and keep the public fallback API safe.

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
- Deterministic fallback response preserved for valid requests

Follow-up actions:

- Review API safety behavior after each API deployment
- Do not add new SRE Lab API features during the Phase 16 stop checkpoint
- Confirm unknown-path checks do not accidentally target removed services as if they were active

## Incident Response Flow

1. Receive alert.
2. Check Grafana alert details.
3. Apply the Service State Gate.
4. Check Cloudflare Pages or Workers deployment status.
5. Check recent GitHub commits.
6. Identify whether the issue is a real service failure, stale monitor, removed endpoint, or replaced service.
7. Mitigate the issue.
8. Record new incidents under `docs/incidents/`.
9. Update runbook or service checklist if needed.

## Documentation Safety Rule

New operational records should normally be created as separate files under:

```text
docs/incidents/
```

Avoid rewriting the large aggregate file:

```text
docs/incidents.md
```

Only update `docs/incidents.md` when the full current content is safely loaded and the change is small and verified.

## Cost Control

Current expected monthly cost:

- GitHub: Free
- Cloudflare Pages: Free
- Grafana Cloud: Free tier
- Domain: Not used yet
- AI API: Not active in the current production path

Cost review should be performed before re-enabling paid AI usage or introducing paid services such as custom domains or external monitoring tools.

## Reliability Targets

Initial reliability targets:

- Availability target: 99.0%
- Expected HTTP status: 200
- Primary probe location: Tokyo, JP
- Alert pending period: 2m

These targets may be updated if SRE Lab resumes.

## Usage / Cost Snapshot

During the Phase 16 stop checkpoint, update usage and cost records monthly or when an event occurs.

### Checklist

- Check the docs-based Revenue / Cost Dashboard in the management repository
- Check API usage counters in Cloudflare KV if they are needed for the event being reviewed
- Check AI usage and estimated cost counters only if paid AI usage was intentionally re-enabled
- Check OpenAI Platform usage only when reconciling paid AI usage
- Confirm auto recharge is off
- Record results in docs/usage-cost-report.md or the management dashboard

### Status Classification

| Status | Meaning |
|---|---|
| normal | Usage and cost are within expected range |
| warning | Usage or cost is approaching threshold |
| action required | Limit reached, error spike, or unexpected cost increase |

### Related Documents

- docs/cost.md
- docs/usage-cost-report.md
- docs/incidents.md
- docs/service-state-checklist.md
