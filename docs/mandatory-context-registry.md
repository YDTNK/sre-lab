# Mandatory Context Registry

## Purpose

This document prevents AI assistants from checking only one of the two SRE Lab repositories.

SRE Lab has two repositories with different roles:

```text
YDTNK/sre-lab
= implementation repository

YDTNK/engineering-career-hq
= project management / roadmap / memory repository
```

Neither repository alone is sufficient for reliable work.

## Cross Repository Context Contract

Before answering, reviewing, implementing, or creating a PR for SRE Lab, AI assistants must check both repositories.

```text
Do not answer from only YDTNK/sre-lab.
Do not answer from only YDTNK/engineering-career-hq.
```

## Required engineering-career-hq Files

Always check these management-side files first:

```text
YDTNK/engineering-career-hq/projects/sre-lab/project-context.md
YDTNK/engineering-career-hq/projects/sre-lab/standards/mandatory-context-registry.md
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
YDTNK/engineering-career-hq/projects/sre-lab/progress.md
YDTNK/engineering-career-hq/projects/sre-lab/phase1-20-roadmap.md
```

## Required sre-lab Files

Always check these implementation-side files before implementation work:

```text
YDTNK/sre-lab/AGENTS.md
YDTNK/sre-lab/docs/mandatory-context-registry.md
YDTNK/sre-lab/docs/codex-workflow.md
YDTNK/sre-lab/docs/ai-assisted-85-90-workflow.md
YDTNK/sre-lab/docs/sre-lab-workflow.md
YDTNK/sre-lab/.github/ISSUE_TEMPLATE/codex_task.md
```

## Codex Prompt Efficiency Requirement

When preparing Codex work, also check:

```text
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
Section: Codex Prompt Efficiency Policy
```

Codex instructions must assume the 5-hour limit and should be written so Codex can plan, implement, validate, and open a reviewable Draft PR without repeated clarification.

## Required Declaration

At the start of substantial SRE Lab work, include a short declaration in the response or daily-log:

```text
Checked repositories:
- YDTNK/engineering-career-hq
- YDTNK/sre-lab

Checked required docs:
- project-context.md
- mandatory-context-registry.md
- issues.md
- AGENTS.md
- codex-workflow.md

Missing docs:
- none / <list>
```

If either repository has not been checked, do not claim that the project context is fully confirmed.

## Failure Prevention Checklist

```text
[ ] Did I check engineering-career-hq?
[ ] Did I check sre-lab?
[ ] Did I check the management-side mandatory registry?
[ ] Did I check this implementation-side mandatory registry?
[ ] Did I check issues.md when Codex or roadmap priority is involved?
[ ] Did I check AGENTS.md when implementation is involved?
[ ] Did I check the current daily-log?
```
