# START HERE FOR AI - SRE Lab

## Purpose

新規ChatGPT / Codex / Claude / Cursorチャットで、SRE Lab作業の対象リポジトリと現在地を誤認しないための入口です。

SRE Labは、公開実装リポジトリとprivate管理コンテキストを分けて運用します。

```text
Public implementation repository:
- YDTNK/sre-lab

Private management context:
- project status
- portfolio requirements
- roadmap / issue planning
- decision log
- progress notes
- weekly / monthly operation reviews
```

公開ポートフォリオとして見せる情報と、管理者向けの内部運用コンテキストは分離します。

## Current State

```text
Current phase: Ongoing operation automated and verified
Current active target: Normal weekly/monthly operation + human review
Construction phase: completed
Reliability Demo API: implemented / active portfolio demonstration service
```

Do not treat old references to Issue #74, Issue #88 as active, PR #60, Phase 16, revenue-first, or Moving Prep monetization as current.

## Copy-Paste Startup Prompt

```text
SRE Labプロジェクトについて、公開実装リポジトリとprivate管理コンテキストの両方を確認してから回答してください。

Implementation repository:
https://github.com/YDTNK/sre-lab

Private management repository:
YDTNK/engineering-career-hq

最初に以下を確認してください。

1. private management context for SRE Lab: status.md
2. private management context for SRE Lab: portfolio-requirements.md
3. private management context for SRE Lab: project-context.md
4. private management context for SRE Lab: mandatory-context-registry.md
5. private management context for SRE Lab: issues.md
6. private management context for SRE Lab: progress.md
7. private management context for SRE Lab: operations/construction-complete-operating-policy.md
8. private management context for SRE Lab: latest weekly/monthly review if relevant
9. sre-lab/AGENTS.md
10. sre-lab/docs/mandatory-context-registry.md
11. 必要に応じて sre-lab/docs/codex-workflow.md

確認後、参照したファイルと不足ファイルをリスト化してから作業してください。

private管理コンテキストにアクセスできない場合は、その制約を明示し、ロードマップ判断・優先順位判断を断定しないでください。

legacy-revenue-route / old revenue / Moving Prep materials are historical only unless status.md explicitly reactivates them.
```

## Wrong Repository Guard

SRE Labの確認で以下を主対象としている場合は誤りです。

```text
YDTNK/terraform-aws-lab
```

Terraform AWS構築プロジェクトとSRE Labは別プロジェクトです。

## Required Declaration

作業開始時にAIは以下を宣言します。

```text
Checked repositories / context sources:
- YDTNK/sre-lab
- private management context for SRE Lab

Checked docs:
- status.md
- portfolio-requirements.md
- project-context.md
- mandatory-context-registry.md
- issues.md
- progress.md
- operations/construction-complete-operating-policy.md
- AGENTS.md
- sre-lab/docs/mandatory-context-registry.md

Missing:
- none / <list>
```

公開実装リポジトリしか確認できていない場合は、確認完了とは言わないこと。
