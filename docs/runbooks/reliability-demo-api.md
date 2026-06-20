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

## 初動確認

1. `GET /api/health` を再実行し、一時的な失敗か継続的な失敗かを確認します。
2. `GET /api/status` を実行し、API全体の応答状態を確認します。
3. 公開サイト `https://sre-lab.pages.dev/` が表示できるか確認します。
4. 直近のPull Request、mainへのmerge、Worker deployの有無を確認します。
5. GitHub ActionsのCI / Deploy Worker / Production Checkの状態を確認します。
6. `apps/api/src/index.js` の直近変更を確認します。
7. `bash scripts/smoke-test.sh` を実行できる場合は、本番URLの期待応答を確認します。

## 影響範囲確認

| 確認対象 | 判断 |
|---|---|
| `/api/health` のみ失敗 | API稼働確認の問題として扱う |
| `/api/status` も失敗 | API全体の問題として扱う |
| Pagesも表示不可 | フロント配信またはCloudflare側の問題も疑う |
| Deploy直後から失敗 | 変更起因の可能性を優先して確認する |
| `/api/error` の500のみ | 期待されたデモ挙動として扱う |

## レイテンシが悪化した場合

1. `/api/health` の応答時間を確認します。
2. `/api/slow?delayMs=1000` の結果と比較します。
3. `/api/slow` の遅延が指定値の範囲内であれば、デモ挙動として扱います。
4. `/api/health` も遅い場合は、Cloudflare Workers、ネットワーク、直近変更を確認します。
5. 継続的な遅延でSLOに影響する場合は、Incidentまたは改善Issueとして記録します。

## rollback判断

以下に当てはまる場合は、revertまたは前回安定版への戻しを検討します。

```text
- 直近PRのmerge後から /api/health が継続失敗している
- Deploy Worker workflow後に本番確認が失敗している
- /api/status も失敗し、API全体の状態が確認できない
- 変更内容と障害症状の関連が高い
- 修正よりrevertの方が復旧が早い
```

rollback時の確認:

```text
1. 直近のmerge commitを確認する。
2. 該当PRの差分を確認する。
3. revert PRを作成する。
4. CIを通す。
5. main反映後にProduction Checkを確認する。
6. 復旧結果をIssueまたはIncident記録に残す。
```

## escalation条件

以下の場合は、通常の改善IssueではなくIncident記録または外部サービス障害の確認に進みます。

```text
- /api/health が継続して失敗する
- /api/status も失敗する
- Cloudflare PagesまたはWorkersの広範な障害が疑われる
- GitHub ActionsやCloudflare deployが継続して失敗する
- SLO違反または利用者影響がある
- 30分以上原因が切り分けられない
```

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

## 事後記録

対応後は、以下のどれかに記録します。

```text
- 軽微な確認: GitHub Issueのコメント
- 本番確認: docs/incidents/ 配下のproduction verification record
- 実障害: docs/incidents/ 配下のincident record
- 再発防止: follow-up Issue / Pull Request
- 学習記録: Postmortem template
```

記録する内容:

```text
- 発生時刻
- 検知方法
- 影響範囲
- 原因
- 実施した対応
- 復旧確認
- 再発防止アクション
```

## 関連ドキュメント

```text
docs/slo/reliability-demo-api.md
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
docs/postmortems/template.md
docs/security/public-exposure.md
```
