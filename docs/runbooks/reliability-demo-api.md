# Reliability Demo API Runbook

## このRunbookの目的

このRunbookは、Reliability Demo APIで異常が疑われる場合に、何をどの順番で確認するかを整理したものです。

Reliability Demo API は、信頼性運用を説明するための公開デモAPIです。`/api/health` を中心に、正常応答、遅延、意図的なエラー、fallbackの挙動を確認できます。

## 対象エンドポイント

```text
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/health
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/status
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/fallback
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/slow?delayMs=1000
GET https://sre-lab-api.daisan-tanaka.workers.dev/api/error
```

## 期待される応答

| エンドポイント | 期待ステータス | 補足 |
|---|---:|---|
| `/api/health` | 200 | 稼働確認の中心となるヘルスチェック |
| `/api/status` | 200 | APIの状態確認 |
| `/api/fallback` | 200 | fallbackデモ |
| `/api/slow?delayMs=1000` | 200 | 制御された遅延デモ |
| `/api/error` | 500 | 意図的なエラーデモ |

`/api/error` が500を返すのは期待された挙動です。手動でこのエンドポイントを呼び出した結果だけで、実障害として扱わないでください。

## `/api/health` が失敗した場合

1. `GET /api/health` を再実行し、一時的な失敗か継続的な失敗かを確認します。
2. `GET /api/status` を実行し、API全体の応答状態を確認します。
3. 直近のPull Request、mainへのmerge、Worker deployの有無を確認します。
4. GitHub ActionsのDeploy Worker workflowを確認します。
5. `apps/api/src/index.js` の直近変更を確認します。
6. ローカルまたはGitHub Actionsから `bash scripts/smoke-test.sh` を実行し、本番URLの応答を確認します。
7. 直近のデプロイが原因と判断できる場合は、revertまたは前回安定版への戻しを検討します。
8. 監視上または利用者目線で影響があった場合は、`docs/incidents/` に記録します。

## レイテンシが悪化した場合

1. `/api/health` の応答時間を確認します。
2. `/api/slow?delayMs=1000` の結果と比較します。
3. `/api/slow` の遅延が指定値の範囲内であれば、デモ挙動として扱います。
4. `/api/health` も遅い場合は、Cloudflare Workers、ネットワーク、直近変更を確認します。
5. 継続的な遅延でSLOに影響する場合は、Incidentまたは改善Issueとして記録します。

## fallbackの確認

`/api/fallback` は、縮退運転を想定したデモです。

このエンドポイントはHTTP 200を返し、依存先障害がなくても「fallbackという考え方」を説明するために使います。

## 実障害として扱う条件

以下のような場合は、Incidentとして扱うことを検討します。

```text
- /api/health が継続して失敗する
- /api/status も失敗する
- Worker deploy後に想定外のエラーが出る
- 本番確認チェックが失敗する
- SLOや利用者影響が発生する
```

## 実障害として扱わない例

```text
- 手動で /api/error を呼び出して500が返った
- /api/slow が指定した範囲内で遅延した
- /api/fallback がfallback modeを返した
```

これらは、信頼性運用を説明するためのデモ挙動です。

## 関連ドキュメント

```text
docs/slo/reliability-demo-api.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
```
