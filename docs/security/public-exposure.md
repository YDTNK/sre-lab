# Security / Public Exposure

## 目的

この文書は、SRE Labで公開してよい情報と公開しない情報、secret管理、GitHub Actionsの権限、外部サービス連携の扱いを整理するための運用証跡です。

SRE Labは公開ポートフォリオですが、すべての情報を公開するわけではありません。公開サイトとGitHubリポジトリには、評価者が確認できる技術証跡だけを置き、個人事情・キャリア管理・private planning・secretは公開しません。

## 公開している情報

```text
- 公開ポートフォリオサイト
- Reliability Demo APIの公開URL
- SLO / SLI
- Runbook
- 本番確認記録
- Postmortemテンプレート
- CI/CD workflow
- Cost Guardrail設計
- Security / Public Exposure方針
```

## 公開しない情報

```text
- Cloudflare API token
- GitHub token
- Grafana API key
- webhook secret
- 個人事情やキャリア管理メモ
- private planning
- 面接対策の内部メモ
- 実在の個人・会社に関する非公開情報
```

## Secret管理

Cloudflare Workersのデプロイに必要なcredentialは、GitHub Actions Secretsとして扱います。

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

これらはworkflow内で環境変数として参照しますが、リポジトリには値を置きません。

## GitHub Actionsでの扱い

Deploy Worker workflowでは、Cloudflareへのデプロイ時にGitHub Secretsを使用します。

運用方針:

```text
- secret値をログに出さない
- secret値をREADMEやdocsに書かない
- 必要なworkflowだけでsecretを使う
- 不要になったtokenは無効化する
- tokenの権限は必要最小限にする
```

## 公開サイトに出してよい情報

```text
- APIのbase URL
- エンドポイントの期待ステータス
- SLO / SLIの考え方
- 監視対象
- アラート設計
- Runbookの手順
- CI/CDの流れ
- Cost Guardrailの設計
```

## 公開サイトに出さない情報

```text
- secret値
- private repoの中身
- 個人の年収・転職・面接戦略
- 未公開の勤務先情報
- API tokenの権限詳細
- webhook secretの値
```

## 外部サービス連携の状態

| Service | Status | Public exposure policy |
|---|---|---|
| GitHub | connected / public repository | Issue、PR、docs、workflowを公開証跡として使う |
| Cloudflare Pages | connected | 公開サイト配信に使う。管理画面情報は公開しない |
| Cloudflare Workers | connected | Reliability Demo APIを公開する。secret値は公開しない |
| GitHub Actions | connected | CI/CD証跡としてworkflowを公開する。secret値は公開しない |
| Grafana Cloud | design / monitoring evidence | 監視設計として扱う。API keyや内部設定値は公開しない |

## Secret漏洩が疑われる場合

```text
1. 影響するtoken / keyを特定する。
2. 対象tokenを無効化またはrotateする。
3. GitHub Actions Secretsを更新する。
4. workflowが正常に動くか確認する。
5. 必要に応じてIncident記録を作成する。
6. 再発防止策をIssue / PRで追跡する。
```

## 評価者向けの見どころ

このプロジェクトでは、公開ポートフォリオとして見せる情報と、公開すべきでない情報を分けています。

SRE / Platform Engineeringの観点では、サービスを作るだけでなく、secret、権限、公開範囲、運用証跡の扱いを明確にすることを重視しています。
