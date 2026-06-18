# Issue Number Execution Guide

## Purpose

Enable a short command such as:

```text
Execute Issue #<number>
```

The Issue must contain enough context for implementation and PR creation.

## Flow

```text
ChatGPT creates or verifies an Issue
↓
Implementation agent executes the Issue
↓
Draft PR is created
↓
ChatGPT reviews
↓
User approves when needed
```

## Required Issue Content

A ready Issue must include:

- Goal
- Current state
- Required reading
- Target files or areas
- Allowed scope
- Out of scope
- Completion conditions
- Validation checklist
- PR requirements
- Review policy

Use:

```text
.github/ISSUE_TEMPLATE/codex_task.md
```

## Execution Steps

When asked to execute an Issue number:

1. Open the Issue.
2. Read the Issue fully.
3. Read every document listed under Required Reading.
4. Check `AGENTS.md` and `START_HERE_FOR_AI.md`.
5. Check `docs/mandatory-context-registry.md`.
6. Check management-side `status.md`.
7. Create a task branch.
8. Implement within scope.
9. Run validation or document why it was not run.
10. Open or update a Draft PR.
11. Link the PR to the Issue.

## Stop Conditions

Stop and comment if:

- Goal is missing.
- Scope is unclear.
- Required docs are missing.
- The task needs a decision before implementation.

## Efficiency Rule

Assume a limited work window. Avoid fragmented instructions. A ready Issue should allow one complete implementation attempt.
