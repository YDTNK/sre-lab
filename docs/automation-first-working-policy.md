# Automation-First Working Policy

## Purpose

This document defines the working policy for SRE Lab and related AI-assisted project operations.

The goal is to minimize manual user work and let ChatGPT, Codex, GitHub integrations, GitHub Actions, and other available automation tools complete all safely automatable work end-to-end.

## Core Policy

```text
Minimize manual work as much as possible.
If ChatGPT, Codex, GitHub integration, GitHub Actions, or another machine-side tool can perform the task safely, the assistant should execute it through completion.
```

This includes, when technically available:

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
- Weekly/monthly review generation through GitHub Actions

## Current Project Direction

SRE Lab is SRE portfolio-first.

```text
Current phase: Ongoing operation automated and verified
Current active target: Normal weekly/monthly operation + human review
Construction phase: completed
Reliability Demo API: implemented / active portfolio demonstration service
```

Do not prioritize revenue-first work, Digital Product LP implementation, Moving Prep Board monetization, or consumer AI service expansion unless the management-side `status.md` explicitly changes.

## Issue-First Rule

Non-trivial work should be Issue-first by default.

```text
Non-trivial work → GitHub Issue → branch/PR/workflow → validation → completion report
```

Create or reuse a GitHub Issue before making repository changes for:

- application code changes
- operations workflow changes
- CI / GitHub Actions changes
- Cloudflare deploy or Worker behavior changes
- Grafana monitoring or alerting changes
- service-state changes
- incident, runbook, or remediation work
- multi-step documentation changes
- any task that should be traceable later

A new Issue is not required for:

- answering a question without repository changes
- very small typo fixes
- small clarification edits inside an already-related PR
- emergency mitigation where creating an Issue would delay response
- work already covered by an existing open Issue

If an existing Issue covers the work, link the PR to that Issue instead of creating a duplicate.

## Expected Assistant Behavior

When the user asks for a project change, the assistant should not stop at instructions if the connected tools can complete the work.

Preferred flow:

```text
Understand requested change
↓
Inspect relevant repository state
↓
Create or reuse GitHub Issue for non-trivial work
↓
Create/update files on a branch
↓
Open a pull request when appropriate
↓
Check the PR state and changed files
↓
Merge when the change is safe and clear
↓
Verify main branch state
↓
Report the final completed result
```

The user should mainly handle:

- Direction and priority decisions
- Portfolio judgment
- External UI actions that the assistant cannot access
- Credentials or secrets entry
- Final judgment for risky or ambiguous production-impacting changes
- Human review of generated weekly/monthly review Markdown

## Default Merge Policy

For small and safe changes, the assistant should merge the pull request after confirming it is mergeable.

Small and safe changes include:

- Documentation updates
- Policy notes
- Runbook clarifications
- Incident records
- Release notes
- Non-destructive text changes
- Clearly scoped configuration documentation

## Safety Exceptions

The assistant should pause and ask for explicit confirmation before completing or merging changes that involve:

- Production-impacting application code changes
- Large diffs
- File deletion
- Secrets, credentials, tokens, or environment variables
- Billing, payment, settlement, or pricing configuration
- Personal information collection or handling
- Destructive operations
- Infrastructure changes that may create cost or outage risk
- Ambiguous instructions where the intended final state is unclear

Even in these cases, the assistant should still do safe preparatory work when possible, such as reading files, drafting a plan, creating a non-destructive proposal, or preparing a reviewable PR.

## Relationship to SRE Lab Portfolio Policy

This policy supports the current project direction:

```text
Operate SRE Lab as an SRE / Platform Engineer portfolio.
Use Reliability Demo API to show SLO, monitoring, alerting, CI/CD, incident response, runbooks, postmortems, API safety, and cost guardrails.
Keep construction complete and move future changes through focused issues only.
```

Automation-first operation should be used to reduce maintenance burden:

- Monitoring checks
- Incident records
- Small documentation fixes
- Broken link fixes
- Grafana alert documentation updates
- Runbook updates
- CI guardrail updates
- Service-state cleanup
- Review Markdown generation

## Practical Rule

When in doubt, the assistant should ask:

```text
Can this be safely done by the connected tools instead of asking the user to do it manually?
```

If yes, the assistant should do it.

For non-trivial SRE Lab work, the assistant should also ask:

```text
Is this already covered by an existing Issue?
```

If not, create one before changing the repository.
