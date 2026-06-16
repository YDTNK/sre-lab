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

The automation levels in this document exist to realize this target flow:

```text
Human
↓
"Do this"
↓
ChatGPT: PM / planner / reviewer / GitHub operator
↓
GitHub Issue: task queue and source of work
↓
Codex: implementation agent
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

For incidents and monitoring-driven work, the flow can also start from Grafana:

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

## Target Flow Readiness Map

Each automation level represents how much of the target flow is implemented.

| Target flow step | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
| --- | --- | --- | --- | --- | --- |
| Human says "Do this" | manual | AI assists | AI acts on safe work | Issue-first intake | Alert can create work |
| ChatGPT acts as PM | no | partial | yes for GitHub work | yes, Issue-driven | yes, alert triage |
| Issue created as task queue | no | optional | optional | default for non-trivial work | automatic from alerts |
| Codex implements from Issue | no | optional | optional | target behavior | target behavior for incidents |
| PR created | manual | human/AI-assisted | AI can create PR | PR linked to Issue | PR/runbook update from alert Issue |
| GitHub Actions validates | manual | partial | CI foundation | required gate | incident/remediation validation |
| Cloudflare deploys | manual | manual | workflow foundation | automated deploy target | deploy after remediation when needed |
| Grafana monitors | manual check | dashboard/alerts | monitoring active | Issues can reference alerts | alert-to-Issue operational |
| Completion report | manual | AI summary | AI verifies main and reports | Issue/PR completion report | alert closure and incident report |

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

Purpose in the target flow:

- Baseline before the AI organization flow exists.
- The human performs nearly every target-flow step manually.

```text
Human says "Do this"
↓
Human creates/edits files
↓
Human creates commits and PRs
↓
Human runs checks
↓
Human deploys
↓
Human checks Grafana or endpoints
↓
Human writes completion notes
```

What is possible:

- Basic manual project work
- Manual local edits
- Manual Git commits and pushes
- Manual deploy and verification

SRE Lab status:

- Superseded for normal repository work.
- Should only be used for external UI operations, credentials, MFA, and emergency recovery.

### Level 2: AI-assisted repository work

Purpose in the target flow:

- ChatGPT helps with planning and drafts, but the human still carries the workflow between systems.
- The target flow is visible, but not connected end-to-end.

```text
Human says "Do this"
↓
ChatGPT drafts code/docs or commands
↓
Human copies changes locally
↓
Human creates PR or merges
↓
Human deploys/checks
↓
ChatGPT summarizes when asked
```

What is possible:

- AI drafts code or documentation
- Human copies changes locally
- Human runs validation
- Human creates or merges PRs

SRE Lab status:

- Superseded for most safe GitHub work.
- Still acceptable when connector access is unavailable or when the user explicitly wants local control.

### Level 3: Automation-first GitHub work

Purpose in the target flow:

- ChatGPT executes the GitHub part of the target flow for safe work.
- The flow reaches branch, PR, merge, and main verification without requiring local human edits.

```text
Human says "Do this"
↓
ChatGPT inspects repository
↓
ChatGPT creates branch / updates files
↓
ChatGPT creates PR
↓
GitHub Actions validates when available
↓
ChatGPT merges safe or approved PR
↓
ChatGPT verifies main
↓
Completion report
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

SRE Lab status:

- Implemented and operational.
- Used for policy docs, setup templates, CI guardrails, Grafana documentation, and safe repository updates.
- Production-impacting application code still requires explicit user approval before merge.

### Level 4: Issue-driven AI organization

Purpose in the target flow:

- The normal path becomes Issue-first.
- ChatGPT acts as PM, GitHub Issues become the task queue, Codex implements, PRs deliver changes, GitHub Actions validates, Cloudflare deploys when relevant, and ChatGPT reports completion.

```text
Human says "Do this"
↓
ChatGPT clarifies scope and creates/updates GitHub Issue
↓
Codex implements from the Issue scope
↓
Codex or ChatGPT creates Pull Request
↓
GitHub Actions validates
↓
ChatGPT reviews PR and risk
↓
Human approves risky changes, if needed
↓
ChatGPT merges safe/approved PR
↓
Cloudflare deploy workflow runs when relevant
↓
ChatGPT verifies main / deployment / smoke results
↓
Completion report
```

What is possible:

- Non-trivial tasks are tracked as GitHub Issues
- Issue templates define scope, risk, validation, and acceptance criteria
- PRs can link back to Issues
- ChatGPT can act as PM and GitHub operator
- Codex can be used as implementation agent for scoped work
- GitHub Actions can validate changes before merge
- Cloudflare Worker deployment can run from GitHub Actions for relevant changes
- Post-deploy smoke tests can run after Worker deployment

SRE Lab status:

- Partially implemented.
- Issue templates and PR template exist.
- GitHub Issues are being used as the work queue for operational tasks.
- ChatGPT can create Issues, update files, open PRs, merge safe work, and close completed Issues.
- GitHub Actions includes required file checks and API syntax checks.
- Worker deploy workflow includes post-deploy smoke tests.
- Remaining gap: not every non-trivial task starts from an Issue yet.
- Remaining gap: Codex is not yet consistently triggered from Issues as the default implementation path.
- Remaining gap: validation is not strong enough to make most code PRs safely self-verifying.

Current practical capability:

```text
User asks for work
↓
ChatGPT decides whether it should become an Issue
↓
ChatGPT creates Issue for non-trivial work when useful
↓
ChatGPT creates or updates repository state
↓
PR is created when appropriate
↓
GitHub Actions validates available checks
↓
Human approves risky changes
↓
ChatGPT merges safe/approved changes
↓
Cloudflare deploy workflow runs for Worker changes
↓
Completion report
```

### Level 5: Monitoring-driven remediation

Purpose in the target flow:

- Grafana can start the same Issue-driven organization flow without the human saying "Do this" first.
- Monitoring becomes an automatic work intake path.

```text
Grafana alert fires
↓
Cloudflare Worker validates webhook
↓
GitHub Issue is created
↓
ChatGPT / Codex investigates from the Issue
↓
PR or runbook update is created
↓
GitHub Actions validates
↓
Cloudflare deploys when relevant
↓
Grafana / smoke tests confirm recovery
↓
Incident record is created when needed
↓
Completion report / Issue close
```

What is possible:

- Grafana can notify a Cloudflare Worker webhook
- The Worker can validate the Grafana webhook secret
- The Worker can create GitHub Issues from Grafana alert payloads
- GitHub Issues can become incident investigation entry points
- AI can inspect the Issue and repository state after the alert is created
- The documented triage flow can classify active failure, stale monitoring, duplicate, test alert, false positive, or unknown

SRE Lab status:

- Partially implemented.
- `POST /api/grafana-alert` is implemented in the Cloudflare Worker.
- Grafana Contact point `sre-lab-github-issue-webhook` is configured.
- Notification policy routes are configured for active service labels:
  - `service_name = sre-lab-api`
  - `service_name = sre-lab`
- Grafana test alert successfully created GitHub Issue `#20`.
- Test Issue `#20` was closed as completed after verification.
- Triage and remediation flow is documented in `docs/grafana-alert-to-issue.md`.

Remaining gap:

- AI investigation is not triggered automatically when a Grafana-created Issue appears.
- PR or runbook updates after an alert still require a user prompt or manual AI invocation.
- Incident record creation is not yet automatic.
- Deduplication is not implemented; repeated Grafana notifications may create repeated Issues.
- Full Cloudflare deployment verification still depends on GitHub Actions secrets and workflow results.

Current practical capability:

```text
Grafana alert / test notification
↓
Cloudflare Worker validates header
↓
GitHub Issue is created automatically
↓
User or ChatGPT reviews Issue
↓
ChatGPT can investigate and create PR/runbook updates when asked
```

## Current Level Summary

SRE Lab is currently at:

```text
Level 3: Implemented and operational
Level 4: Partially implemented toward the target "Do this" → Issue → Codex → PR → CI → Cloudflare → Grafana → report flow
Level 5: Partially implemented, alert-to-Issue entry point operational
```

Estimated current automation ratio:

```text
Manual work: 20-30%
Automated / AI-assisted work: 70-80%
```

Target remaining ratio:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```

## Required Next Steps To Reach Manual 5-10%

### 1. Issue-driven workflow

Use GitHub Issues as the default task entry point for non-trivial work.

Needed files:

```text
.github/ISSUE_TEMPLATE/feature_request.md
.github/ISSUE_TEMPLATE/bug.md
.github/ISSUE_TEMPLATE/ops_task.md
.github/ISSUE_TEMPLATE/revenue.md
```

Status:

- Implemented.
- Remaining improvement: make Issue-first execution the default for all non-trivial code, ops, and revenue tasks.

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

Status:

- Implemented.
- Remaining improvement: keep PRs consistently linked to Issues.

### 3. Stronger CI guardrails

Add checks for:

- Required policy files
- Removed service guardrails
- API syntax
- Basic frontend availability assumptions
- Smoke test scripts where practical

Status:

- Partially implemented.
- Required file guardrails, API syntax check, and smoke test script exist.
- Remaining improvement: expand code validation and make PRs more self-verifying.

### 4. Post-deploy smoke tests

Automate checks such as:

```text
GET https://sre-lab.pages.dev/ -> 200
POST /api/moving-assistant -> 200
AWS Cost Simulator remains removed from active navigation and monitoring docs
```

Status:

- Implemented for Worker deploy workflow foundation.
- Remaining improvement: verify GitHub Actions secrets and successful workflow run after a real Worker deployment.

### 5. Alert-to-Issue flow

Target:

```text
Grafana Alert → Cloudflare Worker webhook → GitHub Issue
```

Status:

- Implemented for the first hop.
- Grafana test alert created GitHub Issue `#20` successfully.
- Remaining improvement: automatically trigger AI investigation, runbook update, and incident record creation from Grafana-created Issues.

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
- GitHub Actions for CI / Worker deploy foundations
- Cloudflare Pages / Workers
- Grafana monitoring and alerting
- Grafana alert-to-GitHub-Issue webhook flow
- Issue templates
- PR template
- Smoke test script and workflow foundation
- Worker deploy workflow with post-deploy smoke test step
- Grafana alert Issue triage documentation

The main missing pieces for 90-95% automation are:

- Issue-first execution as the consistent default
- Codex execution from Issues as the normal implementation path
- stronger CI guardrails for code changes
- verified automated Cloudflare Worker deployment from GitHub Actions
- automatic AI investigation from Grafana-created Issues
- automatic incident record creation after alert triage

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
