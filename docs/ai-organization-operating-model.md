# AI Organization Operating Model

## Purpose

This document defines the target operating model for reducing manual work in SRE Lab by using ChatGPT, Codex, GitHub Actions, Cloudflare, Grafana, GitHub Issues, and management-side review automation as an AI-assisted delivery system.

The long-term target is:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```

The current practical target while `YDTNK/sre-lab` remains a public portfolio repository is:

```text
Manual work: 10-15%
Automated / AI-assisted work: 85-90%
```

This does not mean unsafe full autonomy. It means the user should mainly make direction, approval, and human-judgment decisions, while safe execution work is handled by available tools.

## Current SRE Lab Position

```text
Current phase: Ongoing operation automated and verified
Construction phase: completed
Active service: Reliability Demo API
Public implementation repo: YDTNK/sre-lab
Management / review repo: YDTNK/engineering-career-hq/projects/sre-lab
```

Current implemented operating assets:

```text
- public SRE Lab portfolio site
- Reliability Demo API
- SLO / SLI docs
- Runbook
- Incident / Postmortem evidence
- Security / Public Exposure policy
- Cost Guardrail evidence
- GitHub Actions CI / deploy workflows
- Grafana alert-to-Issue entry point
- Issue / PR based workflow
- Level 2 weekly/monthly review automation in the management repo
```

## Target Flow

```text
Human
↓
"Do this"
↓
ChatGPT: PM / planner / reviewer / GitHub operator
↓
GitHub Issue: task queue and source of work
↓
Codex: implementation agent when needed
↓
GitHub Pull Request: reviewable change unit
↓
GitHub Actions: CI and validation
↓
Cloudflare: deployment target
↓
Grafana: monitoring and alerting
↓
Completion report
```

For periodic operations review:

```text
GitHub Actions in management repo
↓
Public site / API / docs checks
↓
Weekly or monthly review Markdown
↓
Human reads review
↓
Focused Issue only if a real improvement need is confirmed
```

For incidents and monitoring-driven work:

```text
Grafana alert
↓
Cloudflare Worker webhook
↓
GitHub Issue
↓
ChatGPT / Codex investigation
↓
Pull Request, runbook update, or incident record
↓
GitHub Actions validation
↓
Cloudflare deployment when relevant
↓
Completion report
```

## Repository Placement Rule

```text
YDTNK/sre-lab:
- public implementation
- public portfolio evidence
- public workflow rules for implementation work

YDTNK/engineering-career-hq/projects/sre-lab:
- current state
- construction complete policy
- weekly/monthly review records
- private planning and judgment notes
```

## Human Responsibilities

The user should mainly handle:

1. Direction and priority decisions
2. Portfolio judgment
3. External UI actions that tools cannot access
4. Credentials, MFA, and secret entry
5. Approval for risky or ambiguous changes
6. Final judgment for production-impacting work
7. Human review of generated weekly/monthly review Markdown

The user should not normally need to manually perform safe repository tasks such as creating files, creating PRs, merging documentation changes, or recording incidents when tools can do them.

## AI / Tool Responsibilities

### ChatGPT

Acts as PM, reviewer, and GitHub operator.

Expected responsibilities:

- Clarify the request when needed
- Inspect repository state
- Read `AGENTS.md` and linked policy docs first
- Create GitHub Issues when work should be tracked
- Create branches for safe changes
- Update documentation and small scoped files
- Create PRs
- Review PR scope and changed files
- Merge safe PRs when mergeable
- Verify main branch after merge
- Record incidents, release notes, policy changes, and completion reports
- Report final completed state

### Codex

Acts as implementation agent.

Expected responsibilities:

- Work from GitHub Issues or clearly scoped tasks
- Read `AGENTS.md` before making changes
- Respect service-state and SRE portfolio-first decisions
- Avoid broad unrelated changes
- Create PRs with clear summaries and validation notes
- Keep risky changes reviewable

### GitHub Issues

Acts as the work queue.

Every non-trivial task should be represented as an Issue when it benefits traceability.

A good Issue should include:

- Objective
- Background
- Files likely to change
- Allowed scope
- Out-of-scope items
- Acceptance criteria
- Validation method
- Risk level
- Merge policy

### Pull Requests

Acts as the controlled delivery unit.

A good PR should include:

- Summary
- Changed files
- Validation
- Risk level
- Rollback notes if relevant
- Screenshots if UI changed
- Linked Issue if applicable

### GitHub Actions

Acts as the automatic validation layer.

Recommended checks:

- Required file existence checks
- API syntax checks
- Frontend smoke checks if available
- Link checks where practical
- Post-deploy smoke tests
- Guardrails for removed services such as AWS Cost Simulator
- Validation that required policy files remain present
- Weekly/monthly review generation in the management repo

### Cloudflare

Acts as the deployment target.

Expected automation:

- Deploy Cloudflare Workers from GitHub Actions when API changes are merged
- Deploy Cloudflare Pages when frontend changes are merged
- Avoid manual deploy unless emergency recovery is needed

### Grafana

Acts as the monitoring and alerting layer.

Expected role:

- Monitor active frontend and API services
- Alert only on active services
- Avoid stale monitoring for removed or historical services
- Feed incidents into GitHub Issues where possible

## Manual Work That Should Remain

Manual work is expected for:

- Portfolio direction
- Priority decisions
- Grafana or Cloudflare UI actions not available through tools
- MFA or login approvals
- Secrets and credentials entry
- Explicit approval for high-risk changes
- Human review of generated weekly/monthly review Markdown
- Final decision to create follow-up Issues from review output

## Automation Readiness Levels

### Level 1: Manual execution

Status:

```text
Superseded for normal repository work.
Use only for external UI operations, credentials, MFA, and emergency recovery.
```

### Level 2: Checklist and review automation

Status:

```text
Implemented and verified in the management repository.
```

Current implementation:

```text
- Weekly review Markdown generation
- Monthly review Markdown generation
- Public site HTTP checks
- API health/status checks
- Public docs URL checks
- Open Issue / PR counts
```

Human review remains required for:

```text
- visual layout
- wording quality
- interview-readiness
- implemented vs future-work nuance
- whether to create follow-up issues
```

### Level 3: Automation-first GitHub work

Status:

```text
Implemented and operational for safe scoped work.
```

What is possible:

- Repository inspection
- Branch creation
- File creation and updates
- Pull request creation
- Pull request review
- Safe PR merge
- Main branch verification
- Documentation, policy, runbook, and small scoped changes

Production-impacting application code still requires explicit user approval before merge.

### Level 4: Issue-driven AI organization

Status:

```text
Partially implemented.
```

Implemented:

- Issue templates and PR template exist
- GitHub Issues are used as the work queue for operational tasks
- ChatGPT can create Issues, update files, open PRs, merge safe work, and close completed Issues
- GitHub Actions includes required file checks and API syntax checks
- Worker deploy workflow includes post-deploy smoke tests

Remaining gap:

- not every non-trivial task starts from an Issue yet
- Codex is not yet consistently triggered from Issues as the default implementation path
- validation is not strong enough to make most code PRs safely self-verifying

### Level 5: Monitoring-driven remediation

Status:

```text
Partially implemented.
```

Implemented:

- `POST /api/grafana-alert` is implemented in the Cloudflare Worker
- Grafana can notify a Cloudflare Worker webhook
- The Worker can create or dedupe GitHub Issues from Grafana alert payloads
- GitHub Issues can become incident investigation entry points

Remaining gap:

- AI investigation is not triggered automatically when a Grafana-created Issue appears
- PR or runbook updates after an alert still require a user prompt or manual AI invocation
- Incident record creation is not yet automatic

## Current Level Summary

```text
Level 2 review automation: implemented and verified
Level 3 safe GitHub work: implemented and operational
Level 4 Issue-driven organization: partially implemented
Level 5 monitoring-driven remediation: partially implemented
```

Estimated current automation ratio:

```text
Manual work: 10-15%
Automated / AI-assisted work: 85-90%
```

## Merge Policy

Safe auto-merge candidates:

- Documentation-only changes
- Policy notes
- Runbook clarifications
- Incident records
- Release records
- Small non-destructive text changes

Human approval required:

- Production-impacting application code
- Large diffs
- File deletion
- Secrets or credentials
- Billing or payment setup
- Personal data handling
- Infrastructure changes that can create cost or outage risk
- Ambiguous or risky changes

## Main Missing Pieces For 90-95%

```text
- Codex execution from Issues as the normal implementation path
- stronger CI guardrails for code changes
- automatic AI investigation from Grafana-created Issues
- automatic incident record creation after alert triage
```

## Practical Rule

When a user says:

```text
"Do this"
```

The default response should be:

```text
I will complete the safe machine-side work through branch, PR, merge, and verification where possible.
```

The user should only be pulled in for direction, external UI actions, credentials, high-risk approval, and human judgment on generated review outputs.
