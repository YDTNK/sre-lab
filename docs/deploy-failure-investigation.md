# Deploy Failure Investigation Flow

## Purpose

This document defines how SRE Lab should investigate failures in the Cloudflare Worker deploy workflow.

Use this when the `Deploy Worker` workflow fails or when deploy success cannot be confirmed.

## Current Known Good Baseline

The deploy workflow has been verified once from GitHub Actions UI:

```text
Workflow: Deploy Worker
Run: Verify Worker deploy workflow #19
Job: deploy
Result: succeeded
Duration: 22s
```

Known non-blocking warning:

```text
Node.js 20 actions are deprecated.
```

This warning does not mean deploy failure. Track it as maintenance work.

## First Response Checklist

1. Confirm which workflow failed.
2. Confirm which job failed.
3. Confirm which step failed.
4. Confirm whether the result is failure or warning-only.
5. Check the related PR or commit.
6. Check whether the failed change affects active services.
7. Decide whether to create a fix PR, runbook update, incident record, or ask for human action.

## Failure Classification

| Failed step | Likely category | Default action |
| --- | --- | --- |
| Checkout repository | GitHub Actions platform or permissions | Re-run or inspect GitHub status |
| Setup Node.js | GitHub Actions runtime/tooling | Update workflow/runtime if needed |
| Install dependencies | package or lockfile issue | Inspect `apps/api/package.json` and lockfile |
| Check API syntax | JavaScript syntax issue | Fix `apps/api/src/index.js` |
| Deploy Cloudflare Worker | Cloudflare token/account/config issue | Check secrets/config without exposing values |
| Run post-deploy smoke tests | deployed service behavior issue | Investigate endpoint, service state, or recent deploy |
| Warning only | maintenance | Track follow-up; do not treat as outage |

## Cloudflare Deploy Failure Rules

Check:

- whether `CLOUDFLARE_API_TOKEN` exists as a GitHub Actions secret
- whether `CLOUDFLARE_ACCOUNT_ID` exists as a GitHub Actions secret
- whether `apps/api/wrangler.toml` is present and correct
- whether the failure is authentication, account, project, or wrangler config related

Do not ask the user to paste secret values.

Ask for human action only when:

- secret values need to be entered or rotated
- Cloudflare account permissions need to be changed
- billing/account access is involved

## Smoke Test Failure Rules

Check:

- `scripts/smoke-test.sh`
- production frontend URL
- production API URL
- removed service check URL
- latest PRs touching `apps/api/**`, `apps/landing/**`, or `scripts/smoke-test.sh`
- Grafana status for active services

Default actions:

- If the Moving Assistant API fails for valid input, investigate API behavior.
- If AWS Cost Simulator returns 200, treat it as removed-service regression.
- If frontend fails but API succeeds, check Cloudflare Pages and landing app.
- If a monitor targets a removed service, create stale monitoring cleanup instead of restoring the removed service.

## Decision Rules

Create a fix PR when:

- workflow YAML is wrong
- package files are inconsistent
- API syntax is broken
- smoke test script is wrong
- removed service guardrail failed

Create a Codex task when:

- implementation code needs a scoped fix
- tests/checks need to be added
- the change affects `apps/api/**` or meaningful behavior

Ask for human action when:

- secrets must be entered or rotated
- Cloudflare account permissions must be changed
- billing/account settings are involved
- the safest recovery path is ambiguous

Create an incident record when:

- an active production service was unavailable or degraded
- the deploy failure affected users
- manual recovery was required
- the root cause should become operational memory

## Standard Investigation Report

Use this format:

```text
Workflow:
Run:
Job:
Failed step:
Classification:
Impact:
Root cause:
Action taken:
PR / Issue:
Validation result:
Human action required:
Next step:
```
