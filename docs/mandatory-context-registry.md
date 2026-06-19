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

The internal planning context contains project status, roadmap, decision logs, issue planning, and progress notes.

Do not expose internal planning notes as part of the public portfolio surface.

## Context Contract

Before answering, reviewing, implementing, or creating a PR for SRE Lab, AI assistants should check both context sources when available.

If the internal planning context is unavailable, state that limitation before making roadmap, priority, or project-state decisions.

## Required Internal Planning Context

When available, check:

```text
- project-context.md
- mandatory-context-registry.md
- issues.md
- progress.md
- phase1-20-roadmap.md
```

## Required Implementation Context

Before implementation work, check:

```text
YDTNK/sre-lab/START_HERE_FOR_AI.md
YDTNK/sre-lab/AGENTS.md
YDTNK/sre-lab/docs/mandatory-context-registry.md
YDTNK/sre-lab/docs/codex-workflow.md
YDTNK/sre-lab/docs/ai-assisted-85-90-workflow.md
YDTNK/sre-lab/docs/sre-lab-workflow.md
YDTNK/sre-lab/.github/ISSUE_TEMPLATE/codex_task.md
```

## Required Declaration

At the start of substantial SRE Lab work, include:

```text
Checked context sources:
- public implementation context
- internal planning context / unavailable

Missing docs:
- none / <list>
```

If the internal planning context has not been checked, do not claim that the full project context has been confirmed.
