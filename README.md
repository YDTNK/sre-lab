# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

SRE Lab は、複数の小さなAI/SRE系サービスを継続的に開発・運用する、SRE / Platform Engineering向けのポートフォリオプロジェクトです。

単なるWebアプリではなく、公開、CI/CD、監視、アラート、Runbook、Operational Record、API安全化、AI APIのコスト管理まで含めて、実運用に近い形で小さなサービス群を育てることを目的としています。

## Live Demo

- Frontend: https://sre-lab.pages.dev/
- Workers API: https://sre-lab-api.daisan-tanaka.workers.dev
- AI Moving Assistant: https://sre-lab.pages.dev/moving-assistant.html
- AWS Cost Simulator: https://sre-lab.pages.dev/aws-cost-simulator.html
- AI Moving Assistant API: POST /api/moving-assistant
- AWS Cost Simulator API: POST /api/aws-cost-simulator

## Project Goal

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
- API validation / rate limiting / cost control
- AI APIを安全に扱う設計

## Current Services

### AI Moving Assistant / AI引越し診断

AI Moving Assistant は、日本語の引越し準備支援サービスです。

主な機能:

- 専用Frontendページ
- Cloudflare Workers API
- OpenAI APIをBackend経由で利用
- API keyはCloudflare Workers Secretで管理
- FrontendにAPI keyを置かない構成
- Request validation
- Rate limiting
- AI daily limit
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

AWS Cost Simulator は、AWS月額料金を教育用に概算する小さなサービスです。

主な機能:

- 専用Frontendページ
- Cloudflare Workers API
- EC2 / EBS / S3 / Data transfer の固定単価ベース概算
- USD to JPY固定レート換算
- Region whitelist
- EC2 instance type whitelist
- Numeric range validation
- Standardized JSON error response
- No AWS Pricing API dependency
- No paid AI API usage
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and Operational Records

Endpoint:

POST /api/aws-cost-simulator

## Architecture

SRE Lab は Cloudflare Pages と Cloudflare Workers を中心に構成しています。

概要:

- User accesses Cloudflare Pages frontend
- Each service has a dedicated frontend page
- Frontend calls Cloudflare Workers API
- Workers API performs validation and service-specific processing
- AI Moving Assistant calls OpenAI API only from backend
- AWS Cost Simulator performs deterministic calculation without paid AI API
- Grafana Synthetic Monitoring checks frontend and API endpoints
- Grafana Alerting sends notifications to email contact point
- Runbook and Operational Records support incident response
- GitHub Actions performs CI and Worker deployment

Detailed architecture:

- docs/architecture.md

## Tech Stack

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

## SRE / Operations Features

このプロジェクトで実装しているSRE要素:

- Public frontend deployment
- Public Workers API deployment
- Frontend/API separation
- Multiple service operation
- Service-specific API endpoints
- GitHub Actions CI
- Workers auto deployment
- Synthetic monitoring for frontend
- Synthetic monitoring for multiple API endpoints
- Service-specific alert rules
- Email notification contact point
- Runbook
- Incident Log / Operational Records
- Operations Guide
- Architecture documentation
- API input validation
- JSON error response standardization
- Rate limiting
- AI usage and cost tracking
- AI-specific daily limits
- Cost limit behavior
- Timeout and fallback behavior
- AI response validation

## Monitoring and Alerting

現在の監視対象:

| Target | Method | Expected | Alert |
|---|---|---|---|
| Frontend | GET | 200 | sre-lab-uptime-down |
| AI Moving Assistant API | POST | 2xx | sre-lab-api-down |
| AWS Cost Simulator API | POST | 2xx | sre-lab-aws-cost-simulator-api-down |

共通設定:

- Metric: probe_success
- Condition: below 0.5
- Evaluation interval: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## Usage / Cost Monitoring

AI Moving Assistant では、OpenAI API利用に伴うコスト事故を避けるため、利用状況と推定コストをCloudflare KVに記録しています。

現在の方針:

- Cloudflare KVを即時確認用のprimary operational sourceとする
- OpenAI Platform Usageをsecondary reconciliation sourceとする
- Manual usage and cost snapshotsをdocs/usage-cost-report.mdに記録する
- Future dashboard designをdocs/dashboard-design.mdに記録する

現在のCost policy:

- OpenAI initial credit: 5 USD
- Auto recharge: off
- Monthly AI budget: 500 JPY
- Monthly warning threshold: 300 JPY
- Monthly stop threshold: 500 JPY
- Daily hard limit: 100 JPY

## Documentation

| Document | Purpose |
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
| docs/cost.md | AI usage and cost operations |
| docs/usage-cost-report.md | Manual usage and cost snapshot records |
| docs/dashboard-design.md | Future usage and cost dashboard design |

## Portfolio Summary

このプロジェクトで示せること:

- 小さなサービスを公開できる
- Frontend/APIを分離できる
- Cloudflare WorkersでBackend APIを構築できる
- GitHub ActionsでCI/CDを組める
- Grafanaで外形監視を設定できる
- Alert ruleとContact pointを設定できる
- RunbookとOperational Recordを残せる
- AI APIをBackend経由で安全に扱える
- Rate limitingやcost controlを実装できる
- 2つ目のサービスを追加し、複数サービス運用へ拡張できる

## Interview Explanation

面談での説明例:

SRE Labは、Cloudflare PagesとWorkers上で複数の小さなサービスを運用するSREポートフォリオです。1つ目はAI引越し診断で、OpenAI APIをBackend経由で安全に呼び出し、Rate limit、Fallback、Cost trackingを実装しています。2つ目はAWS料金試算で、AI APIを使わず固定単価ベースで月額概算を返します。両サービスに対してGrafana Synthetic Monitoring、Alert rule、Runbook、Operational Recordを整備しており、単なるアプリ開発ではなく、運用・監視・改善まで含めた実績として作っています。

## Current Status

現在の状態:

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
