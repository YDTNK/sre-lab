# Grafana Issue AI Investigation Workflow

## Purpose

This document defines how ChatGPT and Codex should handle GitHub Issues created by Grafana alerts.

It connects this flow:

```text
Grafana Issue
↓
AI investigation
↓
PR / runbook / incident record
↓
Issue close
```

## Entry Point

Use this workflow when a GitHub Issue was created from a Grafana alert webhook.

The Issue should contain alert status, labels, service state checklist, first response checklist, and Grafana links.

## ChatGPT Responsibilities

ChatGPT acts as PM, triage owner, reviewer, and GitHub operator.

ChatGPT should:

1. Read the Grafana-created Issue.
2. Read `AGENTS.md` and required operating docs.
3. Classify the alert.
4. Confirm service state before restoring anything.
5. Decide whether Codex is needed.
6. Create a Codex task if implementation is required.
7. Create documentation/runbook/incident PRs when safe.
8. Ask for human action only when secrets, UI, billing, permissions, or risky production changes are involved.
9. Close the Issue only after the required action is complete or the alert is classified as no action needed.

## Required Reading

Before investigating, read:

- `AGENTS.md`
- `docs/service-state-checklist.md`
- `docs/services.md`
- `docs/runbook.md`
- `docs/grafana-alert-to-issue.md`
- `docs/deploy-failure-investigation.md`
- latest relevant records under `docs/incidents/`

## Alert Classification

Classify the Issue as one of:

- active service failure
- degraded active service
- stale monitoring for removed service
- duplicate alert
- test alert
- false positive
- unknown

## Service State Rule

Before restoring any endpoint, page, monitor, or alert target, confirm service state.

```text
Do not restore removed services just because an alert fires.
```

AWS Cost Simulator is a removed service. Alerts or references for it should become stale monitoring cleanup work, not service recovery work.

## Investigation Flow

```text
Grafana-created Issue
↓
Read Issue body and labels
↓
Classify alert
↓
Check service state
↓
Inspect related docs, recent PRs, deploy status, and smoke tests
↓
Choose action type
↓
Create PR / Codex task / incident record / close comment
```

## Action Types

| Classification | Default action |
| --- | --- |
| active service failure | Investigate service and create fix PR or incident record |
| degraded active service | Investigate, document findings, create PR if needed |
| stale monitoring for removed service | Create stale monitoring cleanup task |
| duplicate alert | Link to existing Issue and close duplicate |
| test alert | Confirm integration and close as completed |
| false positive | Record reason and close |
| unknown | Perform safe checks, then ask for user direction if still unclear |

## When To Use Codex

Create a Codex task when:

- `apps/api/**` behavior needs a scoped fix
- `apps/landing/**` behavior needs a scoped fix
- `scripts/smoke-test.sh` needs a scoped fix
- CI checks need to be added or corrected
- the fix is implementation work rather than simple documentation

Use `.github/ISSUE_TEMPLATE/codex_task.md`.

ChatGPT should review the Codex PR before merge.

## When To Create A PR Directly

ChatGPT may create a PR directly when:

- documentation is missing or outdated
- runbook clarification is needed
- incident record is needed
- stale monitoring notes need cleanup
- the change is small, safe, and non-production-impacting

## When Human Action Is Required

Ask for human action when:

- secrets must be added, rotated, or checked
- Cloudflare or Grafana UI permissions are needed
- billing/account access is involved
- production-impacting behavior is ambiguous
- the safest recovery path is unclear

Do not ask the user to paste secret values.

## Incident Record Rules

Create an incident record when:

- an active production service was unavailable or degraded
- the alert showed a real user-impacting problem
- manual recovery was needed
- the root cause should become operational memory

Do not create an incident record for:

- test alerts
- duplicate alerts
- warning-only cases
- removed-service stale monitoring with no production impact

## Standard Investigation Report

Use this format in the Issue comment or completion report:

```text
Issue:
Classification:
Affected service:
Service state:
Evidence checked:
Root cause:
Action taken:
PR / Codex task / incident record:
Validation result:
Human action required:
Close decision:
Next step:
```

## Close Comment Format

When closing a Grafana-created Issue, include:

```text
Classification:
Action taken:
Validation:
Linked PR / Issue / incident record:
Remaining follow-up:
```

## Current Status

Current state:

```text
Grafana alert → Cloudflare Worker → GitHub Issue
```

This workflow defines the next manual/AI-assisted step:

```text
GitHub Issue → ChatGPT investigation → Codex/PR/runbook/incident → close
```

Future improvement:

```text
Grafana-created Issue
↓
AI investigation starts automatically
↓
PR or incident record is prepared automatically
```
