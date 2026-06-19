# Mandatory Context Registry

## Purpose

This document prevents AI assistants from checking only the public implementation repository when working on SRE Lab.

SRE Lab uses two kinds of context:

```text
1. Public implementation context
2. Internal planning context
```

The public implementation context is this repository:

```text
YDTNK/sre-lab
```

The internal planning context contains project status, portfolio requirements, roadmap decisions, issue planning, and progress notes.

Do not expose internal planning notes as part of the public portfolio surface.

## Current State

```text
Current phase: Portfolio evidence loop completed
Current active target: Final full-site QA and optional polish
Tracking Issue: #88
Reliability Demo API: implemented / active portfolio demonstration service
```

## Context Contract

Before answering, reviewing, implementing, or creating a PR for SRE Lab, AI assistants should check both context sources when available.

If the internal planning context is unavailable, state that limitation before making roadmap, priority, or project-state decisions.

## Required Internal Planning Context

When available, check:

```text
- status.md
- portfolio-requirements.md
- project-context.md
- mandatory-context-registry.md
- issues.md
- progress.md
```

Do not require or rely on removed legacy roadmap files such as `phase1-20-roadmap.md` as active context.

## Required Implementation Context

Before implementation work, check:

```text
YDTNK/sre-lab/START_HERE_FOR_AI.md
YDTNK/sre-lab/AGENTS.md
YDTNK/sre-lab/docs/mandatory-context-registry.md
YDTNK/sre-lab/docs/services.md
YDTNK/sre-lab/docs/runbooks/reliability-demo-api.md
YDTNK/sre-lab/docs/slo/reliability-demo-api.md
YDTNK/sre-lab/docs/cost.md
YDTNK/sre-lab/docs/codex-workflow.md
YDTNK/sre-lab/docs/ai-assisted-85-90-workflow.md
YDTNK/sre-lab/docs/sre-lab-workflow.md
YDTNK/sre-lab/.github/ISSUE_TEMPLATE/codex_task.md
```

## Legacy Context Rule

These are historical only unless the management-side `status.md` explicitly reactivates them:

```text
- revenue-first route
- Moving Prep Board monetization
- Digital Product LP
- Issue #69
- Issue #70
- Issue #74 as current active work
- PR #60 as current active work
- Phase 16 / Phase 17 revenue validation route
- docs/archive/legacy-revenue-route/
```

## Required Declaration

At the start of substantial SRE Lab work, include:

```text
Checked context sources:
- public implementation context
- internal planning context / unavailable

Checked docs:
- status.md
- portfolio-requirements.md
- project-context.md
- issues.md
- progress.md
- START_HERE_FOR_AI.md
- AGENTS.md
- docs/mandatory-context-registry.md

Missing docs:
- none / <list>
```

If the internal planning context has not been checked, do not claim that the full project context has been confirmed.
