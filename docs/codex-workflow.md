# Codex Workflow

## Purpose

This document defines how Codex should work inside SRE Lab.

The goal is to connect this target flow:

```text
Human
↓
"Do this"
↓
ChatGPT as PM / planner / reviewer / GitHub operator
↓
GitHub Issue
↓
Codex implements
↓
Pull Request
↓
GitHub Actions
↓
Cloudflare when relevant
↓
Grafana when relevant
↓
Completion report
```

## Role Split

### ChatGPT

ChatGPT acts as:

- PM
- planner
- reviewer
- GitHub operator
- merge operator for safe or approved work
- completion reporter

ChatGPT should prepare or verify the Issue before Codex starts.

### Codex

Codex acts as implementation agent.

Codex should:

- start from a GitHub Issue
- read the required context
- keep the change scoped
- implement the requested change
- create or update a Pull Request
- include validation notes
- avoid unrelated refactors
- hand off to ChatGPT for review and merge decision

## Required Start Procedure for Codex

Before changing files, Codex must read:

1. `AGENTS.md`
2. `README.md`
3. `docs/automation-first-working-policy.md`
4. `docs/ai-organization-operating-model.md`
5. `docs/sre-lab-workflow.md`
6. `docs/codex-workflow.md`
7. `docs/revenue-release-before-cka.md`
8. `docs/service-state-checklist.md`
9. `docs/services.md`
10. `docs/runbook.md`
11. Latest relevant records under `docs/incidents/`

Then Codex should inspect the Issue and confirm:

- objective
- allowed scope
- out-of-scope items
- files likely to change
- validation requirements
- merge policy
- whether human approval is required

## Issue Requirements Before Codex Starts

A Codex-ready Issue should include:

- objective
- background
- parent/tracking Issue if applicable
- files likely to change
- allowed scope
- out-of-scope items
- acceptance criteria
- validation method
- risk level
- merge policy

Use:

```text
.github/ISSUE_TEMPLATE/codex_task.md
```

for implementation tasks intended for Codex.

## Implementation Rules

Codex must:

- keep changes scoped to the Issue
- avoid broad unrelated rewrites
- avoid formatting-only churn unless requested
- avoid restoring removed services
- avoid committing secrets
- avoid changing billing, payment, or cost-impacting infrastructure without explicit approval
- preserve the Revenue-before-CKA direction
- preserve service-state decisions
- add or update tests/checks when useful
- document validation in the PR

## PR Creation Rules

Codex PRs should include:

- summary
- changed files
- validation
- risk level
- rollback notes if relevant
- linked Issue

The PR should link the Issue using one of:

```text
Closes #<issue-number>
Related to #<issue-number>
Part of #<issue-number>
```

Use `Closes` only when merging the PR should close the Issue.

Use `Related to` or `Part of` when the Issue tracks multiple tasks.

## Handoff to ChatGPT

After Codex opens or updates a PR, ChatGPT should:

1. Review the PR scope.
2. Check changed files.
3. Check GitHub Actions results.
4. Compare the PR against the Issue acceptance criteria.
5. Decide whether the change is safe to merge.
6. Ask the user for approval when required by risk policy.
7. Merge safe or approved PRs.
8. Verify main branch after merge.
9. Report completion.

## When Human Approval Is Required

Human approval is required before merge when the PR involves:

- production-impacting application code
- large diffs
- file deletion
- secrets or credentials
- billing or payment setup
- personal data handling
- infrastructure changes that can create cost or outage risk
- ambiguous or risky behavior changes

Codex can still prepare a PR for review, but should not assume it can be merged automatically.

## Standard Codex Completion Note

Codex should leave this information in the PR body or completion comment:

```text
Summary:

Changed files:

Validation:

Risk:

Rollback:

Linked Issue:

Notes for ChatGPT review:
```

## Current Status

This workflow is now defined, but Codex is not yet automatically triggered from Issues.

Current practical state:

```text
ChatGPT creates or verifies a Codex-ready Issue
↓
Codex can implement from that Issue when invoked
↓
Codex opens PR
↓
ChatGPT reviews / merges safe or approved PRs
```

Future improvement:

```text
Issue labeled codex
↓
Codex automatically starts implementation
↓
PR is opened automatically
↓
ChatGPT reviews and reports
```
