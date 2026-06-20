# 85-90% AI-Assisted Operations Workflow

## Purpose

This document defines the practical SRE Lab operating workflow when public repository constraints prevent full private/internal agent automation.

Target operating ratio for the public `sre-lab` repository:

```text
Manual work: 10-15%
Automated / AI-assisted work: 85-90%
```

This is the accepted operating model while `sre-lab` remains a public portfolio repository.

## Current Project State

```text
Current phase: Ongoing operation automated and verified
Construction phase: completed
Current active target: Normal weekly/monthly operation + human review
Active service: Reliability Demo API
```

## Why 85-90% Instead Of 90-95%

Fully automatic private/internal agent automations may depend on repository visibility, app permissions, and external tool capabilities.

Because `YDTNK/sre-lab` is public, this repository should not assume that every Issue can automatically start a coding agent session.

Therefore, the remaining manual work is mainly:

- starting Codex/agent sessions manually when needed
- entering or managing secrets
- using Cloudflare or Grafana UIs when tool access is unavailable
- making priority and portfolio decisions
- approving risky production-impacting changes
- reading generated weekly/monthly reviews and deciding whether follow-up Issues are needed

## Role Ownership

| Area | Primary owner | Support owner | Notes |
| --- | --- | --- | --- |
| Portfolio direction | Human | ChatGPT | Human decides what matters and what to prioritize. |
| Issue creation | ChatGPT | Human | ChatGPT creates or reuses Issues for non-trivial work. |
| Codex-ready Issue preparation | ChatGPT | Human | ChatGPT writes objective, scope, acceptance criteria, validation, risk. |
| Codex/agent session start | Human | ChatGPT | Manual start may be required while public repo automations are unavailable. |
| Implementation | Codex or ChatGPT | Human | Codex handles scoped code work when manually started. ChatGPT can do safe docs/small changes. |
| PR creation | Codex or ChatGPT | Human | Codex or ChatGPT opens reviewable PRs. |
| PR review | ChatGPT | Human | ChatGPT reviews scope, files, validation, and risk. |
| Risk approval | Human | ChatGPT | Required for production-impacting, ambiguous, destructive, billing, secrets, or infra-cost changes. |
| Merge | ChatGPT | Human | ChatGPT merges safe or approved PRs when mergeable. |
| CI validation | GitHub Actions | ChatGPT | Actions run checks; ChatGPT interprets results when accessible. |
| Deploy | GitHub Actions / Cloudflare | Human / ChatGPT | Worker deploy is automated; external UI issues may require Human. |
| Monitoring | Grafana / Worker | ChatGPT | Grafana alerts can create GitHub Issues through Worker. |
| Operations review | GitHub Actions in management repo | Human / ChatGPT | Weekly/monthly review Markdown is generated automatically; human reads it. |
| Incident record | ChatGPT or Codex | Human | AI creates records when criteria are met. |
| Completion report | ChatGPT | Codex | ChatGPT records final report using the standard template. |
| Issue close | ChatGPT | Human | ChatGPT closes completed Issues when safe. |

## Standard Human-Initiated Workflow

Use this when the Human says:

```text
これやって
```

Flow:

```text
Human gives direction
↓
ChatGPT reads AGENTS.md and relevant docs
↓
ChatGPT inspects repository state
↓
ChatGPT creates or reuses a GitHub Issue for non-trivial work
↓
ChatGPT decides the implementation path
↓
If safe docs/small scoped work:
  ChatGPT creates branch, edits files, opens PR
If code/larger implementation work:
  ChatGPT prepares Codex-ready Issue and recommends/uses codex label
  Human manually starts Codex/agent session when needed
  Codex creates PR
↓
GitHub Actions validates
↓
ChatGPT reviews PR scope and validation
↓
Human approves only if required by risk policy
↓
ChatGPT merges safe or approved PR
↓
ChatGPT verifies main branch state
↓
ChatGPT writes completion report
↓
ChatGPT closes completed Issue or records remaining follow-up
```

## Operations Review Workflow

Weekly/monthly review automation lives in the management repository.

```text
GitHub Actions in engineering-career-hq
↓
Checks public SRE Lab pages / API / docs
↓
Generates weekly or monthly Markdown
↓
Commits review file under operations/reviews/
↓
Human reads generated review
↓
Follow-up Issue only if human review confirms a real improvement need
```

## Implementation Path Decision

### ChatGPT Direct Path

Use ChatGPT direct implementation when the task is:

- documentation-only
- policy or runbook update
- Issue cleanup
- incident record creation
- completion report update
- small, safe, scoped repository change
- non-production-impacting workflow documentation

Owner:

```text
Primary: ChatGPT
Approval: Human only if ambiguous or risky
```

### Codex-Assisted Path

Use Codex when the task involves:

- application behavior changes under `apps/api/**`
- frontend behavior changes under `apps/landing/**`
- smoke test changes
- CI logic changes
- larger implementation work
- changes that benefit from coding-agent iteration

Owner:

```text
Primary implementation: Codex
Issue preparation: ChatGPT
Session start: Human, while public repo automations are unavailable
Review/merge: ChatGPT after safe or approved validation
```

### Human-Required Path

Human action is required for:

- secrets or credentials
- MFA or login approvals
- Cloudflare UI operations not available through tools
- Grafana UI operations not available through tools
- priority and portfolio decisions
- production-impacting behavior approval
- destructive, billing, or infrastructure-cost-impacting changes
- final judgment from weekly/monthly review outputs

Owner:

```text
Primary: Human
Support: ChatGPT prepares instructions, checklists, and verification steps
```

## Monitoring-Initiated Workflow

Use this when Grafana creates a GitHub Issue through the Worker webhook.

Flow:

```text
Grafana alert
↓
Cloudflare Worker `/api/grafana-alert`
↓
GitHub Issue is created or deduped
↓
ChatGPT reads the Issue and required docs
↓
ChatGPT classifies the alert
↓
ChatGPT checks service state
↓
ChatGPT chooses action:
  - close as test/duplicate/false positive
  - create stale monitoring cleanup task
  - create incident record
  - create docs/runbook PR
  - prepare Codex-ready fix Issue
↓
GitHub Actions validates any PR
↓
Deploy Worker / smoke test / Validate Grafana Dedupe runs when relevant
↓
ChatGPT writes completion report and closes the Issue when safe
```

Owners:

| Step | Owner |
| --- | --- |
| Alert creation | Grafana |
| Issue creation/dedupe | Cloudflare Worker |
| Classification | ChatGPT |
| Service state decision | ChatGPT, with Human if ambiguous |
| Fix implementation | ChatGPT or Codex depending on scope |
| Incident record | ChatGPT or Codex |
| Final close | ChatGPT |

## Completion Report Rule

Every completed Issue, PR, incident, validation task, or operational workflow should use:

```text
docs/completion-report-template.md
```

Standard fields:

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

## Open Issue Hygiene

Keep open Issues limited to real work or real verification waits.

Current allowed open Issue types:

- active implementation tasks
- production verification tasks
- next-run validation waits
- incident follow-up tasks
- parent tracking Issues with unfinished children
- intentionally deferred operational references

Close Issues when:

- acceptance criteria are met
- completion report is recorded
- remaining follow-up is moved to a different Issue
- the Issue is a duplicate, stale artifact, or completed test alert

## Current Known Remaining Manual Work

For the public `sre-lab` repository, the expected remaining manual work is:

1. Manual Codex/agent session start when implementation should be delegated to Codex.
2. Secrets and external UI operations.
3. Priority and portfolio decisions.
4. Approval for risky changes.
5. Visual production checks when screenshot/browser tooling is insufficient.
6. Human review of generated weekly/monthly reviews.

## Success Criteria

This workflow is working when:

- non-trivial work starts from an Issue
- Codex-ready work has clear acceptance criteria
- safe docs/small changes are completed by ChatGPT without unnecessary handoff
- code/larger changes are delegated to Codex when manually started
- PRs include validation and risk notes
- GitHub Actions validates changes
- Deploy Worker and post-deploy checks run when relevant
- Grafana alerts create or dedupe Issues
- weekly/monthly reviews are generated in the management repo
- completion reports are consistent
- open Issues remain low-noise

## Practical Target

While `sre-lab` remains public:

```text
Manual work: 10-15%
Automated / AI-assisted work: 85-90%
```

If a private/internal automation repository is added later, Codex/Copilot agent automations may raise the operating ratio closer to:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```
