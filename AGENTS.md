# AI Assistant Startup Instructions

This file is the first entry point for ChatGPT, Codex, GitHub Copilot agents, and other AI-assisted tools working on this repository.

## Read These First

Before answering or changing anything in this repository, read the following files in this order:

1. `AGENTS.md`
2. `README.md`
3. `docs/automation-first-working-policy.md`
4. `docs/ai-organization-operating-model.md`
5. `docs/sre-lab-workflow.md`
6. `docs/codex-workflow.md`
7. `docs/deploy-failure-investigation.md`
8. `docs/revenue-release-before-cka.md`
9. `docs/service-state-checklist.md`
10. `docs/services.md`
11. `docs/runbook.md`
12. Latest relevant records under `docs/incidents/`

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

## AI Organization Operating Model

The target operating model is documented in:

```text
docs/ai-organization-operating-model.md
docs/sre-lab-workflow.md
docs/codex-workflow.md
docs/deploy-failure-investigation.md
```

Target balance:

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
