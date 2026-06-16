# SRE Lab

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

概要:

- ユーザーはCloudflare Pages上のフロントエンドにアクセスする
- AI Moving Assistantは専用のフロントエンドページを持つ
- フロントエンドからCloudflare Workers APIを呼び出す
- Workers APIでリクエスト検証とサービス処理を行う
- Grafana Synthetic MonitoringでフロントエンドとAPI endpointを監視する
- Grafana AlertingからEmail contact pointへ通知する
- Runbookと運用記録で障害対応と変更履歴を管理する
- GitHub ActionsでCIとWorkersデプロイを実行する

詳細:

- docs/architecture.md

## 監視・アラート

現在、以下の監視を設定しています。

| 監視対象 | Method | 期待値 | Alert |
|---|---|---|---|
| フロントエンド | GET | 200 | sre-lab-uptime-down |
| AI Moving Assistant API | POST | 2xx | sre-lab-api-down |

共通設定:

- Metric: probe_success
- 条件: below 0.5
- 評価間隔: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## API安全化

公開API運用と、将来AI APIを再有効化する場合に備えて、Workers API側で以下の安全対策を実装しています。

- Method validation
- Path validation
- Content-Type validation
- JSON parse error handling
- Request size limit
- Total input length limit
- Standardized JSON error response
- Rate limiting
- Cost limit behavior design

## CI/CD

GitHub ActionsでCIとWorkers APIの自動デプロイを設定しています。

CIで確認している内容:

- 必須ファイルの存在確認
- API dependencies install
- API syntax check

Workers APIのデプロイ:

- main branchへのpushで自動デプロイ
- apps/api配下の変更を対象
- workflow_dispatchによる手動実行にも対応
- Cloudflare API TokenとAccount IDはGitHub Secretsで管理

## 運用ドキュメント

| ドキュメント | 役割 |
|---|---|
| docs/portfolio-submission.md | 面談・提出用のポートフォリオ要約 |
| docs/architecture.md | 詳細アーキテクチャと信頼性フロー |
| docs/runbook.md | 障害対応手順 |
| docs/incidents.md | Incident Log / Operational Records |
| docs/operations.md | 日次/週次運用とデプロイ確認 |
| docs/services.md | サービス企画と運用状況 |
| docs/moving-assistant.md | AI Moving Assistant仕様 |
| docs/ai-api-design.md | AI API連携設計 |
| docs/cost.md | AI利用量とコスト管理 |
| docs/usage-cost-report.md | 利用量・コストスナップショット記録 |
| docs/dashboard-design.md | Docs-based Revenue / Cost Dashboard運用と将来の実装方針 |

## 実装・運用で工夫した点

このプロジェクトでは、アプリの機能だけでなく、運用面まで含めて整備しています。

- フロントエンドとAPIを分離した構成にした
- Cloudflare Workersで軽量なAPIを実装した
- GitHub ActionsでCI/CDを構成した
- Workers APIの自動デプロイを設定した
- Grafana Synthetic Monitoringで外形監視を設定した
- AlertからRunbookを参照できるようにした
- Incident Log / Operational Recordsを残した
- 現行のAI Moving Assistant APIでfallback responseを返すようにした
- Cost limit behaviorを実装し、課金事故を防ぐ設計にした
- 収益化検証用にPDFチェックリストCTAを追加した
- 無料チェックリストサンプル導線を追加した

## 停止ポリシー

- CKA / Kubernetes 学習開始前に、AI Moving Assistant の初回収益化リリースを完了させる
- 初回収益化リリース後は、新規SRE Lab機能追加を当面行わない
- CKA / Kubernetes 学習期間中は、監視確認、障害対応、軽微な文言修正、収益/コスト記録などの定期メンテナンスのみ行う
- 決済、アフィリエイト、メール収集、個人情報収集は、初回収益化導線として明示的に判断したもの以外は追加しない
- Future Consumer AI Serviceは、AI Moving Assistant の収益化リリース後、かつCKA学習を遅らせない場合のみ評価する
