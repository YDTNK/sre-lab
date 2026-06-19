# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

## Project Purpose

SRE Lab is an SRE / Platform Engineer portfolio project.

The goal is not to build a consumer AI service collection or a revenue-first product site. The goal is to operate small public Web/API services in a way that demonstrates production-oriented SRE practices.

SRE Lab should show:

```text
- SLO / SLI
- Monitoring
- Alerting
- CI/CD
- Incident response
- Runbook
- Postmortem
- API safety
- Cost guardrails
- GitHub Issue / PR based operations
```

## AI-Assisted Workflow

This project uses AI-assisted development for design review, implementation support, documentation consistency checks, and operational workflow improvement.

Public portfolio documentation and private maintainer context are intentionally managed separately. This README describes the externally reviewable portfolio. Maintainer-only planning notes, roadmap details, and decision logs are not part of the public portfolio surface.

## Current State

```text
Current direction: SRE portfolio-first
Current active target: Reliability Demo API operational loop
MVP implementation: completed by PR #78
Stopped route: Digital Product LP / revenue-first route
Current follow-up Issue: #81
```

## Reliability Demo API

```text
Production base URL:
https://sre-lab-api.daisan-tanaka.workers.dev
```

Implemented endpoints:

| Endpoint | Behavior |
|---|---|
| `GET /api/health` | Returns HTTP 200 with `status: healthy` |
| `GET /api/slow?delayMs=1000` | Returns HTTP 200 after a controlled delay; values are clamped to 0-5000 ms |
| `GET /api/error` | Returns a controlled HTTP 500 using the standard JSON error format |
| `GET /api/fallback` | Returns HTTP 200 with deterministic fallback mode active |
| `GET /api/status` | Returns HTTP 200 with service state and available demo endpoints |

Existing `/api/moving-assistant` and `/api/grafana-alert` behavior remains available.

## Operational Evidence

Current operational evidence:

```text
docs/slo/reliability-demo-api.md
docs/runbook.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
```

## What Is Preserved From The Existing Repository

The previous Moving Prep / revenue work is no longer the active direction, but the operational assets remain valuable.

Preserve and adapt:

```text
- Issue-first workflow
- Codex-ready Issue workflow
- GitHub Actions CI/CD
- Cloudflare Worker deploy workflow
- Grafana alert to GitHub Issue flow
- Grafana dedupe logic
- Runbook structure
- Incident and postmortem records
- Completion report template
- Service State Gate
- CI guardrails
```

## Stopped Active Work

Do not continue these as active work:

```text
- Digital Product LP Starter Kit
- /products/digital-product-lp-starter-kit
- Stripe CTA connection
- Moving Prep Board paid PDF
- Moving Prep Board monetization expansion
- Consumer AI service expansion
- Revenue-first market research route
```

Historical records may remain for context, but they must not drive active implementation.

## Current Technology Stack

| Area | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| CI/CD | GitHub Actions, Wrangler |
| Monitoring | Grafana Cloud Synthetic Monitoring |
| Alerting | Grafana Alerting |
| Incident intake | Grafana alert → Cloudflare Worker → GitHub Issue |
| Documentation | Markdown |
| Repository | GitHub |

## Current Public URLs

```text
SRE Lab frontend: https://sre-lab.pages.dev/
Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
```

## Next Work Order

```text
1. Confirm or update Grafana Synthetic Monitoring targets to /api/health and /api/status.
2. Confirm alert rules for health failure and latency degradation.
3. Add a dashboard or portfolio page section that exposes SLO, incidents, runbooks, and API endpoints.
4. Run a small game day: intentionally check /api/error and document the expected response flow.
5. Create a real postmortem only when an actual unexpected failure occurs.
6. After the Reliability Demo API operational loop is complete, consider Cloud Cost Guardrail Demo.
```

## Interview Positioning

SRE Lab should be explainable as:

```text
A small public Web/API portfolio that demonstrates SLOs, monitoring, alerting, CI/CD, incident response, runbooks, postmortems, API safety, and cost guardrails using GitHub, Cloudflare, and Grafana.
```

This is the core portfolio value. New app features should be added only when they strengthen that explanation.
