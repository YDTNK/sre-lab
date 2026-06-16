# AI Organization Operating Model

## Purpose

This document defines the target operating model for reducing manual work in SRE Lab by using ChatGPT, Codex, GitHub Actions, Cloudflare, Grafana, and GitHub Issues as an AI-assisted delivery system.

The target is:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```

This does not mean unsafe full autonomy. It means the user should mainly make direction and approval decisions, while safe execution work is handled by available tools.

## Target Flow

```text
Human
↓
"Do this"

AI organization
├─ ChatGPT: PM / planner / reviewer / GitHub operator
├─ Codex: implementation agent
├─ GitHub Issues: task queue and source of work
├─ GitHub Pull Requests: review and change delivery
├─ GitHub Actions: CI and validation
├─ Cloudflare: deployment target
├─ Grafana: monitoring and alerting
└─ Runbooks / incident records: operational memory

↓
Completion report
```

## Human Responsibilities

The user should mainly handle:

1. Direction and priority decisions
2. Product and business judgment
3. Revenue route, price, and content decisions
4. External UI actions that tools cannot access
5. Credentials, MFA, and secret entry
6. Approval for risky or ambiguous changes
7. Final judgment for production-impacting work

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
- Record incidents, releases, and policy changes
- Report final completed state

### Codex

Acts as implementation agent.

Expected responsibilities:

- Work from GitHub Issues or clearly scoped tasks
- Read `AGENTS.md` before making changes
- Respect service-state and revenue-before-CKA policy
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
- Avoid stale monitoring for removed services
- Feed incidents into GitHub Issues where possible in the future

## Manual Work That Should Remain

Even in the target model, some manual work remains.

Manual work is expected for:

- Business direction
- Product priority decisions
- Revenue content decisions
- Price decisions
- BOOTH / note / Gumroad / payment-provider UI actions
- Grafana or Cloudflare UI actions not available through tools
- MFA or login approvals
- Secrets and credentials entry
- Explicit approval for high-risk changes

## Automation Readiness Levels

### Level 1: Manual execution

Human performs most steps.

```text
Human decides → Human edits → Human commits → Human deploys → Human checks
```

### Level 2: AI-assisted repository work

AI helps with code/docs, but human still merges and verifies.

```text
Human decides → AI drafts/edits → Human reviews → Human merges
```

### Level 3: Automation-first GitHub work

AI completes safe GitHub work through merge and verification.

```text
Human decides → AI creates branch/PR → AI checks → AI merges → AI verifies main
```

SRE Lab has reached this level for safe documentation and policy changes.

### Level 4: Issue-driven AI organization

Issues become the primary task queue.

```text
Human creates request
↓
ChatGPT creates Issue
↓
Codex implements
↓
GitHub Actions validates
↓
ChatGPT reviews and merges safe PRs
↓
Completion report
```

### Level 5: Monitoring-driven remediation

Alerts create Issues automatically.

```text
Grafana alert fires
↓
GitHub Issue is created
↓
AI investigates
↓
PR or runbook update is created
↓
CI validates
↓
Safe merge or human approval
↓
Incident record is created
```

This is a future target, not the current default.

## Required Next Steps To Reach Manual 5-10%

### 1. Issue-driven workflow

Use GitHub Issues as the default task entry point for non-trivial work.

Needed files:

```text
.github/ISSUE_TEMPLATE/feature_request.md
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/ops_task.md
.github/ISSUE_TEMPLATE/revenue_release_task.md
```

### 2. Pull Request template

Add:

```text
.github/pull_request_template.md
```

Required sections:

- Summary
- Scope
- Changed files
- Validation
- Risk level
- Rollback
- Checklist

### 3. Stronger CI guardrails

Add checks for:

- Required policy files
- Removed service guardrails
- API syntax
- Basic frontend availability assumptions
- Smoke test scripts where practical

### 4. Post-deploy smoke tests

Automate checks such as:

```text
GET https://sre-lab.pages.dev/ -> 200
POST /api/moving-assistant -> 200
AWS Cost Simulator remains removed from active navigation and monitoring docs
```

### 5. Alert-to-Issue flow

Future target:

```text
Grafana Alert → Webhook / automation → GitHub Issue
```

This should not be built before the first revenue release unless it is very small and does not delay CKA.

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

## Current SRE Lab Position

SRE Lab currently has:

- GitHub-connected ChatGPT operations
- `AGENTS.md` startup instructions
- Automation-first policy documentation
- Revenue-before-CKA policy
- Service-state checklist
- Runbooks and incident records
- GitHub Actions for CI / Worker deploy
- Cloudflare Pages / Workers
- Grafana monitoring and alerting

The main missing pieces for 90-95% automation are:

- Issue templates
- PR template
- stronger CI guardrails
- post-deploy smoke tests
- optional future Grafana alert-to-Issue automation

## Practical Rule

When a user says:

```text
"Do this"
```

The default response should be:

```text
I will complete the safe machine-side work through branch, PR, merge, and verification where possible.
```

The user should only be pulled in for direction, external UI actions, credentials, or high-risk approval.
