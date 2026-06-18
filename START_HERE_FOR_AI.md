# START HERE FOR AI - SRE Lab

## Purpose

新規ChatGPT / Codex / Claude / Cursorチャットで、SRE Lab作業の対象リポジトリを誤認しないための入口です。

SRE Labは2リポジトリ構成です。

```text
YDTNK/sre-lab
= implementation repository

YDTNK/engineering-career-hq
= project management / roadmap / memory repository
```

片方だけでは正しい現在地を判断できません。

## Copy-Paste Startup Prompt

```text
SRE Labプロジェクトについて、以下2リポジトリを必ず参照して回答してください。

Management repository:
https://github.com/YDTNK/engineering-career-hq

Implementation repository:
https://github.com/YDTNK/sre-lab

最初に以下を確認してください。

1. engineering-career-hq/projects/sre-lab/project-context.md
2. engineering-career-hq/projects/sre-lab/standards/mandatory-context-registry.md
3. engineering-career-hq/projects/sre-lab/issues.md
4. engineering-career-hq/projects/sre-lab/progress.md
5. engineering-career-hq/projects/sre-lab/phase1-20-roadmap.md
6. sre-lab/AGENTS.md
7. sre-lab/docs/mandatory-context-registry.md
8. 必要に応じて sre-lab/docs/codex-workflow.md

確認後、参照したファイルと不足ファイルをリスト化してから作業してください。
```

## Wrong Repository Guard

SRE Labの確認で以下を参照している場合は誤りです。

```text
YDTNK/terraform-aws-lab
```

Terraform AWS構築プロジェクトとSRE Labは別プロジェクトです。

## Required Declaration

作業開始時にAIは以下を宣言します。

```text
Checked repositories:
- YDTNK/engineering-career-hq
- YDTNK/sre-lab

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

片方のリポジトリしか確認できていない場合は、確認完了とは言わないこと。
