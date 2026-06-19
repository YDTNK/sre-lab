# Operations Guide

This document defines the current operational workflow for SRE Lab as an SRE / Platform Engineering portfolio.

The previous aggregate operations guide mixed current portfolio operations with legacy revenue-route and AI Moving Assistant material. It has been archived under:

```text
docs/archive/legacy-revenue-route/operations.md
```

## Current State

```text
Current direction: SRE portfolio-first
Current active target: Final full-site QA and optional polish
Current active service: Reliability Demo API
Tracking Issue: #88
```

## Daily / Periodic Checks

For the current portfolio state, checks are lightweight and evidence-focused.

```text
- Confirm portfolio site is available.
- Confirm Reliability Demo API health endpoint is available.
- Confirm GitHub Actions are passing for recent changes.
- Confirm public docs do not expose private planning context.
- Confirm implemented behavior and future work are not mixed.
```

## Final Full-Site QA

Current QA target:

```text
Issue #88
```

QA should confirm:

```text
- / loads on PC and mobile.
- /architecture.html loads on PC and mobile.
- /reliability.html loads on PC and mobile.
- /monitoring.html loads on PC and mobile.
- /cicd.html loads on PC and mobile.
- /incidents.html loads on PC and mobile.
- /cost.html loads on PC and mobile.
- Navigation works across all pages.
- Home primary CTA opens Reliability Dashboard.
- Public pages do not expose private management context.
- Future work is clearly labeled as future work.
- Expected demo errors are not mislabeled as real incidents.
- Cost guardrail future items are not overclaimed as implemented runtime behavior.
```

## Deployment Checks

Before deployment:

```text
- Confirm GitHub Actions passes.
- Confirm changed files are within the intended scope.
- Confirm README and docs are updated when operational behavior changes.
```

After deployment:

```text
- Confirm Cloudflare Pages deployment succeeded when frontend changed.
- Confirm Cloudflare Workers deployment succeeded when API changed.
- Run or review smoke tests when API behavior changed.
- Confirm monitored surfaces remain healthy when monitoring is affected.
```

## Reliability Demo API Operations

Active endpoints:

```text
GET /api/health
GET /api/status
GET /api/slow?delayMs=1000
GET /api/error
GET /api/fallback
```

Operational checks:

```text
- Confirm GET /api/health returns HTTP 200.
- Confirm GET /api/status returns HTTP 200 and reports active service state.
- Confirm /api/error is treated as an intentional demo error.
- Confirm /api/slow and /api/fallback are not treated as real incidents when they behave as designed.
```

Active runbook:

```text
docs/runbooks/reliability-demo-api.md
```

## Worker Deployment

The Cloudflare Workers API is deployed through GitHub Actions.

Workflow file:

```text
.github/workflows/deploy-worker.yml
```

Operational notes:

```text
- Do not commit Cloudflare API tokens or account IDs to the repository.
- Store deployment secrets only in GitHub Actions Secrets.
- Check GitHub Actions after API changes.
- Check smoke test results after Worker deployment.
- Record deployment-related failures under docs/incidents/ when appropriate.
```

## Monitoring and Alerting

SRE Lab uses monitoring and alerting as portfolio evidence.

Current monitoring should focus on active portfolio surfaces:

```text
- portfolio site availability
- Reliability Demo API health
- deployment / smoke test outcomes
- Grafana alert to GitHub Issue path when active
```

Do not restore stale monitors for removed or historical services by default.

## Incident Response Flow

```text
Alert or verification failure
↓
Check service state
↓
Confirm whether the target is active, historical, removed, or unknown
↓
Use the active runbook
↓
Mitigate or document expected demo behavior
↓
Create one incident record under docs/incidents/ if criteria are met
↓
Update runbook or docs if response process changed
```

## Cost Operations

Current cost operations are documented in:

```text
docs/cost.md
/cost.html
```

Current cost focus:

```text
- keep the public portfolio low-cost
- avoid runaway usage
- document guardrail decisions
- separate implemented controls from future work
```

Paid AI API usage and revenue-route tracking are not active.

## Current Source of Truth

```text
README.md
docs/services.md
docs/operations.md
docs/runbook.md
docs/runbooks/reliability-demo-api.md
docs/slo/reliability-demo-api.md
docs/cost.md
management-side status.md
management-side portfolio-requirements.md
```

## Historical Material

Legacy revenue-route and previous service-operation material is archived under:

```text
docs/archive/legacy-revenue-route/
```

Treat archive files as historical only unless the management-side `status.md` explicitly reactivates that route.
