# Completion Report Template

## Purpose

This document defines the standard completion report for SRE Lab Issues, Pull Requests, operational tasks, and Grafana-created investigations.

The goal is to make completion records consistent, reviewable, and useful for future ChatGPT, Codex, and human operators.

## Standard Format

Use this format when closing or completing an Issue, PR, incident, validation task, or operational workflow:

```text
Issue:
PR:
Merge commit:
Validation:
Deploy:
Monitoring:
Remaining follow-up:
Close decision:
```

## Field Guide

### Issue

Link the GitHub Issue that tracked the work.

```text
Issue: #52 Reach 90-95% AI-assisted operations
```

### PR

Link the Pull Request that implemented the change.

```text
PR: #<number> <title>
```

Use `N/A` only when no repository change was needed.

### Merge commit

Record the merge commit after the PR is merged.

```text
Merge commit: <sha>
```

Use `N/A` for documentation-only comments, triage-only closures, or no-code operational decisions.

### Validation

Record the validation that was actually performed.

Examples:

```text
Validation: bash scripts/validate-pr.sh passed
Validation: node --check apps/api/src/index.js passed
Validation: GitHub Actions CI passed
Validation: Manual UI check by user
```

Do not claim validation that was not performed.

### Deploy

Record deployment result when relevant.

Examples:

```text
Deploy: Deploy Worker succeeded
Deploy: Cloudflare Pages production deployment confirmed
Deploy: N/A, documentation-only change
```

### Monitoring

Record monitoring or post-deploy validation result when relevant.

Examples:

```text
Monitoring: Validate Grafana Dedupe passed
Monitoring: smoke-test passed
Monitoring: N/A, no monitored surface changed
```

### Remaining follow-up

Record any remaining work honestly.

Examples:

```text
Remaining follow-up: none
Remaining follow-up: confirm next Deploy Worker run triggers Validate Grafana Dedupe
Remaining follow-up: production visual check still required
```

### Close decision

Record why the Issue can be closed or why it remains open.

Examples:

```text
Close decision: close as completed
Close decision: keep open until next deploy validates automation
Close decision: close as duplicate of #<number>
Close decision: close as validation artifact
```

## Standard Completion Comment

Use this Markdown block when closing an Issue:

```markdown
## Completion report

Issue:
PR:
Merge commit:
Validation:
Deploy:
Monitoring:
Remaining follow-up:
Close decision:
```

## Rules

- Be explicit when something was not verified.
- Do not hide manual steps.
- Do not mark production-impacting work complete without validation evidence.
- If validation depends on an external UI or secret, record that boundary.
- Link related Issues, PRs, incidents, and workflow runs when available.

## ChatGPT Responsibilities

ChatGPT should use this template when:

- closing completed Issues
- reporting merged PRs
- documenting incident follow-up
- closing Grafana-created Issues
- summarizing post-deploy validation

## Codex Responsibilities

Codex should include the same fields in PR bodies or handoff comments when it implements from an Issue.

## Minimal Version

For tiny safe changes, this shortened version is acceptable:

```text
Issue:
PR:
Validation:
Remaining follow-up:
Close decision:
```
