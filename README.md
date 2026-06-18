# SRE Lab

## AI Startup Entry

AIがSRE Lab関連の質問・レビュー・実装判断を行う場合、最初に以下を確認してください。

```text
START_HERE_FOR_AI.md
AGENTS.md
docs/mandatory-context-registry.md
```

SRE Labは2リポジトリ構成です。

```text
YDTNK/sre-lab
= implementation repository

YDTNK/engineering-career-hq
= project management / roadmap / memory repository
```

片方だけを確認して、SRE Labの状態確認完了とは判断しないでください。

管理側の正本:

```text
YDTNK/engineering-career-hq/projects/sre-lab/project-context.md
YDTNK/engineering-career-hq/projects/sre-lab/standards/mandatory-context-registry.md
YDTNK/engineering-career-hq/projects/sre-lab/issues.md
```

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

SRE Lab は、一般向けAIミニサービスを継続的に開発・運用するポートフォリオプロジェクトです。

単にWebアプリを作るだけではなく、公開、CI/CD、監視、アラート、Runbook、運用記録、API安全化、コスト管理、収益化検証まで含めて、小さなサービスを実運用に近い形で育てることを目的としています。

## 現在の状態

```text
Phase 16 v1 checkpoint complete
Revenue release before CKA: planned
Maintenance-only during CKA: planned after revenue release
```

現在は、AI Moving Assistant の初回収益化リリースを CKA / Kubernetes 学習開始前に完了させる方針です。

```text
Revenue: 0 JPY
Payment flow: not implemented
Affiliate flow: not implemented
PDF / template sale: not implemented
Free sample CTA: implemented
Phase 17: planned only for first revenue-route validation
```

CKA / Kubernetes 学習開始後は、新規SRE Lab機能追加を止め、定期メンテナンスのみで運用します。

## 公開URL

- SRE Labトップページ: https://sre-lab.pages.dev/
- Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
- AI Moving Assistant / AI引越し診断: https://sre-lab.pages.dev/moving-assistant.html
- 無料チェックリストサンプル: https://sre-lab.pages.dev/moving-checklist-sample.html
- AI Moving Assistant API: POST /api/moving-assistant

## プロジェクトの位置づけ

このプロジェクトでは、SRE運用基盤の上で、一般ユーザー向けAIサービスを継続的に運用・改善することを重視しています。

現在のPrimary Serviceは以下です。

- AI Moving Assistant / AI引越し診断

AWS Cost Simulatorは過去に2つ目のサービスとして実装していましたが、収益化・自動運転の主軸を一般向けAIサービスへ集中するため、公開サービスから削除しました。

## 実装済みサービス

### AI Moving Assistant / AI引越し診断

日本語の引越し準備支援サービスです。

ユーザーが家具、衣類、家電、本・小物、引越し日、補足メモを入力すると、引越し準備のサマリー、必要資材、チェックリスト、リスクメモ、注意事項を返します。

現在は、安定運用と収益化検証を優先し、fallback responseを返す設計にしています。

実装内容:

- 専用フロントエンドページ
- Cloudflare Workers API
- フロントエンドにAPI keyを置かない構成
- リクエスト検証
- Rate limiting
- Timeoutとfallback response
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- 運用記録
- PDFチェックリストCTA
- クリック可能な無料サンプルCTA
- 無料チェックリストサンプルページ

Endpoint:

```text
POST /api/moving-assistant
```

## 技術構成

| 領域 | 技術 |
|---|---|
| フロントエンド | HTML, CSS, JavaScript |
| ホスティング | Cloudflare Pages |
| API | Cloudflare Workers |
| Secrets管理 | Cloudflare Workers Secrets |
| 利用量・コスト記録 | Cloudflare KV design / docs-based dashboard |
| CI/CD | GitHub Actions, Wrangler |
| 監視 | Grafana Cloud Synthetic Monitoring |
| アラート | Grafana Alerting |
| ドキュメント | Markdown |
| リポジトリ | GitHub |

## Phase 16 Dashboard Policy

Revenue / Cost Dashboardは、管理リポジトリ側でdocsベース運用としています。

```text
YDTNK/engineering-career-hq
projects/sre-lab/revenue-cost-dashboard.md
```

Policy:

```text
Docs-based Revenue / Cost Dashboard
↓
First revenue route validation before CKA
↓
Maintenance-only operation during Kubernetes / CKA learning
↓
Workers / KV / Analytics integration only when needed
```

## アーキテクチャ概要

SRE Labは、Cloudflare PagesとCloudflare Workersを中心に構成しています。
