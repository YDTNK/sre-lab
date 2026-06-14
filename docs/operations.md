# Operations Guide

This document defines the basic operational workflow for SRE Lab.

## Daily Checks

- Check Cloudflare Pages deployment status
- Check Grafana Synthetic Monitoring status
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
- Confirm Grafana uptime check remains healthy

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
