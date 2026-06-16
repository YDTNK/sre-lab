# Architecture

This document describes the current SRE Lab architecture.

## Current Status

```text
Stopped at Phase 16 v1 checkpoint
```

SRE Lab currently keeps one active consumer-facing service running and stops new feature expansion for now.

## Overview

SRE Lab is a small service platform for building, operating, monitoring, and improving AI-powered micro services.

The current active service is AI Moving Assistant, a Japanese moving preparation assistant.

AWS Cost Simulator was removed from the active service portfolio and is now historical context only.

## Current Architecture

```mermaid
flowchart TD
    U[User] --> P[Cloudflare Pages<br/>SRE Lab Frontend]
    P --> F[AI Moving Assistant<br/>Japanese Form UI]
    F --> W[Cloudflare Workers API<br/>POST /api/moving-assistant]
    W --> M[Deterministic Fallback Response<br/>Moving Checklist JSON]
    F --> S[Free Moving Checklist Sample<br/>moving-checklist-sample.html]
    W -. Inactive code path / future only .-> AI[OpenAI API]

    G[Grafana Synthetic Monitoring] --> P
    G --> W

    G --> A[Grafana Alerting]
    A --> E[Email Notification]
    A --> R[Runbook<br/>docs/runbook.md]
    A --> I[Incident Log<br/>docs/incidents.md]

    CI[GitHub Actions CI] --> P
    CI --> W
```

## Components

### Cloudflare Pages

Cloudflare Pages hosts the static frontend.

- URL: https://sre-lab.pages.dev/
- App path: apps/landing
- Main file: apps/landing/index.html
- Style file: apps/landing/styles.css

Active pages:

- apps/landing/index.html
- apps/landing/moving-assistant.html
- apps/landing/moving-checklist-sample.html

### AI Moving Assistant Frontend

The frontend provides a Japanese input form for moving preparation.

Current production behavior:

- Collects moving-related user inputs
- Validates empty input
- Calls the production Workers API
- Displays the API response
- Shows a clickable free sample CTA
- Links to the static free moving checklist sample page

### Cloudflare Workers API

Cloudflare Workers provides the backend API layer.

- API URL: https://sre-lab-api.daisan-tanaka.workers.dev
- Endpoint: POST /api/moving-assistant
- App path: apps/api
- Main file: apps/api/src/index.js

Current behavior:

- Validates JSON input
- Rejects empty requests
- Applies safety controls and rate limiting
- Returns fallback moving checklist response

Inactive / future behavior only if SRE Lab resumes:

- Call an AI API through the Worker
- Keep AI API keys out of frontend code
- Add stronger timeout handling
- Add stronger cost controls
- Add implementation-backed tracking only when needed

### Free Sample CTA

The free sample CTA is the current lightweight conversion point.

```text
AI Moving Assistant result page
↓
Free sample CTA click
↓
moving-checklist-sample.html visit
```

There is currently no payment flow, affiliate flow, email collection, or personal information collection.

### Grafana Synthetic Monitoring

Grafana monitors both the frontend and API.

Landing page check:

- Target: https://sre-lab.pages.dev/
- Type: HTTP uptime check
- Probe: Tokyo, JP
- Frequency: 60s

API check:

- Target: https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant
- Type: HTTP API endpoint check
- Method: POST
- Probe: Tokyo, JP
- Frequency: 60s

### Alerting

Grafana Alerting is configured for both frontend and API checks.

Alert rules:

- sre-lab-uptime-down
- sre-lab-api-down

Notification:

- Contact point: sre-lab-email

### Operations Documents

Operational documents:

- Runbook: docs/runbook.md
- Incident log: docs/incidents.md
- Operations guide: docs/operations.md
- AI API design: docs/ai-api-design.md

Management documents:

- YDTNK/engineering-career-hq/projects/sre-lab/revenue-cost-dashboard.md
- YDTNK/engineering-career-hq/projects/sre-lab/progress.md
- YDTNK/engineering-career-hq/projects/sre-lab/daily-log.md

## Reliability Flow

```mermaid
flowchart LR
    D[Deployment] --> C[GitHub Actions CI]
    C --> CF[Cloudflare Pages / Workers]
    CF --> S[Grafana Synthetic Monitoring]
    S --> AL[Grafana Alerting]
    AL --> N[Email Notification]
    N --> RB[Runbook]
    RB --> IL[Incident Log]
    IL --> IMP[Follow-up Improvements]
```

## Current Scope

Current production scope:

- Static frontend
- Workers fallback API
- Deterministic fallback response for AI Moving Assistant
- Frontend to API connection
- Free moving checklist sample page
- Synthetic monitoring
- Alerting
- Runbook
- Incident log
- GitHub Actions CI
- Workers auto-deploy
- Rate limiting
- API safety controls
- Docs-based Revenue / Cost Dashboard in management repository

Not currently active:

- Real AI API active usage
- Payment flow
- Affiliate flow
- Email collection
- Personal information collection
- Implementation-backed conversion tracking
- Custom domain

## Stop Policy

- Do not add new SRE Lab features for now
- Do not start Phase 17 until a real revenue route exists
- Move active learning focus to Kubernetes / CKA preparation
