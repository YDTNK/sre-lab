# GitHub Issue-Based AI Development Flow

## Purpose

This document defines the semi-automated GitHub Issue based development flow for SRE Lab.

Target flow:

```text
ChatGPT
↓
GitHub Issue
↓
AI task label
↓
Codex or coding agent work
↓
Feature branch
↓
Pull request
↓
Human review
↓
Merge
↓
Cloudflare deployment
```

## Current Feasibility Report

### Result

- Full automatic trigger from GitHub Issue: Unknown
- Semi-automatic Issue-number-based workflow: Possible

### Confirmed Capabilities

- Repository read: Possible
- Branch creation: Possible
- File modification: Possible
- PR creation: Possible through GitHub connector after branch push
- Issue assignment to Codex: Unknown
- `@codex` mention: Unknown
- Label-based trigger for Codex itself: Unknown
- GitHub Actions available: Possible
- Cloudflare auto deploy: Partially confirmed by repository workflows

### Capability Notes

- The connected GitHub app has repository permissions including admin, maintain, pull, push, and triage for `YDTNK/sre-lab`.
- Local `gh` CLI is not available in the current Codex environment.
- GitHub label creation is not exposed by the available connector tools in this session.
- The repository already has CI on push and pull request.
- The repository already has a Worker deploy workflow on `main` pushes that touch `apps/api/**` or the Worker deploy workflow.
- Cloudflare Pages deployment is expected through the Cloudflare Pages GitHub integration, but it is not represented directly in this repository as a GitHub Actions workflow.

## Required Labels

Create or reuse these labels in GitHub:

```text
ai-task
codex-task
visual-improvement
conversion-improvement
sre-lab
needs-human-review
```

These labels are referenced by:

- `.github/ISSUE_TEMPLATE/ai-task.md`
- `.github/workflows/ai-task-intake.yml`

## Semi-Automatic Workflow

Use this workflow when GitHub Issue events cannot directly start Codex.

1. Create an issue with the AI Task template.
2. Add the `codex-task` label.
3. Give Codex the issue number and repository name.
4. Codex reads the issue and checks target files.
5. Codex creates a feature branch.
6. Codex implements only the requested scope.
7. Codex runs relevant validation.
8. Codex opens a pull request.
9. A human reviews and merges the pull request.
10. Deployment follows the existing GitHub and Cloudflare pipeline.

## Required Manual Steps

- Create the labels if they do not already exist.
- Confirm whether GitHub Agent / Agent HQ / coding agent features are enabled for the account.
- Confirm whether `@codex` mention or assignment is supported in this repository.
- Review and merge AI-generated pull requests manually.
- Confirm Cloudflare Pages deployment from the Cloudflare dashboard when frontend files change.

## Recommended Issue Scope

Prefer issues that fit one small pull request:

- Visual improvement on one existing page
- CTA wording or layout improvement
- Documentation update
- Accessibility or responsive layout fix
- Conversion path cleanup

Avoid broad issues that mix:

- API behavior changes
- New paid services
- New data collection
- External dependencies
- Multiple unrelated frontend redesigns

## SRE Lab Safety Constraints

- Do not push directly to main
- Do not merge automatically
- Do not change API behavior unless explicitly requested
- Do not add paid services or external dependencies unless explicitly approved
- Do not add personal information collection
- Preserve disclaimer / privacy / disclosure language
- Keep Cloudflare Pages compatibility
- Prefer existing pages and conversion paths over new features

## Priority Target Files

```text
apps/landing/index.html
apps/landing/moving-assistant.html
apps/landing/moving-checklist-sample.html
apps/landing/styles.css
```

## Pull Request Expectations

Each AI task pull request should include:

- Summary of what changed
- Changed files
- Validation performed
- Visual changes or screenshots when relevant
- Risk notes
- Human review required notice

## Risks

- Full automatic Codex startup from GitHub Issue is not confirmed.
- Label creation may need to be done manually.
- The intake workflow can comment on matching issues, but it does not start Codex by itself.
- Frontend deployment through Cloudflare Pages may not appear as a GitHub Actions check.
- Broad issues can produce risky or unfocused changes.

## Next Actions

1. Create the required labels in GitHub.
2. Create a small test issue with the AI Task template.
3. Add the `codex-task` label and confirm the intake comment appears.
4. Give the issue number to Codex.
5. Confirm Codex can complete the branch-to-PR flow.
