# Grafana Alert to GitHub Issue

## Purpose

This document describes how Grafana alerts are routed to GitHub Issues for SRE Lab operations.

## Current Status

Implemented path:

```text
Grafana Contact point
↓
Cloudflare Worker `/api/grafana-alert`
↓
GitHub Issue
```

Verified result:

- Grafana test alert created GitHub Issue `#20`.
- Test Issue `#20` was closed as completed.

Current remaining gaps:

- AI investigation is not triggered automatically when a Grafana-created Issue appears.
- PR/runbook updates after an alert still require a user prompt or manual AI invocation.
- Incident record creation is not yet automatic.

## Implemented Design

SRE Lab uses this path:

```text
Grafana Webhook
↓
Cloudflare Worker endpoint
↓
GitHub REST API creates or updates Issue
↓
Issue becomes the investigation entry point
```

Endpoint:

```text
POST /api/grafana-alert
```

Security:

```text
X-Grafana-Webhook-Secret
```

Required Worker secrets:

```text
GRAFANA_WEBHOOK_SECRET
GITHUB_ISSUE_TOKEN
GITHUB_REPO
```

## Duplicate Issue Handling

Grafana notifications are deduplicated before creating new Issues.

Dedupe key format:

```text
grafana:<service_name>:<alertname>:<status>
```

The Worker builds the key from:

- `service_name`, `service`, or `job` label
- `alertname`
- payload `status`

If an open Issue already exists with the same dedupe key and the `grafana-alert` label:

```text
No new Issue is created.
A comment is added to the existing Issue.
The Worker returns the existing Issue number and URL.
```

If no matching open Issue exists:

```text
A new Issue is created with labels: ops, grafana-alert.
```

The dedupe key is written into the Issue body so future notifications can find it through GitHub Issue search.

## Alert Routing Rules

Only active services should create operational Issues by default.

Current active services:

- SRE Lab frontend
- AI Moving Assistant API

Current active service labels:

```text
service_name = sre-lab
service_name = sre-lab-api
```

Removed services:

- AWS Cost Simulator

If a removed service alert appears, it should create a stale-monitoring cleanup Issue, not a service recovery Issue.

## Triage and Remediation Flow

When a Grafana-created Issue appears, use this operating flow.

```text
Grafana-created Issue
↓
Classify alert
↓
Check service state
↓
Decide response type
↓
Investigate or close
↓
Create PR/runbook/incident record if needed
↓
Close Issue with completion note
```

### Step 1: Classify the alert

Classify the Issue as one of:

- active service failure
- degraded active service
- stale monitoring for removed service
- duplicate alert
- test alert
- false positive
- unknown

### Step 2: Check service state

Before attempting recovery, check:

- `docs/service-state-checklist.md`
- `docs/services.md`
- `docs/runbook.md`
- latest records under `docs/incidents/`

Important rule:

```text
Do not restore removed services just because an alert fires.
```

### Step 3: Decide response type

Use this decision table:

| Alert type | Default action |
| --- | --- |
| Active service down | Investigate, then create fix PR or incident record |
| Active service degraded | Investigate, document findings, create PR if needed |
| Removed service alert | Create stale monitoring cleanup task |
| Duplicate alert | Link to existing open Issue and close duplicate |
| Test alert | Confirm integration and close as completed |
| False positive | Record reason and close as not planned or completed |
| Unknown | Ask for user direction only after safe repository checks |

### Step 4: AI investigation checklist

For active service alerts, ChatGPT/Codex should inspect:

- latest Issue body and labels
- affected service label
- related docs and runbooks
- recent PRs and deployment notes
- Cloudflare Worker / Pages routing assumptions
- smoke test script behavior
- whether the service is active, removed, or deprecated

If repository-side remediation is safe, create a branch and PR.

If external UI, credentials, billing, production-impacting code, or ambiguous recovery is involved, prepare findings and request user approval.

### Step 5: PR / runbook / incident record rules

Create a PR when:

- documentation is missing or outdated
- runbook needs clarification
- smoke test coverage should be improved
- stale monitoring documentation needs cleanup
- a small safe code/config fix is clearly scoped and approved

Create an incident record when:

- an active customer-facing service was unavailable or degraded
- a monitoring alert revealed a real operational issue
- manual intervention was required
- the root cause or remediation should become operational memory

Do not create an incident record for:

- pure contact point tests
- known duplicate alerts
- removed service stale alerts with no production impact

### Step 6: Close rules

Close the Grafana-created Issue after one of the following is true:

- test alert was verified
- duplicate was linked to the primary Issue
- false positive reason was recorded
- stale monitoring cleanup task was created or completed
- fix PR was merged and verified
- incident record was created when needed

The closing comment should include:

- classification
- action taken
- validation result
- linked PR, runbook update, or incident record if relevant

## Minimal Implementation Plan

### Phase 1: Documentation and manual workflow

- [x] Create this setup guide
- [x] Track setup in GitHub Issue #17
- [x] Keep Grafana Email alert as fallback

### Phase 2: Bridge design

- [x] Decide Cloudflare Worker or GitHub Actions repository_dispatch
- [x] Define payload fields
- [x] Define deduplication behavior
- [x] Define token storage location

### Phase 3: Secure implementation

- [x] Create bridge endpoint
- [x] Store secrets securely
- [x] Validate Grafana payload
- [x] Create GitHub Issue with labels
- [x] Test with a non-production alert

### Phase 4: Operations

- [x] Document how to pause the integration
- [x] Document how to handle duplicate Issues
- [x] Document escalation and close rules
- [x] Document alert Issue triage and remediation flow

## How to Pause the Integration

Use one of these safe options:

1. Disable or mute the Grafana notification policy route.
2. Remove the webhook contact point from active notification policy routes.
3. Rotate `GRAFANA_WEBHOOK_SECRET` in Cloudflare and do not update Grafana until ready.

Do not delete repository code as the first response unless the integration itself is unsafe.

## Do Not Do Yet

Do not build this in a way that delays the first revenue release before CKA.

Do not commit secrets.

Do not restore AWS Cost Simulator as an active service.
