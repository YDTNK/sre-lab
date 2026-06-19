# Reliability Demo API 本番確認記録

## 概要

```text
Date: 2026-06-19
Service: Reliability Demo API
Type: production verification record
Status: passed
Related PR: #78
Related Issue: #77
```

## 目的

この文書は、Reliability Demo API MVPを本番反映した後に、期待どおり応答することを確認した記録です。

Postmortemではありません。SREポートフォリオとして、本番確認の結果と次の改善事項を残すための運用証跡です。

## 確認結果

| Check | Expected | Actual | Result |
|---|---:|---:|---|
| `GET /api/health` | 200 | 200 | passed |
| `GET /api/status` | 200 | 200 | passed |
| `GET /api/fallback` | 200 | 200 | passed |
| `GET /api/slow?delayMs=1000` | 200 | 200 | passed |
| `GET /api/error` | 500 | 500 | passed |

## 補足

`GET /api/error` がHTTP 500を返すのは期待された挙動です。

このエンドポイントは、エラー応答、監視設計、Runbook、Incident対応を説明するための制御されたデモです。通常の可用性SLIには含めません。

## 確認方法

ローカル端末からcurlで本番APIを確認し、期待ステータスとレスポンス本文を確認しました。

## フォローアップ

- Reliability Demo API の SLO / SLI 文書を定義する。
- Runbookの対象を Reliability Demo API に合わせて整える。
- Grafana Synthetic Monitoring の対象として `/api/health` と `/api/status` を確認する。
- 将来のPostmortemに備えてテンプレートを用意する。
