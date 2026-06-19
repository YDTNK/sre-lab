# Reliability Demo API SLO / SLI

## この文書の目的

この文書は、Reliability Demo API の信頼性をどのように測るかを定義します。

Reliability Demo API は、信頼性運用を説明するための公開デモAPIです。実サービス相当の小さな題材として、SLO、SLI、監視、障害対応、Runbook、Postmortemの流れを確認できるようにしています。

## サービス情報

```text
Service: Reliability Demo API
Status: active MVP
Production base URL: https://sre-lab-api.daisan-tanaka.workers.dev
```

## 本番エンドポイント

| エンドポイント | 期待ステータス | 目的 |
|---|---:|---|
| `GET /api/health` | 200 | 稼働確認の中心となるヘルスチェック |
| `GET /api/status` | 200 | APIの状態と利用可能なエンドポイントの確認 |
| `GET /api/fallback` | 200 | 縮退運転を想定したデモ |
| `GET /api/slow?delayMs=1000` | 200 | 遅延発生時の挙動確認 |
| `GET /api/error` | 500 | 意図的なエラーデモ。可用性SLIには含めない |

## SLI

### Availability SLI

```text
Good event:
GET /api/health が HTTP 200 を返す

Total event:
GET /api/health への外形監視チェック全体
```

`/api/health` を、通常の稼働確認に使うPrimary SLIとします。

### Latency SLI

```text
Good event:
GET /api/health がしきい値以内に完了する

Total event:
成功した GET /api/health チェック全体

初期しきい値:
p95 < 1000ms
```

`/api/slow` は遅延デモ用のエンドポイントです。通常のレイテンシSLIには含めません。

### Error-rate SLI

```text
Good event:
GET /api/health が 5xx を返さない

Total event:
GET /api/health チェック全体
```

`/api/error` は意図的に500を返すデモ用エンドポイントです。通常の可用性計算やエラー率計算には含めません。

## 初期SLO

| SLO | 目標 | 期間 | 補足 |
|---|---:|---|---|
| Availability | 99.0% | 30日 | `GET /api/health` の外形監視を基準にする |
| Latency | p95 < 1000ms | 30日 | `GET /api/health` を基準にする |
| Error rate | 5xx < 1.0% | 30日 | 意図的な `/api/error` は除外する |

## Error budget policy

| 状態 | 対応 |
|---|---|
| Healthy | 通常の改善作業を継続する |
| 50% consumed | 直近の変更と監視結果を確認する |
| 75% consumed | 信頼性修正を優先する |
| 100% consumed or SLO missed | IncidentまたはPostmortemの対象として扱う |

## アラート候補

```text
- /api/health が連続して非200を返す
- /api/health のレイテンシがしきい値を連続して超える
- Deploy Worker workflow が失敗する
- 本番確認チェックが失敗する
```

手動で `/api/error` を呼び出した結果は、意図されたデモ挙動です。それ単体ではアラート対象にしません。

## 関連ドキュメント

```text
docs/runbooks/reliability-demo-api.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
```

## 現在の成熟度

```text
Maturity: MVP / documentation-backed SLO
Next improvement: Grafana Synthetic Monitoringの対象と、このSLO定義の対応を継続的に確認する
```
