# SRE Lab Workflow

## Purpose

This document records the current SRE Lab project workflow and the target automation flow used by ChatGPT, Codex, GitHub Issues, Pull Requests, GitHub Actions, Cloudflare, and Grafana.

This is the practical workflow view of the AI organization operating model.

## Current Project State

SRE Lab is currently at:

```text
Level 3: Implemented and operational
Level 4: Partially implemented
Level 5: Partially implemented, alert-to-Issue entry point operational
```

Estimated operating ratio:

```text
Manual work: 12-20%
Automated / AI-assisted work: 80-88%
```

Target operating ratio:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```

## Issue-First Rule

Non-trivial SRE Lab work should be Issue-first by default.

```text
Non-trivial work
↓
GitHub Issue
↓
Branch / PR / validation
↓
Completion report
```

This applies to:

- application code changes
- operations workflow changes
- CI / GitHub Actions changes
- Cloudflare deploy or Worker behavior changes
- Grafana monitoring or alerting changes
- revenue release tasks
- service-state changes
- incident, runbook, or remediation work
- multi-step documentation changes
- work that should be traceable later

A new Issue is not required for:

- answering a question without repository changes
- very small typo fixes
- small clarification edits inside an already-related PR
- emergency mitigation where creating an Issue would delay response
- work already covered by an existing open Issue

## Primary Human-Initiated Workflow

Use this workflow when the user says:

```text
これやって
```

Target flow:

```text
Human
↓
"Do this"
↓
ChatGPT as PM / planner / reviewer / GitHub operator
↓
GitHub Issue for non-trivial work
↓
Codex implements when code or larger scoped work is needed
↓
Pull Request is created
↓
GitHub Actions validates
↓
Cloudflare deploys when relevant
↓
Grafana monitors active services
↓
Completion report
```

## Practical Current Workflow

Because Level 4 is only partially implemented, the current practical flow is:

```text
Human gives direction
↓
ChatGPT reads required context and repository state
↓
ChatGPT creates or reuses a GitHub Issue for non-trivial work
↓
ChatGPT creates a branch and updates files for safe scoped work
↓
ChatGPT opens a PR linked to the Issue when applicable
↓
GitHub Actions validates available checks
↓
Human approval is requested only for risky or production-impacting work
↓
ChatGPT merges safe or approved PRs
↓
ChatGPT verifies main branch state
↓
Completion report
```

## Monitoring-Initiated Workflow

Use this workflow when Grafana detects an issue.

Implemented first hop:

```text
Grafana alert
↓
Cloudflare Worker `/api/grafana-alert`
↓
GitHub Issue is created
```

Target remediation flow:

```text
Grafana-created Issue
↓
ChatGPT / Codex classifies and investigates
↓
PR, runbook update, stale monitoring cleanup, or incident record is created
↓
GitHub Actions validates
↓
Cloudflare deploys when relevant
↓
Grafana or smoke tests confirm recovery
↓
Issue is closed with completion note
```

## What Is Already Automated

- ChatGPT can inspect repository files.
- ChatGPT can create GitHub Issues.
- ChatGPT can create branches.
- ChatGPT can update documentation and small scoped files.
- ChatGPT can open PRs.
- ChatGPT can check PR mergeability.
- ChatGPT can merge safe PRs.
- ChatGPT can verify main branch content after merge.
- ChatGPT can close completed Issues.
- ChatGPT can record completion reports.
- GitHub Actions runs required file checks.
- GitHub Actions runs API syntax checks.
- Worker deploy workflow exists.
- Worker deploy workflow runs post-deploy smoke tests.
- Validate Grafana Dedupe runs after successful Deploy Worker runs.
- Grafana can create GitHub Issues through the Cloudflare Worker webhook.

## What Still Requires Human Input

Human input remains required for:

- business direction and priority decisions
- revenue route, pricing, and product decisions
- BOOTH / note / Gumroad / payment provider UI operations
- Cloudflare or Grafana UI operations that are not available through tools
- MFA and login approvals
- Secret values and credential entry
- approval for production-impacting code changes
- approval for ambiguous, destructive, billing, or infrastructure-cost-impacting changes
- starting Codex manually when automatic Codex start is not available through connected tools

## Current Active Services

Active services:

- SRE Lab frontend
- AI Moving Assistant API

Removed services:

- AWS Cost Simulator

Rule:

```text
Do not restore removed services just because a page, alert, or monitor references them.
```

Removed service alerts should become stale monitoring cleanup tasks, not service recovery tasks.

## Standard Completion Report

Use:

```text
docs/completion-report-template.md
```

Each completed workflow should report:

```text
Issue:
PR:
Merge commit:
Validation:
Deploy:
Monitoring:
Remaining follow-up:
Close decision:
```

## Next Automation Priorities

To move from the current 80-88% automation range toward 90-95%, prioritize:

1. Use the `codex` label operating rule consistently for implementation-ready Issues.
2. Use the standard completion report for Issue/PR closures.
3. Confirm #2 production/visual verification and close when evidence is recorded.
4. Confirm #50 after the next successful Deploy Worker run automatically triggers Validate Grafana Dedupe.
5. Add direct Codex auto-start integration if the external Codex/GitHub App capability becomes available.
