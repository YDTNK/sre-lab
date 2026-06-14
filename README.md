# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

SRE Lab は、複数の小さなAI / SRE系サービスを継続的に開発・運用するポートフォリオプロジェクトです。

単にWebアプリを作るだけではなく、公開、CI/CD、監視、アラート、Runbook、運用記録、API安全化、AI APIのコスト管理まで含めて、小さなサービス群を実運用に近い形で育てることを目的としています。

## 公開URL

- SRE Labトップページ: https://sre-lab.pages.dev/
- Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
- AI Moving Assistant / AI引越し診断: https://sre-lab.pages.dev/moving-assistant.html
- AWS Cost Simulator / AWS料金試算: https://sre-lab.pages.dev/aws-cost-simulator.html
- AI Moving Assistant API: POST /api/moving-assistant
- AWS Cost Simulator API: POST /api/aws-cost-simulator

## プロジェクトの位置づけ

このプロジェクトでは、1つのWebアプリを作って終わりではなく、複数の小さなサービスを継続的に運用・改善することを重視しています。

現在は以下の2つのサービスを公開しています。

- AI Moving Assistant / AI引越し診断
- AWS Cost Simulator / AWS料金試算

どちらのサービスも、Cloudflare Pagesでフロントエンドを公開し、Cloudflare WorkersでAPIを提供しています。  
また、GitHub ActionsによるCI/CD、Grafana Synthetic Monitoringによる外形監視、Grafana Alertingによるアラート、Runbook、運用記録を整備しています。

## 実装済みサービス

### AI Moving Assistant / AI引越し診断

日本語の引越し準備支援サービスです。

ユーザーが家具、衣類、家電、本・小物、引越し日、補足メモを入力すると、引越し準備のサマリー、必要資材、チェックリスト、リスクメモ、注意事項を返します。

現在はOpenAI APIをバックエンド経由で呼び出し、AIによる診断結果を返します。AI APIに障害が発生した場合でも、fallback responseを返す設計にしています。

実装内容:

- 専用フロントエンドページ
- Cloudflare Workers API
- OpenAI API連携
- API keyのCloudflare Workers Secret管理
- フロントエンドにAPI keyを置かない構成
- リクエスト検証
- Rate limiting
- AI利用回数の日次制限
- 推定コスト記録
- コスト上限到達時の停止制御
- Timeoutとfallback response
- AI responseの形式検証
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- 運用記録

Endpoint:

POST /api/moving-assistant

### AWS Cost Simulator / AWS料金試算

AWS月額料金を教育用に概算するサービスです。

EC2、EBS、S3、Data transferの入力値をもとに、固定単価ベースで月額料金の概算を返します。  
AWS Pricing APIや有料AI APIには依存せず、軽量で安全に運用できる2つ目のサービスとして実装しています。

実装内容:

- 専用フロントエンドページ
- Cloudflare Workers API
- EC2 / EBS / S3 / Data transferの概算
- USD to JPYの固定レート換算
- Region whitelist
- EC2 instance type whitelist
- 数値入力の範囲検証
- 標準化されたJSON error response
- AWS Pricing APIに依存しない構成
- 有料AI APIを使わない構成
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- 運用記録

Endpoint:

POST /api/aws-cost-simulator

## 技術構成

| 領域 | 技術 |
|---|---|
| フロントエンド | HTML, CSS, JavaScript |
| ホスティング | Cloudflare Pages |
| API | Cloudflare Workers |
| Secrets管理 | Cloudflare Workers Secrets |
| 利用量・コスト記録 | Cloudflare KV |
| CI/CD | GitHub Actions, Wrangler |
| 監視 | Grafana Cloud Synthetic Monitoring |
| アラート | Grafana Alerting |
| ドキュメント | Markdown |
| リポジトリ | GitHub |

## アーキテクチャ概要

SRE Labは、Cloudflare PagesとCloudflare Workersを中心に構成しています。

概要:

- ユーザーはCloudflare Pages上のフロントエンドにアクセスする
- 各サービスは専用のフロントエンドページを持つ
- フロントエンドからCloudflare Workers APIを呼び出す
- Workers APIでリクエスト検証とサービス別処理を行う
- AI Moving AssistantはバックエンドからのみOpenAI APIを呼び出す
- AWS Cost Simulatorは有料AI APIを使わず、固定単価ベースで計算する
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
| AWS Cost Simulator API | POST | 2xx | sre-lab-aws-cost-simulator-api-down |

共通設定:

- Metric: probe_success
- 条件: below 0.5
- 評価間隔: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## API安全化

AI API連携や公開API運用に備えて、Workers API側で以下の安全対策を実装しています。

- Method validation
- Path validation
- Content-Type validation
- JSON parse error handling
- Request size limit
- Total input length limit
- Standardized JSON error response
- Rate limiting
- AI daily limit
- Cost limit behavior

## 利用量・コスト管理

AI Moving Assistantでは、OpenAI API利用に伴うコスト事故を避けるため、利用状況と推定コストをCloudflare KVに記録しています。

現在の方針:

- Cloudflare KVを即時確認用の主要な運用データとして扱う
- OpenAI Platform Usageは後追い確認用として扱う
- 手動の利用量・コストスナップショットをdocs/usage-cost-report.mdに記録する
- 将来のDashboard設計をdocs/dashboard-design.mdに記録する

現在のコスト方針:

- OpenAI初期クレジット: 5 USD
- Auto recharge: off
- 月間AI予算: 500 JPY
- 月間warning threshold: 300 JPY
- 月間stop threshold: 500 JPY
- 日次hard limit: 100 JPY

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
| docs/aws-cost-simulator.md | AWS Cost Simulator仕様 |
| docs/ai-api-design.md | AI API連携設計 |
| docs/cost.md | AI利用量とコスト管理 |
| docs/usage-cost-report.md | 利用量・コストスナップショット記録 |
| docs/dashboard-design.md | 将来の利用量・コストDashboard設計 |

## 実装・運用で工夫した点

このプロジェクトでは、アプリの機能だけでなく、運用面まで含めて整備しています。

- フロントエンドとAPIを分離した構成にした
- Cloudflare Workersで軽量なAPIを実装した
- GitHub ActionsでCI/CDを構成した
- Workers APIの自動デプロイを設定した
- Grafana Synthetic Monitoringで外形監視を設定した
- サービス別にAlert ruleを作成した
- AlertからRunbookを参照できるようにした
- Incident Log / Operational Recordsを残した
- AI APIの障害時にfallback responseを返すようにした
- AI APIの利用量と推定コストを記録した
- Cost limit behaviorを実装し、課金事故を防ぐ設計にした
- 2つ目のサービスを追加し、複数サービス運用に拡張した

## 現在の状態

現時点で、以下が完了しています。

- 本番公開済みのフロントエンドページが2つある
- 本番公開済みのAPI endpointが2つある
- CI/CDが動作している
- Workers APIの自動デプロイが動作している
- Grafana Synthetic Monitoringを設定済み
- Grafana Alertingを設定済み
- Runbookを作成済み
- Incident Log / Operational Recordsを作成済み
- API安全化を実装済み
- OpenAI API連携を実装済み
- 利用量・コスト管理を実装済み
- 複数サービス運用のドキュメントを整備済み

## 今後の改善予定

今後は以下を追加して、SRE Labをさらに運用しやすい小さなサービス群にしていく予定です。

- Revenue / Cost Dashboard
- GitHub Issuesによる改善タスク管理
- AI Incident Summarizer
- AWS Cost Simulatorの対応リソース追加
- Cloudflare D1による利用量・コスト記録
- 週次運用レポートの自動化
