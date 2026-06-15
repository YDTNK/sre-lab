# SRE Lab ポートフォリオ提出用まとめ

## 概要

SRE Lab は、SRE / Platform Engineering向けのポートフォリオとして作成している、小さな一般向けAIサービス運用プロジェクトです。

単なるWebアプリではなく、公開、CI/CD、監視、アラート、Runbook、Operational Record、API安全化、コスト管理、収益化検証まで含めて、実運用に近い形でサービスを育てています。

現在は以下の状態です。

```text
Stopped at Phase 16 v1 checkpoint
```

現在のactive serviceは以下です。

- AI Moving Assistant / AI引越し診断

AWS Cost Simulator / AWS料金試算は過去に実装していましたが、現在はactive service portfolioから削除済みです。

## 公開URL

Frontend:

https://sre-lab.pages.dev/

Workers API:

https://sre-lab-api.daisan-tanaka.workers.dev

AI Moving Assistant:

https://sre-lab.pages.dev/moving-assistant.html

Free moving checklist sample:

https://sre-lab.pages.dev/moving-checklist-sample.html

## サービス一覧

### AI Moving Assistant / AI引越し診断

日本語の引越し準備支援サービスです。

主な機能:

- 専用Frontendページ
- Cloudflare Workers API
- FrontendにAPI keyを置かない構成
- Request validation
- Rate limiting
- Timeout and fallback response
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook / Operational Records
- PDF checklist CTA
- Free sample CTA
- Free moving checklist sample page

Endpoint:

```text
POST /api/moving-assistant
```

### Removed Historical Service: AWS Cost Simulator / AWS料金試算

AWS Cost Simulatorは、以前に教育用のAWS月額料金試算サービスとして実装していました。

現在は以下の理由によりactive service portfolioから削除済みです。

- SRE Labの収益化方針を一般向けAIサービスに集中するため
- AWS公式Calculatorが強く、単体収益化の主役にしづらいため
- AI Moving Assistantへ導線と説明を集中するため

## 技術構成

| Area | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| Secrets | Cloudflare Workers Secrets |
| CI/CD | GitHub Actions, Wrangler |
| Monitoring | Grafana Cloud Synthetic Monitoring |
| Alerting | Grafana Alerting |
| Documentation | Markdown |
| Repository | GitHub |

## SRE / Platform Engineeringとしてのポイント

このプロジェクトでは、以下を実装しています。

- 公開サービスの運用
- Frontend/API分離
- サービス別API endpoint
- GitHub ActionsによるCI
- Cloudflare Workersの自動デプロイ
- 外形監視
- Alert rule
- Email通知用Contact point
- Alert ruleへのRunbook URL設定
- Incident Log / Operational Records
- API method / path validation
- JSON request validation
- Request size limit
- Rate limiting
- Fallback behavior
- Documentation-driven operations
- Docs-based Revenue / Cost Dashboard

## Reliability Design

SRE Labでは、サービス運用に対して信頼性対策を入れています。

主な信頼性対策:

- Cloudflare PagesによるFrontend公開
- Cloudflare WorkersによるAPI分離
- GitHub ActionsによるCI
- Workers auto deployment
- Grafana Synthetic Monitoring from Tokyo
- Grafana Alerting with pending period
- Email通知用Contact point
- Runbook for first response
- Operational Records for production changes
- Safe fallback behavior
- Cost guard design for future paid AI API usage

## Monitoring and Alerting

現在の監視対象:

| Target | Method | Expected | Alert |
|---|---|---|---|
| Frontend | GET | 200 | sre-lab-uptime-down |
| AI Moving Assistant API | POST | 2xx | sre-lab-api-down |

共通Alert設定:

- Metric: probe_success
- Condition: below 0.5
- Evaluation interval: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## Cost and Safety Design

AI Moving Assistantは、将来的にAI APIを安全に使えるよう、Backend経由・API安全化・Rate limiting・fallbackを前提に設計しています。

Current status:

```text
Revenue: 0 JPY
Payment flow: not implemented
Affiliate flow: not implemented
PDF / template sale: not implemented
Free sample CTA: implemented
Phase 17: not started
```

Current controls:

- API key is never exposed to frontend JavaScript
- Request validation is implemented
- Rate limiting is implemented
- Fallback response is available
- Free sample CTA is implemented
- No payment flow
- No affiliate flow
- No email collection
- No personal information collection

## Operational Records

運用記録は docs/incidents.md に残しています。

記録例:

- Initial production readiness check
- Workers auto deployment verification
- API safety hardening verification
- KV-based rate limiting verification
- AI Moving Assistant operational improvements
- AWS Cost Simulator historical implementation and removal context
- Phase 15 distribution / acquisition setup
- Free sample CTA / sample page setup
- Phase 16 docs-based dashboard policy

## このプロジェクトで示せること

このプロジェクトでは、単にアプリを作るだけではなく、以下を示せます。

- 小さなサービスアーキテクチャを設計できる
- FrontendとAPIの責務を分離できる
- サービスを公開できる
- CI/CD workflowを構築できる
- 監視とアラートを設定できる
- Runbookを定義できる
- Operational Recordを残せる
- API safetyを考慮できる
- 将来のAI API利用量とコスト制御を設計できる
- 収益化検証導線を小さく追加できる
- 継続的に改善できる

## 面談での説明例

SRE Labは、Cloudflare PagesとWorkers上で小さな一般向けAIサービスを運用するSREポートフォリオです。現在のactive serviceはAI引越し診断で、Frontend/API分離、GitHub ActionsによるCI/CD、Workers自動デプロイ、Grafana Synthetic Monitoring、Alert、Runbook、Operational Recordを整備しています。さらに、API safety、Rate limiting、Fallback、無料チェックリストサンプル導線、Revenue / Cost Dashboard設計まで入れており、単なるアプリ開発ではなく、運用・監視・改善・収益化検証まで含めた実績として作っています。現在はPhase 16 v1 checkpointで一旦停止し、次の学習フェーズであるKubernetes / CKA preparationへ移行します。

## 現在の状態

SRE Labの現在の状態:

- 本番公開済みFrontendページ
- 本番公開済みAPI endpoint
- Free sample page
- CI/CD
- Workers auto deployment
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- Incident Log / Operational Records
- API safety controls
- Rate limiting
- Fallback response
- Free sample CTA
- Docs-based Revenue / Cost Dashboard

## 今後の方針

- 新規SRE Lab機能追加は当面行わない
- Phase 17には実収益導線ができるまで進まない
- Revenue / Cost Dashboardは月次またはイベント発生時に更新する
- 次のactive learning focusは Kubernetes / CKA preparation に移す
