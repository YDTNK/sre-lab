# START HERE FOR AI - SRE Lab

## Purpose

新規ChatGPT / Codex / Claude / Cursorチャットで、SRE Lab作業の対象リポジトリを誤認しないための入口です。

SRE Labは、公開実装リポジトリとprivate管理コンテキストを分けて運用します。

```text
Public implementation repository:
- YDTNK/sre-lab

Private management context:
- project status
- roadmap
- decision log
- issue planning
- progress notes
```

公開ポートフォリオとして見せる情報と、管理者向けの内部運用コンテキストは分離します。

## Copy-Paste Startup Prompt

```text
SRE Labプロジェクトについて、公開実装リポジトリとprivate管理コンテキストの両方を確認してから回答してください。

Implementation repository:
https://github.com/YDTNK/sre-lab

Private management repository:
YDTNK/engineering-career-hq

最初に以下を確認してください。

1. private management context for SRE Lab: project-context.md
2. private management context for SRE Lab: mandatory-context-registry.md
3. private management context for SRE Lab: issues.md
4. private management context for SRE Lab: progress.md
5. private management context for SRE Lab: phase1-20-roadmap.md
6. sre-lab/AGENTS.md
7. sre-lab/docs/mandatory-context-registry.md
8. 必要に応じて sre-lab/docs/codex-workflow.md

確認後、参照したファイルと不足ファイルをリスト化してから作業してください。

private管理コンテキストにアクセスできない場合は、その制約を明示し、ロードマップ判断・優先順位判断を断定しないでください。
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
- project-context.md
- mandatory-context-registry.md
- issues.md
- progress.md
- phase1-20-roadmap.md
- AGENTS.md
- sre-lab/docs/mandatory-context-registry.md

Missing:
- none / <list>
```

公開実装リポジトリしか確認できていない場合は、確認完了とは言わないこと。
