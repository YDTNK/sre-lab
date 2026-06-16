# GitHub Issue-Based AI Development Flow

## Purpose

This document defines the GitHub Issue based AI development flow for SRE Lab.

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

- Full automatic trigger from GitHub Issue: Not available for the current public repository through Copilot cloud agent automations
- Full automatic trigger from GitHub Issue: Possible only if the repository is private or internal and Copilot cloud agent automations are enabled
- Semi-automatic Issue-number-based workflow: Possible

### Confirmed Capabilities

- Repository read: Possible
- Branch creation: Possible
- File modification: Possible
- PR creation: Possible through GitHub connector after branch push
- Issue assignment to Codex: Supported by GitHub agent apps when OpenAI Codex is enabled for the account/repository
- `@codex` mention: Supported in pull request comments when the OpenAI Codex agent app appears in GitHub's mention autocomplete
- Label-based trigger for Codex itself: Not directly confirmed as a standalone Codex label trigger
- Label-based trigger through Copilot cloud agent automations: Possible in eligible private/internal repositories by using issue trigger filters
- GitHub Actions available: Possible
- Cloudflare auto deploy: Partially confirmed by repository workflows

### Capability Notes

- The connected GitHub app has repository permissions including admin, maintain, pull, push, and triage for `YDTNK/sre-lab`.
- `YDTNK/sre-lab` is currently a public repository.
- Local `gh` CLI is not available in the current Codex environment.
- GitHub label creation is not exposed by the available connector tools in this session.
- The repository already has CI on push and pull request.
- The repository already has a Worker deploy workflow on `main` pushes that touch `apps/api/**` or the Worker deploy workflow.
- Cloudflare Pages deployment is expected through the Cloudflare Pages GitHub integration, but it is not represented directly in this repository as a GitHub Actions workflow.
- GitHub Docs states that the OpenAI Codex coding agent is available for paid Copilot plans and is currently in public preview.
- GitHub Docs states that agent apps can be started from an issue by assigning the agent app to the issue.
- GitHub Docs states that agent apps can be started from a pull request comment by mentioning the agent app.
- GitHub Docs states that Copilot cloud agent automations can run on issue events, but automations are available only in private and internal repositories.

### Automation Decision

For the current public `YDTNK/sre-lab` repository, use the semi-automatic Issue-number-based workflow as the default.

If full GitHub Issue based automatic startup is required, move the repository to private/internal or use a separate private/internal automation repository, then configure Copilot cloud agent automations from the repository Agents tab.

OpenAI Codex can be used as an agent app only after it is enabled and visible in GitHub for the account/repository.

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
- Confirm that the GitHub account has a paid Copilot plan with OpenAI Codex access.
- Confirm that OpenAI Codex is enabled under Copilot policies for the account/repository.
- Confirm that the OpenAI Codex agent app is installed or available for `YDTNK/sre-lab`.
- Confirm that OpenAI Codex appears in the issue assignee picker.
- Confirm that `@codex` or the OpenAI Codex agent app name appears in pull request comment autocomplete.
- If full automation is required, confirm whether the repository can be made private/internal, because Copilot cloud agent automations are not available for public repositories.
- If using automations, create the automation manually from the repository Agents tab with an issue-created trigger and a filter such as `label:codex-task`.
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

- Full automatic startup from GitHub Issue is blocked for the current public repository when relying on Copilot cloud agent automations.
- Codex issue assignment depends on GitHub account/repository access to the OpenAI Codex agent app.
- The exact mention handle must be verified in GitHub autocomplete before standardizing on `@codex`.
- Label creation may need to be done manually.
- The intake workflow can comment on matching issues, but it does not start Codex by itself.
- Frontend deployment through Cloudflare Pages may not appear as a GitHub Actions check.
- Broad issues can produce risky or unfocused changes.

## Next Actions

1. Create the required labels in GitHub.
2. Confirm that OpenAI Codex is available as an agent app in `YDTNK/sre-lab`.
3. Create a small test issue with the AI Task template.
4. Add the `codex-task` label and confirm the intake comment appears.
5. Try assigning the issue to OpenAI Codex from the issue assignee picker.
6. Try mentioning the Codex agent app from a pull request comment using GitHub autocomplete.
7. If assignment or mention is not available, continue using the semi-automatic Issue-number-based workflow.
8. If full automation is required, move to an eligible private/internal repository and configure Copilot cloud agent automation.
