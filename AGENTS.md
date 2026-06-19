# AI Assistant Startup Instructions

This file is the first entry point for ChatGPT, Codex, GitHub Copilot agents, and other AI-assisted tools working on this repository.

## Public / Private Context Contract

SRE Lab separates public portfolio evidence from private maintainer context.

```text
Public implementation repository:
- YDTNK/sre-lab

Private management context:
- project status
- roadmap
- decision log
- issue planning
- progress notes
```

Before answering, reviewing, implementing, or creating a PR for SRE Lab, check both the public implementation repository and the private management context when available.

Do not rely on only one context source.

If the private management context is unavailable, state that limitation before making roadmap, priority, or project-state decisions.

Required management-side context:

```text
private management context for SRE Lab:
- status.md
- project-context.md
- issues.md
- progress.md
- mandatory-context-registry.md
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

For Codex work, also check the Codex Prompt Efficiency Policy in the private management context when available.

## Read These First

Before answering or changing anything in this repository, read the following files in this order:

1. `START_HERE_FOR_AI.md`
2. `AGENTS.md`
3. `docs/mandatory-context-registry.md`
4. `docs/issue-number-execution.md`
5. `README.md`
6. `docs/automation-first-working-policy.md`
7. `docs/ai-organization-operating-model.md`
8. `docs/sre-lab-workflow.md`
9. `docs/ai-assisted-85-90-workflow.md`
10. `docs/codex-workflow.md`
11. `docs/completion-report-template.md`
12. `docs/deploy-failure-investigation.md`
13. `docs/grafana-issue-ai-investigation.md`
14. `docs/incident-record-rules.md`
15. `docs/service-state-checklist.md`
16. `docs/services.md`
17. `docs/runbook.md`
18. Latest relevant records under `docs/incidents/`

## Current Project Direction

SRE Lab is now SRE portfolio-first.

```text
Current active target: Reliability Demo API MVP
Tracking Issue: #74
```

The accepted direction is:

```text
SRE Lab = SRE / Platform Engineer portfolio.
Primary focus: Reliability Demo API.
Show: SLO / SLI, monitoring, alerting, CI/CD, incident response, runbooks, postmortems, API safety, and cost guardrails.
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
- consumer AI service expansion
- revenue-first market research route
```

Historical records may remain, but they must not drive current implementation.

## Core Working Policy

Minimize manual user work as much as possible.

If ChatGPT, Codex, GitHub integration, or another machine-side tool can safely complete a task, it should execute the task through completion instead of stopping at instructions.

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

Target balance if private/internal Copilot automations become available:

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

Before restoring any endpoint, page, monitor, or alert target, confirm whether the target is active, degraded, deprecated, removed, replaced, or unknown.

Current target service state:

```text
Reliability Demo API: planned active target
AI Moving Assistant / Moving Prep Board: historical implementation asset, not monetization target
AWS Cost Simulator: removed historical service
Digital Product LP Starter Kit: stopped / not planned
```

Do not restore removed or stopped services just because a page, alert, or monitor references them.

## Incident and Release Records

For new operational records, prefer one file per record under:

```text
docs/incidents/
```

Avoid rewriting the large aggregate file:

```text
docs/incidents.md
```
