# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

SRE Lab は、複数の小さなAI/SRE系サービスを継続的に開発・運用する、SRE / Platform Engineering向けのポートフォリオプロジェクトです。

単なるWebアプリではなく、公開、CI/CD、監視、アラート、Runbook、Operational Record、API安全化、AI APIのコスト管理まで含めて、実運用に近い形で小さなサービス群を育てることを目的としています。

## 公開URL

- フロントエンド: https://sre-lab.pages.dev/
- Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
- AI Moving Assistant / AI引越し診断: https://sre-lab.pages.dev/moving-assistant.html
- AWS Cost Simulator / AWS料金試算: https://sre-lab.pages.dev/aws-cost-simulator.html
- AI Moving Assistant API: POST /api/moving-assistant
- AWS Cost Simulator API: POST /api/aws-cost-simulator

## プロジェクトの目的

このプロジェクトの目的は、アプリケーションを作るだけではなく、小さな本番相当サービスを運用できることを示すことです。

重視している点:

- Frontend/API分離
- 複数サービス運用
- GitHub ActionsによるCI/CD
- Cloudflare Workersの自動デプロイ
- Grafana Synthetic Monitoringによる外形監視
- Grafana Alertingによるアラート
- Runbookによる障害対応手順
- Incident Log / Operational Recordによる運用記録
- API検証、rate limiting、cost control
- AI APIを安全に扱う設計

## 現在運用中のサービス

### AI Moving Assistant / AI引越し診断

AI Moving Assistant は、日本語の引越し準備支援サービスです。

主な機能:

- 専用フロントエンドページ
- Cloudflare Workers API
- OpenAI APIをバックエンド経由で利用
- API keyはCloudflare Workers Secretで管理
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
- RunbookとOperational Records

Endpoint:

POST /api/moving-assistant

### AWS Cost Simulator / AWS料金試算

AWS Cost Simulator は、AWS月額料金を教育用に概算する小さなサービスです。

主な機能:

- 専用フロントエンドページ
- Cloudflare Workers API
- EC2 / EBS / S3 / Data transferの固定単価ベース概算
- USD to JPYの固定レート換算
- Region whitelist
- EC2 instance type whitelist
- 数値入力の範囲検証
- 標準化されたJSON error response
- AWS Pricing APIに依存しない構成
- 有料AI APIは不使用
- Grafana Synthetic Monitoring
- Grafana Alerting
- RunbookとOperational Records

Endpoint:

POST /api/aws-cost-simulator

## アーキテクチャ概要

SRE Lab は Cloudflare Pages と Cloudflare Workers を中心に構成しています。

概要:

- ユーザーはCloudflare Pages上のフロントエンドにアクセスする
- 各サービスは専用のフロントエンドページを持つ
- フロントエンドからCloudflare Workers APIを呼び出す
- Workers APIでリクエスト検証とサービス別処理を行う
- AI Moving AssistantはバックエンドからのみOpenAI APIを呼び出す
- AWS Cost Simulatorは有料AI APIを使わず、固定単価ベースで計算する
- Grafana Synthetic MonitoringでフロントエンドとAPI endpointを監視する
- Grafana AlertingからEmail contact pointへ通知する
- RunbookとOperational Records support incident response
- GitHub ActionsでCIとWorkersデプロイを実行する

詳細アーキテクチャ:

- docs/architecture.md

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

## SRE / 運用面の実装内容

このプロジェクトで実装しているSRE要素:

- 公開フロントエンドの運用
- 公開Workers APIの運用
- Frontend/API分離
- 複数サービス運用
- サービス別API endpoint
- GitHub ActionsによるCI
- Workers自動デプロイ
- フロントエンドの外形監視
- 複数API endpointの外形監視
- サービス別Alert rule
- Email通知用Contact point
- Runbook
- Incident Log / Operational Records
- Operations Guide
- Architecture documentation
- API入力検証
- JSON error responseの標準化
- Rate limiting
- AI利用量とコストの記録
- AI利用回数の日次制限
- コスト上限到達時の停止制御
- Timeoutとfallback behavior
- AI response validation

## 監視・アラート

現在の監視対象:

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

## 利用量・コスト管理

AI Moving Assistant では、OpenAI API利用に伴うコスト事故を避けるため、利用状況と推定コストをCloudflare KVに記録しています。

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

## ドキュメント

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
| docs/usage-cost-report.md | 手動の利用量・コストスナップショット記録 |
| docs/dashboard-design.md | 将来の利用量・コストDashboard設計 |

## ポートフォリオとして示せること

このプロジェクトで示せること:

- 小さなサービスを公開できる
- Frontend/APIを分離できる
- Cloudflare WorkersでバックエンドAPIを構築できる
- GitHub ActionsでCI/CDを組める
- Grafanaで外形監視を設定できる
- Alert ruleとContact pointを設定できる
- RunbookとOperational Recordを残せる
- AI APIをバックエンド経由で安全に扱える
- Rate limitingやcost controlを実装できる
- 2つ目のサービスを追加し、複数サービス運用へ拡張できる

## 面談での説明例

面談での説明例:

SRE Labは、Cloudflare PagesとWorkers上で複数の小さなサービスを運用するSREポートフォリオです。1つ目はAI引越し診断で、OpenAI APIをBackend経由で安全に呼び出し、Rate limit、Fallback、Cost trackingを実装しています。2つ目はAWS料金試算で、AI APIを使わず固定単価ベースで月額概算を返します。両サービスに対してGrafana Synthetic Monitoring、Alert rule、Runbook、Operational Recordを整備しており、単なるアプリ開発ではなく、運用・監視・改善まで含めた実績として作っています。

## 現在の状態

現在の状態:

- 本番公開済みのフロントエンドページが2つある
- 本番公開済みのAPI endpointが2つある
- CI/CD
- Workers自動デプロイ
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- Incident Log / Operational Records
- API安全化
- AI API連携
- コスト記録
- 複数サービス運用のドキュメント
