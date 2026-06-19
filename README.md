# SRE Lab

## AI Startup Entry

AIがSRE Lab関連の質問・レビュー・実装判断を行う場合、最初に以下を確認してください。

```text
START_HERE_FOR_AI.md
AGENTS.md
docs/mandatory-context-registry.md
```

SRE Labは2リポジトリ構成です。

```text
YDTNK/sre-lab
= implementation repository

YDTNK/engineering-career-hq
= project management / roadmap / memory repository
```

片方だけを確認して、SRE Labの状態確認完了とは判断しないでください。

管理側の正本:

```text
YDTNK/engineering-career-hq/projects/sre-lab/status.md
YDTNK/engineering-career-hq/projects/sre-lab/project-context.md
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
YDTNK/engineering-career-hq/projects/sre-lab/progress.md
```

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

## Current State

```text
Current direction: SRE portfolio-first
Current active target: Reliability Demo API MVP
Stopped route: Digital Product LP / revenue-first route
Tracking Issue: #74
```

Issue #74:

```text
https://github.com/YDTNK/sre-lab/issues/74
```

## Target MVP

```text
Reliability Demo API
```

Planned initial endpoints:

```text
/api/health
/api/slow
/api/error
/api/fallback
/api/status
```

The MVP endpoints are implemented by the Cloudflare Workers API:

| Endpoint | Behavior |
|---|---|
| `GET /api/health` | Returns HTTP 200 with `status: healthy` |
| `GET /api/slow?delayMs=1000` | Returns HTTP 200 after a controlled delay; values are clamped to 0-5000 ms |
| `GET /api/error` | Returns a controlled HTTP 500 using the standard JSON error format |
| `GET /api/fallback` | Returns HTTP 200 with deterministic fallback mode active |
| `GET /api/status` | Returns HTTP 200 with service state and available demo endpoints |

Existing `/api/moving-assistant` and `/api/grafana-alert` behavior remains available.

The first MVP should demonstrate:

```text
- healthy response
- intentional latency
- intentional 5xx
- timeout/fallback behavior
- status endpoint
- monitoring target
- alert/runbook/incident/postmortem flow
```

## What Is Preserved From The Existing Repository

The previous Moving Prep / revenue work is no longer the active direction, but the operational assets remain valuable.

Preserve and adapt:

```text
- AI startup / cross-repository context rules
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

These may be changed as the Reliability Demo API replaces the old surface.

```text
SRE Lab frontend: https://sre-lab.pages.dev/
Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
```

## Next Work Order

```text
1. Finish source-of-truth pivot documentation.
2. Close/supersede stale revenue and Moving Prep work.
3. Update CI guardrails away from Moving Assistant assumptions.
4. Create Codex-ready Issue for Reliability Demo API MVP.
5. Implement Reliability Demo API.
6. Add SLO, runbook, incident, postmortem, and portfolio pages around it.
```

## Interview Positioning

SRE Lab should be explainable as:

```text
A small public Web/API portfolio that demonstrates SLOs, monitoring, alerting, CI/CD, incident response, runbooks, postmortems, API safety, and cost guardrails using GitHub, Cloudflare, and Grafana.
```

This is the core portfolio value. New app features should be added only when they strengthen that explanation.
