---
name: Codex implementation task
description: Give Codex a complete implementation task that can be executed from an Issue number
title: "[Codex] "
labels: ["codex", "ops"]
---

## Goal

What should Codex make true by the end of this task?

- 

## Current State

Where is the project now?

- Current source of truth: `engineering-career-hq/projects/sre-lab/status.md`
- Related PR / Issue:
- Current blocker:

## Why This Matters

Why should this be done now?

- 

## Required Reading

Codex must read these before changing files.

### Implementation repository

- [ ] `AGENTS.md`
- [ ] `START_HERE_FOR_AI.md`
- [ ] `docs/mandatory-context-registry.md`
- [ ] `docs/codex-workflow.md`
- [ ] `docs/ai-assisted-85-90-workflow.md`
- [ ] `docs/sre-lab-workflow.md`
- [ ] `docs/service-state-checklist.md`
- [ ] `docs/runbook.md`

### Management repository

- [ ] `YDTNK/engineering-career-hq/projects/sre-lab/status.md`
- [ ] `YDTNK/engineering-career-hq/projects/sre-lab/project-context.md`
- [ ] `YDTNK/engineering-career-hq/projects/sre-lab/standards/mandatory-context-registry.md`
- [ ] `YDTNK/engineering-career-hq/projects/sre-lab/standards/status-management-standard.md`
- [ ] `YDTNK/engineering-career-hq/projects/sre-lab/issues.md`

## Target Files / Areas

Files or areas Codex is expected to inspect or edit.

- 

## Allowed Scope

What may Codex change?

- 

## Out of Scope

What must Codex not change?

- 

## Implementation Requirements

- [ ] Keep the change scoped to this Issue.
- [ ] Preserve AI startup / mandatory context documents.
- [ ] Preserve existing service-state decisions.
- [ ] Do not restore removed services.
- [ ] Do not commit secrets.
- [ ] Do not change billing, payment, external account, or infrastructure-cost behavior unless explicitly approved in this Issue.
- [ ] Do not add personal-information collection fields unless explicitly approved in this Issue.
- [ ] Link the PR to this Issue.
- [ ] Include validation notes in the PR.

## Completion Conditions

The task is complete when:

- [ ] 
- [ ] 
- [ ] A reviewable Draft PR is opened or updated.
- [ ] The PR body includes summary, changed files, validation, risk, and rollback notes.

## Validation Checklist

Codex should run or explain why it could not run:

- [ ] Existing GitHub Actions pass.
- [ ] `git diff --check`
- [ ] Project-specific validation, if applicable:
  - 
- [ ] Manual preview / visual check instructions are included when UI changes are involved.

## PR Requirements

The PR must include:

- Summary
- Changed files
- Validation results or not-run reason
- Risk level
- Rollback notes if relevant
- Linked Issue
- Remaining manual review items

Use one of:

```text
Closes #<issue-number>
Related to #<issue-number>
Part of #<issue-number>
```

## Review / Merge Policy

- [ ] Open as Draft PR by default.
- [ ] Do not auto-merge unless this Issue explicitly says it is safe.
- [ ] Human approval is required before production-impacting merge.
- [ ] ChatGPT reviews the PR against this Issue before merge.

## Codex Efficiency Rule

Codex should assume a limited usage window, including the 5-hour limit.

- [ ] Avoid fragmented follow-up work.
- [ ] Make the best complete attempt in one run.
- [ ] If not fully complete, leave a clear PR comment with remaining blockers.

## Minimal User Command Target

This Issue should be complete enough that a user can later say:

```text
Codex: execute Issue #<number>
```

and Codex can proceed without asking for basic context.

## Notes

Additional context for Codex:

- 
