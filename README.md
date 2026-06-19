# SRE Lab

[![CI](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/ci.yml)
[![Deploy Worker](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/YDTNK/sre-lab/actions/workflows/deploy-worker.yml)

## 概要

SRE Lab は、SRE / Platform Engineer を目指すための公開ポートフォリオです。

単なるWebアプリやAIツール集ではなく、小さな公開Web/APIサービスを題材にして、信頼性、監視、障害対応、CI/CD、Runbook、改善サイクルをどのように設計・運用するかを示すことを目的としています。

## このリポジトリで見せたいこと

SRE Lab では、以下の要素をポートフォリオ上の評価ポイントとして整理しています。

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

ただし、公開ポートフォリオとして見せる情報と、管理者向けの内部計画・判断メモは分けて管理しています。このREADMEでは、外部から確認できる成果物と運用設計に絞って説明します。

## 現在の方向性

```text
現在の主軸: SREポートフォリオ
現在の題材: Reliability Demo API
目的: API運用を通じて、監視・SLO・障害対応・改善の流れを示すこと
```

過去に作成したデモや実験的な実装は一部残していますが、現在の主軸は収益化やAI便利ツール集ではありません。SRE / Platform Engineering の評価につながる運用設計を優先しています。

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

## 運用証跡

SRE Lab では、実装だけでなく「運用をどう考えたか」をドキュメントとして残します。

```text
docs/slo/reliability-demo-api.md
docs/runbook.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
```

これらのドキュメントでは、SLO、Runbook、障害記録、Postmortemテンプレートを確認できます。

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

## 現在の改善予定

```text
1. Grafana Synthetic Monitoring の監視対象を /api/health と /api/status に整理する
2. ヘルスチェック失敗・遅延悪化時のアラート条件を確認する
3. SLO、Incident、Runbook、API状態を見せるページを追加する
4. /api/error を使った小さなGame Dayを実施し、期待される障害対応フローを記録する
5. 実障害が発生した場合のみ、実際のPostmortemを作成する
6. Reliability Demo API の運用ループが整った後に、Cloud Cost Guardrail Demoを追加する
```

## 面接・レビュー時の見どころ

このリポジトリは、以下のように説明できる状態を目指しています。

```text
Cloudflare Workers / Pages / GitHub Actions / Grafana を使い、
小さな公開APIを題材に、SLO、監視、障害対応、Runbook、Postmortem、CI/CD、コスト制御を示すSREポートフォリオ。
```

アプリの機能数を増やすことよりも、運用設計と改善の流れを説明できることを重視しています。
