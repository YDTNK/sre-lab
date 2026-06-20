# AI Assistant Startup Instructions

This file is the first entry point for ChatGPT, Codex, GitHub Copilot agents, and other AI-assisted tools working on this repository.

## Public / Private Context Contract

SRE Lab separates public portfolio evidence from private maintainer context.

```text
Public implementation repository:
- YDTNK/sre-lab

Private management context:
- project status
- portfolio requirements
- roadmap / issue planning
- decision log
- progress notes
- weekly / monthly operation reviews
```

Before answering, reviewing, implementing, or creating a PR for SRE Lab, check both the public implementation repository and the private management context when available.

Do not rely on only one context source.

If the private management context is unavailable, state that limitation before making roadmap, priority, or project-state decisions.

Required management-side context:

```text
private management context for SRE Lab:
- status.md
- portfolio-requirements.md
- project-context.md
- issues.md
- progress.md
- operations/construction-complete-operating-policy.md
- operations/site-operations.md
- latest weekly/monthly review when relevant
```

Required implementation-side context:

```text
YDTNK/sre-lab/START_HERE_FOR_AI.md
YDTNK/sre-lab/AGENTS.md
YDTNK/sre-lab/docs/mandatory-context-registry.md
YDTNK/sre-lab/docs/issue-number-execution.md
YDTNK/sre-lab/docs/codex-workflow.md
YDTNK/sre-lab/docs/ai-assisted-85-90-workflow.md
YDTNK/sre-lab/docs/sre-lab-workflow.md
```

## Read These First

Before answering or changing anything in this repository, read the following files in this order:

1. `START_HERE_FOR_AI.md`
2. `AGENTS.md`
3. `docs/mandatory-context-registry.md`
4. `docs/issue-number-execution.md`
5. `README.md`
6. `docs/services.md`
7. `docs/runbooks/reliability-demo-api.md`
8. `docs/slo/reliability-demo-api.md`
9. `docs/operations.md`
10. `docs/cost.md`
11. `docs/automation-first-working-policy.md`
12. `docs/ai-organization-operating-model.md`
13. `docs/sre-lab-workflow.md`
14. `docs/ai-assisted-85-90-workflow.md`
15. `docs/codex-workflow.md`
16. `docs/completion-report-template.md`
17. `docs/deploy-failure-investigation.md`
18. `docs/grafana-issue-ai-investigation.md`
19. `docs/incident-record-rules.md`
20. `docs/service-state-checklist.md`
21. Latest relevant records under `docs/incidents/`

## Current Project Direction

SRE Lab is SRE portfolio-first.

```text
Current phase: Ongoing operation automated and verified
Current active target: Normal weekly/monthly operation + human review
Construction phase: completed
Reliability Demo API: implemented / active portfolio demonstration service
```

The accepted direction is:

```text
SRE Lab = SRE / Platform Engineer portfolio.
Primary focus: Reliability Demo API and operational evidence.
Show: architecture, SLO / SLI, monitoring, alerting, CI/CD, incident response, runbooks, postmortems, API safety, and cost guardrails.
```

Do not return to the old revenue-first direction unless the private management context explicitly changes.

## Stopped Work

Do not continue these as active work:

```text
- Digital Product LP Starter Kit
- Issue #73 product LP implementation
- Moving Prep Board paid PDF
- Stripe CTA connection
- PR #66
- Issue #67
- Issue #69 revenue research route
- Issue #70 primary service decision route
- Issue #74 as current active work
- Issue #88 as current active work
- PR #60 as current active work
- AI Moving Assistant as active service
- consumer AI service expansion
- revenue-first market research route
```

Historical records may remain under archive paths, but they must not drive current implementation.

## Core Working Policy

Minimize manual user work as much as possible.

If ChatGPT, Codex, GitHub integration, GitHub Actions, or another machine-side tool can safely complete a task, it should execute the task through completion instead of stopping at instructions.

This includes, when available and safe:

- Repository inspection
- File search and review
- Branch creation
- File creation and updates
- Commits
- Pull request creation
- Pull request review and diff checking
- Mergeability checks
- Pull request merge
- Main branch verification after merge
- Issue creation
- Release or incident record creation
- Documentation updates
- Runbook and policy updates
- Completion report creation

## Issue Number Execution

For implementation tasks, the desired minimal handoff is:

```text
Execute Issue #<number>
```

The Issue must be complete enough for the implementation agent to proceed without repeated clarification.

Use and follow:

```text
.github/ISSUE_TEMPLATE/codex_task.md
docs/issue-number-execution.md
```

## AI Organization Operating Model

The operating model is documented in:

```text
docs/ai-organization-operating-model.md
docs/sre-lab-workflow.md
docs/ai-assisted-85-90-workflow.md
docs/codex-workflow.md
docs/issue-number-execution.md
docs/completion-report-template.md
docs/deploy-failure-investigation.md
docs/grafana-issue-ai-investigation.md
docs/incident-record-rules.md
```

Public repository practical balance:

```text
Manual work: 10-15%
Automated / AI-assisted work: 85-90%
```

Target balance if private/internal Codex/Copilot automations become available:

```text
Manual work: 5-10%
Automated / AI-assisted work: 90-95%
```

## Safety Exceptions

Pause and ask for explicit confirmation before completing or merging changes that involve:

- Production-impacting application code changes
- Large diffs across many files
- File deletion
- Secrets, credentials, tokens, or environment variables
- Billing, payment, settlement, or pricing configuration
- Personal information collection or handling
- Destructive operations
- Infrastructure changes that may create cost or outage risk
- Ambiguous instructions where the intended final state is unclear

## Service State Gate

Before restoring any endpoint, page, monitor, or alert target, confirm whether the target is active, degraded, deprecated, removed, replaced, historical, or unknown.

Current target service state:

```text
Reliability Demo API: implemented / active portfolio service
SRE Lab frontend: implemented / active portfolio service
AI Moving Assistant / Moving Prep Board: historical implementation asset, not active service
AWS Cost Simulator: removed historical service
Digital Product LP Starter Kit: stopped / not planned
```

Do not restore removed, stopped, or historical services just because a page, alert, or monitor references them.
