# Incident Record Rules

## Purpose

This document defines when and how SRE Lab should create incident records.

Incident records are operational memory. They help future ChatGPT, Codex, and human operators understand what happened, why it happened, what was done, and what should be improved.

## Storage Location

Create new incident records as one file per record under:

```text
docs/incidents/
```

Avoid editing the large aggregate file:

```text
docs/incidents.md
```

unless the full current content is safely loaded and the change is small and verified.

## When To Create An Incident Record

Create an incident record when one or more of these are true:

- an active production service was unavailable
- an active production service was degraded
- a Grafana alert revealed a real operational issue
- a deploy failure affected an active service
- manual recovery or external UI action was required
- a root cause should become operational memory
- a repeated issue needs prevention or follow-up tracking

## When Not To Create An Incident Record

Do not create an incident record for:

- pure test alerts
- duplicate alerts with no new finding
- warning-only GitHub Actions messages
- stale monitoring for a removed service with no production impact
- expected setup failures with no user impact
- tiny documentation-only mistakes

For these, use an Issue comment, runbook update, or stale monitoring cleanup task instead.

## Service State Guardrail

Before creating an incident record, confirm service state using:

- `docs/service-state-checklist.md`
- `docs/services.md`
- `docs/runbook.md`
- latest relevant records under `docs/incidents/`

Important rule:

```text
Do not restore removed services just because an alert fires.
```

AWS Cost Simulator is a removed service. Alerts for that service should normally create stale-monitoring cleanup work, not incident records.

## Naming Rule

Use this filename format:

```text
docs/incidents/YYYYMMDD-NNN-short-title.md
```

Examples:

```text
docs/incidents/20260616-001-worker-deploy-smoke-failure.md
docs/incidents/20260616-002-grafana-api-alert.md
```

Use Japan date for `YYYYMMDD` unless there is a project-specific reason not to.

Increment `NNN` for multiple records on the same date.

## Required Incident Fields

Each incident record should include:

- Incident ID
- Date
- Status
- Severity
- Affected service
- Detection method
- Summary
- Impact
- Timeline
- Root cause
- Mitigation
- Validation
- Follow-up actions
- Linked Issues / PRs
- Lessons learned

## Severity Guide

| Severity | Meaning |
| --- | --- |
| SEV1 | Production service unavailable or severe user impact |
| SEV2 | Production service degraded or important workflow broken |
| SEV3 | Internal operational issue with limited or no user impact |
| SEV4 | Documentation, warning, or follow-up only |

Do not over-classify test alerts or warning-only events as incidents.

## ChatGPT Responsibilities

ChatGPT should:

1. Classify whether an incident record is needed.
2. Check service state before restoration or record creation.
3. Create the incident file when the record is needed.
4. Link related Issues, PRs, workflow runs, alerts, and commits.
5. Create follow-up Issues when prevention work is needed.
6. Avoid asking the user for secret values.
7. Ask for human action only when external UI, credentials, billing, permissions, or risky production decisions are involved.

## Codex Responsibilities

Codex may create or update incident records when assigned a scoped Issue.

Codex must:

- read `AGENTS.md`
- read this document
- keep changes scoped
- avoid rewriting `docs/incidents.md`
- create one incident file under `docs/incidents/`
- include validation and follow-up notes
- open a PR for ChatGPT review

## Standard Incident Template

Use this template for new records:

```markdown
# Incident: <short title>

## Incident ID

<YYYYMMDD-NNN>

## Date

<YYYY-MM-DD JST>

## Status

open | mitigated | resolved | follow-up-only

## Severity

SEV1 | SEV2 | SEV3 | SEV4

## Affected service

<service name>

## Detection method

Grafana alert | GitHub Actions | smoke test | user report | manual check

## Summary

<what happened>

## Impact

<who or what was affected>

## Timeline

- <time JST>: <event>

## Root cause

<known root cause, or unknown>

## Mitigation

<what was done>

## Validation

<how recovery or completion was verified>

## Follow-up actions

- [ ] <action>

## Linked Issues / PRs

- Issue: #
- PR: #

## Lessons learned

<what should be improved>
```

## Completion Rule

After creating an incident record:

1. Link it in the related Issue.
2. Link the fixing PR if one exists.
3. Add follow-up tasks if prevention work remains.
4. Close the source Issue only when mitigation, documentation, and required follow-up links are complete.
