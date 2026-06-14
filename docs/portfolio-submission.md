# SRE Lab ポートフォリオ提出用まとめ

## 概要

SRE Lab は、SRE / Platform Engineering向けのポートフォリオとして作成している、小さな複数サービス運用プロジェクトです。

単なるWebアプリではなく、公開、CI/CD、監視、アラート、Runbook、Operational Record、API安全化、AI APIのコスト管理まで含めて、実運用に近い形でサービスを育てています。

現在は以下の2つのサービスを運用しています。

- AI Moving Assistant / AI引越し診断
- AWS Cost Simulator / AWS料金試算

## 公開URL

Frontend:

https://sre-lab.pages.dev/

Workers API:

https://sre-lab-api.daisan-tanaka.workers.dev

AI Moving Assistant:

https://sre-lab.pages.dev/moving-assistant.html

AWS Cost Simulator:

https://sre-lab.pages.dev/aws-cost-simulator.html

## サービス一覧

### AI Moving Assistant / AI引越し診断

日本語の引越し準備支援サービスです。

主な機能:

- 専用Frontendページ
- Cloudflare Workers API
- OpenAI APIをBackend経由で利用
- API keyをCloudflare Workers Secretで管理
- FrontendにAPI keyを置かない構成
- Request validation
- Rate limiting
- AI-specific daily limit
- Estimated cost tracking
- Cost limit behavior
- Timeout and fallback response
- AI response shape validation
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and Operational Records

Endpoint:

POST /api/moving-assistant

### AWS Cost Simulator / AWS料金試算

AWS月額料金を教育用に概算するサービスです。

主な機能:

- 専用Frontendページ
- Cloudflare Workers API
- Deterministic cost calculation
- EC2 / EBS / S3 / Data transfer estimate
- USD to JPY fixed conversion
- Region whitelist
- EC2 instance type whitelist
- Numeric range validation
- No AWS Pricing API dependency
- No paid AI API usage
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and Operational Records

Endpoint:

POST /api/aws-cost-simulator

## 技術構成

| Area | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| Secrets | Cloudflare Workers Secrets |
| Usage / Cost Storage | Cloudflare KV |
| CI/CD | GitHub Actions, Wrangler |
| Monitoring | Grafana Cloud Synthetic Monitoring |
| Alerting | Grafana Alerting |
| Documentation | Markdown |
| Repository | GitHub |

## SRE / Platform Engineeringとしてのポイント

このプロジェクトでは、以下を実装しています。

- Public service operation
- Frontend and API separation
- Multiple service operation
- Service-specific API endpoints
- GitHub Actions CI
- Cloudflare Workers auto deployment
- Synthetic monitoring
- Service-specific alert rules
- Email notification contact point
- Runbook URL attached to alert rules
- Incident and operational records
- API method and path validation
- JSON request validation
- Request size limits
- Rate limiting
- AI cost control
- AI fallback behavior
- Usage and cost tracking
- Documentation-driven operations

## Reliability Design

SRE Labでは、サービス運用とAI API利用の両方に対して信頼性対策を入れています。

主な信頼性対策:

- Cloudflare PagesによるFrontend公開
- Cloudflare WorkersによるAPI分離
- GitHub Actions CI
- Workers auto deployment
- Grafana Synthetic Monitoring from Tokyo
- Grafana Alerting with pending period
- Email notification contact point
- Runbook for first response
- Operational Records for production changes
- Safe fallback for AI API failure
- Cost limit behavior for paid AI API usage

## Monitoring and Alerting

現在の監視対象:

| Target | Method | Expected | Alert |
|---|---|---|---|
| Frontend | GET | 200 | sre-lab-uptime-down |
| AI Moving Assistant API | POST | 2xx | sre-lab-api-down |
| AWS Cost Simulator API | POST | 2xx | sre-lab-aws-cost-simulator-api-down |

共通Alert設定:

- Metric: probe_success
- Condition: below 0.5
- Evaluation interval: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## Cost and Safety Design

AI Moving Assistantでは、OpenAI APIをBackend経由で利用しています。

Cost / Safety controls:

- API key is never exposed to frontend JavaScript
- OpenAI API key is stored as Cloudflare Workers Secret
- AI request timeout is enforced
- Fallback response is returned when AI fails
- Estimated usage and cost are recorded in Cloudflare KV
- Daily AI limit is enforced
- Monthly estimated cost limit is enforced
- OpenAI auto recharge is off

AWS Cost Simulatorは、意図的に有料APIを使わない構成です。

Cost / Safety controls:

- No AWS Pricing API call
- No OpenAI API call
- Deterministic fixed pricing table
- Clear educational disclaimer
- Input validation before calculation

## Operational Records

運用記録は docs/incidents.md に残しています。

記録例:

- Initial production readiness check
- Worker auto deployment verification
- API safety hardening verification
- KV-based rate limiting verification
- OpenAI API integration verification
- AI cost tracking and daily limit verification
- cost_limit_reached behavior verification
- Usage and cost snapshot recording
- AWS Cost Simulator service planning
- AWS Cost Simulator frontend implementation
- AWS Cost Simulator API endpoint implementation
- AWS Cost Simulator deterministic calculation
- AWS Cost Simulator API validation
- AWS Cost Simulator monitoring setup
- Multi-service documentation polish

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
- AI APIの利用量とコストを制御できる
- 複数の小さなサービスを1つのPlatformとして運用できる
- 継続的に改善できる

## 面談での説明例

SRE Labは、Cloudflare PagesとWorkers上で複数の小さなサービスを運用するSREポートフォリオです。1つ目はAI引越し診断で、OpenAI APIをBackend経由で安全に呼び出し、Rate limit、Fallback、Cost trackingを実装しています。2つ目はAWS料金試算で、AI APIを使わず固定単価ベースで月額概算を返します。両サービスに対してGrafana Synthetic Monitoring、Alert rule、Runbook、Operational Recordを整備しており、単なるアプリ開発ではなく、運用・監視・改善まで含めた実績として作っています。

## 現在の状態

SRE Labの現在の状態:

- Two production frontend pages
- Two production API endpoints
- CI/CD
- Worker auto deployment
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- Incident and Operational Records
- API safety controls
- AI API integration
- Cost tracking
- Multi-service documentation

## 今後の改善候補

- Revenue / Cost Dashboard
- GitHub Issuesによる改善タスク管理
- AI Incident Summarizer
- AWS Cost Simulatorの対応リソース追加
- Cloudflare D1によるusage / cost storage
- 週次運用レポートの自動化
