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
