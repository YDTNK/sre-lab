# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

## 概要

SRE Lab は、Reliability Demo API を題材にした SRE / Platform Engineering の公開ポートフォリオです。

Reliability Demo API は、信頼性運用を説明するための公開デモAPIです。SLO、外形監視、障害対応、CI/CD、Runbook、改善サイクルをどのように設計・運用するかを確認できるようにしています。

## 扱うテーマ

```text
- SLO / SLI
- 外形監視
- アラート設計
- CI/CD
- 障害対応
- Runbook
- Postmortem
- API安全性
- コスト制御
- GitHub Issue / Pull Request ベースの運用
```

## AI活用について

本プロジェクトでは、設計レビュー、実装補助、ドキュメント整合性確認、改善サイクルの整理にAI支援を活用しています。

公開ポートフォリオとして見せる情報と、管理者向けの内部計画・判断メモは分けて管理しています。このREADMEでは、外部から確認できる成果物と運用設計に絞って説明します。

## Reliability Demo API

```text
Production API:
https://sre-lab-api.daisan-tanaka.workers.dev
```

| Endpoint | 目的 |
|---|---|
| `GET /api/health` | 正常性確認用のヘルスチェック |
| `GET /api/status` | APIの状態と利用可能なデモエンドポイントの確認 |
| `GET /api/slow?delayMs=1000` | 遅延発生時の挙動確認 |
| `GET /api/error` | 意図的な500エラーを返す障害対応デモ |
| `GET /api/fallback` | fallback動作の確認 |

`/api/error` は意図的な制御エラーです。Availability SLI には含めず、障害対応や監視設計を説明するためのデモとして扱います。

## 運用ドキュメント

SLO、Runbook、障害記録、Postmortemテンプレートは以下に整理しています。

```text
docs/slo/reliability-demo-api.md
docs/runbooks/reliability-demo-api.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
```

## 技術スタック

| 領域 | 技術 |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| CI/CD | GitHub Actions, Wrangler |
| Monitoring | Grafana Cloud Synthetic Monitoring |
| Alerting | Grafana Alerting |
| Incident intake | Grafana Alert → Cloudflare Worker → GitHub Issue |
| Documentation | Markdown |
| Repository | GitHub |

## 公開URL

```text
Portfolio site:
https://sre-lab.pages.dev/

Workers API:
https://sre-lab-api.daisan-tanaka.workers.dev
```
