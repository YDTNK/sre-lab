# Services

This document describes the active and historical service direction for SRE Lab.

## Current Status

```text
Current direction: SRE portfolio-first
Current active target: Reliability Demo API MVP
Tracking Issue: #74
```

## Service Selection Policy

SRE Lab services should be selected for SRE portfolio value first.

A service is a good fit when it can demonstrate:

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

## Active Target Service: Reliability Demo API

### Overview

Reliability Demo API is the first target service for the SRE portfolio direction.

It is intentionally designed to make reliability behavior visible and testable.

### Planned Endpoints

```text
/api/health
/api/slow
/api/error
/api/fallback
/api/status
```

### Purpose

Reliability Demo API should demonstrate:

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

### MVP Completion Criteria

The MVP is complete when:

- endpoints are implemented
- CI passes
- smoke tests exist
- SLO document exists
- runbooks exist for latency, 5xx, fallback, and deploy failure
- at least one sample incident or game-day record exists
- portfolio README and architecture page point to Reliability Demo API

## Planned Future Services

These are not active until Reliability Demo API has a complete operational loop.

### Cloud Cost Guardrail Demo

Purpose:

- show API usage limits
- show cost thresholds
- show budget policy
- show abnormal usage response
- show external API cost guardrails

### SRE Learning Coach

Purpose:

- later AI-dependent service operations demo
- prompt/version/fallback/rate-limit/cost-control example

This should not be built as a generic AI learning app. It should only be added if it strengthens SRE portfolio evidence.

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

- Reliability Demo API
- Architecture
- Reliability / SLO
- Incidents
- Runbooks
- CI/CD
- Security & Cost
- Roadmap

Historical consumer-facing pages should be removed from active navigation after the Reliability Demo API surface is ready.

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
docs/runbook.md
latest records under docs/incidents/
apps/api/src/index.js
apps/landing/
Grafana Synthetic Monitoring target list
```