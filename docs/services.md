# Services

This document describes the active and historical service direction for SRE Lab.

## Current Status

```text
Current direction: SRE portfolio-first
Current active target: Final full-site QA and optional polish
Tracking Issue: #88
Reliability Demo API: implemented / active portfolio demonstration service
```

## Service Selection Policy

SRE Lab services should be selected for SRE portfolio value first.

A service is a good fit when it can demonstrate:

- architecture and dependency boundaries
- SLO / SLI
- monitoring and alerting
- incident response
- runbooks and postmortems
- CI/CD validation
- API safety
- cost guardrails
- GitHub Issue / PR based operations

A service is not a good fit when it mainly requires:

- product sales copy
- SEO/content production
- payment/delivery operations
- consumer AI feature expansion without reliability value
- manual content posting

## Active Service: Reliability Demo API

### Overview

Reliability Demo API is the active service used for the SRE portfolio direction.

It is intentionally designed to make reliability behavior visible and testable.

### Active Endpoints

```text
GET /api/health
GET /api/slow?delayMs=1000
GET /api/error
GET /api/fallback
GET /api/status
```

### Purpose

Reliability Demo API demonstrates:

- healthy response
- intentional latency
- intentional 5xx
- timeout/fallback behavior
- service status
- monitoring target
- alerting path
- runbook and incident response
- postmortem and improvement loop

### SRE / Operations Value

This service can be used to demonstrate:

- Four Golden Signals style monitoring
- SLO / SLI design
- synthetic monitoring
- alert triage
- GitHub Issue based incident intake
- runbook-driven response
- postmortem creation
- CI/CD validation
- rollback / mitigation notes
- API safety validation

### Completion State

```text
Reliability Demo API MVP: implemented
SLO document: implemented
Runbook: implemented
Incident evidence: implemented
Portfolio pages: implemented
Current state: final full-site QA and optional polish
```

## Implemented Portfolio Evidence

```text
Home portfolio surface: implemented
Architecture page: implemented
Reliability page: implemented
Monitoring / Alerting page: implemented
CI/CD page: implemented
Incident / Postmortem page: implemented
Cost Guardrail page: implemented
```

## Current Portfolio Pages

```text
/
/architecture.html
/reliability.html
/monitoring.html
/cicd.html
/incidents.html
/cost.html
```

## Historical Services

### AI Moving Assistant / Moving Prep Board

Status:

```text
historical implementation asset
not active monetization target
```

Historical value:

- Cloudflare Pages frontend
- Cloudflare Workers API
- request validation
- fallback response
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- Incident records
- GitHub Actions CI/CD

Stopped active work:

- paid PDF
- Stripe CTA
- product LP
- Moving Prep Board monetization expansion

Do not restore it as an active product or monetization route unless management-side `status.md` explicitly changes.

### AWS Cost Simulator

Status:

```text
removed historical service
```

Historical value:

- deterministic API design
- cloud cost awareness

Do not restore it as an active service just because stale files, monitors, or references exist.

### Digital Product LP Starter Kit

Status:

```text
stopped / not planned
```

Reason:

```text
The revenue upside was too low relative to LP, content, delivery, SEO, payment, and maintenance effort.
```

Do not implement `/products/digital-product-lp-starter-kit` unless the management-side `status.md` explicitly changes.

## Service Navigation Policy

The frontend should present SRE Lab as an SRE portfolio, not a consumer AI service collection.

Current target navigation should emphasize:

- Home
- Architecture
- Reliability / SLO
- Monitoring / Alerting
- CI/CD
- Incidents / Postmortems
- Cost Guardrails
- GitHub evidence

Historical consumer-facing pages should not be present in active navigation.

## Service State Gate

Before restoring an endpoint, page, monitor, or alert target, classify the target as:

```text
active
planned
degraded
deprecated
removed
replaced
historical
unknown
```

If the target is historical, removed, stopped, or unknown, do not restore it by default.

Check:

```text
README.md
docs/services.md
docs/service-state-checklist.md
docs/runbooks/reliability-demo-api.md
docs/incidents/
apps/api/src/index.js
apps/landing/
Grafana Synthetic Monitoring target list
```
