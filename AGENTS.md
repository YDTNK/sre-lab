# AI Assistant Startup Instructions

This file is the first entry point for ChatGPT, Codex, GitHub Copilot agents, and other AI-assisted tools working on this repository.

## Cross Repository Context Contract

SRE Lab work spans two repositories.

```text
YDTNK/sre-lab
= implementation repository

YDTNK/engineering-career-hq
= project management / roadmap / memory repository
```

Before answering, reviewing, implementing, or creating a PR for SRE Lab, check both repositories.

Do not rely on only one repository.

Required management-side context:

```text
YDTNK/engineering-career-hq/projects/sre-lab/project-context.md
YDTNK/engineering-career-hq/projects/sre-lab/standards/mandatory-context-registry.md
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
YDTNK/engineering-career-hq/projects/sre-lab/progress.md
YDTNK/engineering-career-hq/projects/sre-lab/phase1-20-roadmap.md
```

Required implementation-side context:

```text
YDTNK/sre-lab/AGENTS.md
YDTNK/sre-lab/docs/mandatory-context-registry.md
YDTNK/sre-lab/docs/issue-number-execution.md
YDTNK/sre-lab/docs/codex-workflow.md
YDTNK/sre-lab/docs/ai-assisted-85-90-workflow.md
YDTNK/sre-lab/docs/sre-lab-workflow.md
```

For Codex work, also check the `Codex Prompt Efficiency Policy` in:

```text
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
```

## Read These First

Before answering or changing anything in this repository, read the following files in this order:

1. `AGENTS.md`
2. `docs/mandatory-context-registry.md`
3. `docs/issue-number-execution.md`
4. `README.md`
5. `docs/automation-first-working-policy.md`
6. `docs/ai-organization-operating-model.md`
7. `docs/sre-lab-workflow.md`
8. `docs/ai-assisted-85-90-workflow.md`
9. `docs/codex-workflow.md`
10. `docs/completion-report-template.md`
11. `docs/deploy-failure-investigation.md`
12. `docs/grafana-issue-ai-investigation.md`
13. `docs/incident-record-rules.md`
14. `docs/revenue-release-before-cka.md`
15. `docs/service-state-checklist.md`
16. `docs/services.md`
17. `docs/runbook.md`
18. Latest relevant records under `docs/incidents/`

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

The target operating model is documented in:

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

## Current Project Direction

SRE Lab should complete the first customer-facing AI Moving Assistant revenue release before Kubernetes / CKA becomes the main learning focus.

At CKA start, the intended state is:

```text
AI Moving Assistant is publicly available
A free sample is publicly available
A revenue content page, paid content page, or affiliate/revenue link is publicly available
If user traffic arrives and converts, revenue can be generated
SRE Lab is monitored and maintained during CKA
```

During Kubernetes / CKA learning, SRE Lab should be maintenance-only by default.

## Service State Gate

Before restoring any endpoint, page, monitor, or alert target, confirm whether the target is active, degraded, deprecated, removed, replaced, or unknown.

AWS Cost Simulator is currently a removed service. Do not restore it as an active service unless the project policy is explicitly changed.

## Incident and Release Records

For new operational records, prefer one file per record under:

```text
docs/incidents/
```

Avoid rewriting the large aggregate file:

```text
docs/incidents.md
```

unless the full current content is safely loaded and the change is small and verified.

## Completion Reports

When closing Issues, reporting merged PRs, documenting incident follow-up, or completing Grafana-created investigations, use:

```text
docs/completion-report-template.md
```
