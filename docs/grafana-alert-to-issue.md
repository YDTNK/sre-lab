# Grafana Alert to GitHub Issue Setup

## Purpose

This document defines the setup plan for turning Grafana alerts into GitHub Issues for SRE Lab operations.

The goal is to move toward the AI organization operating model:

```text
Grafana alert
↓
GitHub Issue
↓
AI / Codex investigation
↓
PR or runbook update
↓
Completion report
```

## Current Status

This is not fully automated yet.

Repository-side preparation is safe and can be tracked here, but Grafana Contact point configuration must be completed in the Grafana UI or through a secure automation path.

## Recommended Approach

Use an automation bridge instead of sending Grafana directly to GitHub with a token exposed in Grafana configuration.

Recommended options:

1. Grafana Webhook → small Cloudflare Worker → GitHub Issue
2. Grafana Webhook → GitHub Actions repository_dispatch → GitHub Issue
3. Grafana Email alert → manual/AI-assisted triage, as fallback

For SRE Lab, the preferred future design is:

```text
Grafana Webhook
↓
Cloudflare Worker endpoint
↓
GitHub REST API creates Issue
↓
Issue uses ops or bug template structure
```

## Why Use a Bridge

A bridge allows:

- token storage outside repository code
- input validation
- rate limiting
- event formatting
- safer handling of repeated alerts
- future deduplication logic

## Required External Settings

The following must not be committed to the repository:

- GitHub token
- Grafana webhook secret
- Cloudflare Worker secret values
- any private alert payload containing sensitive information

## Suggested GitHub Issue Format

Generated Issues should use this structure:

```markdown
# Grafana Alert: <alert name>

## Status

<status>

## Alert labels

- service:
- severity:
- source:

## Summary

<short summary from Grafana payload>

## Affected target

<URL or service>

## Service state check

- [ ] active
- [ ] degraded
- [ ] deprecated
- [ ] removed
- [ ] replaced
- [ ] unknown

## First response checklist

- [ ] Read AGENTS.md
- [ ] Check docs/service-state-checklist.md
- [ ] Check docs/runbook.md
- [ ] Check latest docs/incidents/
- [ ] Confirm whether this is active service failure or stale monitoring
- [ ] Record findings

## Links

- Grafana alert:
- Runbook:
```

## Alert Routing Rules

Only active services should create operational Issues by default.

Current active services:

- SRE Lab frontend
- AI Moving Assistant API

Removed services:

- AWS Cost Simulator

If a removed service alert appears, it should create a stale-monitoring cleanup Issue, not a service recovery Issue.

## Minimal Implementation Plan

### Phase 1: Documentation and manual workflow

- [x] Create this setup guide
- [x] Track setup in GitHub Issue #17
- [ ] Keep Grafana Email alert as fallback

### Phase 2: Bridge design

- [ ] Decide Cloudflare Worker or GitHub Actions repository_dispatch
- [ ] Define payload fields
- [ ] Define deduplication behavior
- [ ] Define token storage location

### Phase 3: Secure implementation

- [ ] Create bridge endpoint
- [ ] Store secrets securely
- [ ] Validate Grafana payload
- [ ] Create GitHub Issue with labels
- [ ] Test with a non-production alert

### Phase 4: Operations

- [ ] Document how to pause the integration
- [ ] Document how to handle duplicate Issues
- [ ] Document escalation and close rules

## Do Not Do Yet

Do not build this in a way that delays the first revenue release before CKA.

Do not commit secrets.

Do not restore AWS Cost Simulator as an active service.
