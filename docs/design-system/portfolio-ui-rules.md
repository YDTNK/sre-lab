# Portfolio UI Design Rules

## 目的

この文書は、SRE Lab の公開ポートフォリオページに適用するUI・レイアウト・文言のルールをまとめたものです。

対象ページ:

```text
/
/architecture.html
/reliability.html
/monitoring.html
/cicd.html
/incidents.html
/cost.html
```

## デザイン方針

```text
Monochrome technical portfolio
+
SRE / Platform Engineering evidence dashboard
```

サイト全体は、次の印象を優先します。

```text
- 落ち着いている
- 技術的である
- 信頼できる
- 証跡が見える
- 一般消費者向けLPに寄せすぎない
- サイバー風の装飾に寄せすぎない
- 収益化サービスの販売ページに見せない
```

## CSS構成

```text
apps/landing/portfolio.css
apps/landing/layout-adjustments.css
apps/landing/architecture.css
apps/landing/reliability.css
apps/landing/monitoring.css
apps/landing/cicd.css
apps/landing/incidents.css
apps/landing/cost.css
```

役割:

```text
portfolio.css:
- 共通色
- 基本文字組み
- サイドバー
- hero
- 共通セクション
- 基本カード

layout-adjustments.css:
- Home固有の調整
- PC/SPコピー切り替え
- HomeのOperational Design調整

architecture.css:
- サブページ共通のrole/flow系レイアウト
- Architecture系のflow block
- サブページの可視ブランド統一

各ページ専用CSS:
- ページ固有の一覧、カード、説明ブロック
```

## 色のルール

色は `portfolio.css` のCSS変数を使います。

```css
--color-bg: #f7f7f5;
--color-surface: #ffffff;
--color-sidebar: #fbfbfa;
--color-text: #111111;
--color-text-subtle: #2f2f2f;
--color-muted: #666666;
--color-muted-light: #8a8a86;
--color-border: #d9d9d5;
--color-soft: #efefec;
--color-accent: #007f8f;
--color-accent-dark: #006978;
--color-accent-soft: #e9f8f9;
--color-success: #16875f;
--color-danger: #a43c3c;
```

使い分け:

```text
見出し:
- var(--color-text)

説明文:
- 原則 var(--color-accent-dark)

補足テキスト:
- var(--color-muted)

低優先度メタ情報:
- var(--color-muted-light)

正常状態:
- var(--color-success)

期待されたエラーや注意:
- var(--color-danger)
```

## 文字のルール

基本フォント:

```css
font-family:
  Inter,
  "Noto Sans JP",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

日本語の見出し・本文は通常フォントを継承します。

monospaceを使う箇所:

```text
- サイドバー番号
- eyebrow label
- card number
- PG / API / MON / CI / ISS などのnode label
- metric value
```

本文にnode label用のmonospaceが混ざらないようにします。

## レスポンシブルール

使用するbreakpoint:

```css
@media (max-width: 1199px)
@media (max-width: 899px)
@media (max-width: 480px)
```

目安:

```text
1200px以上:
- 左固定サイドバー
- 大きいhero
- 横並びflowや複数カラムを使える

899px以下:
- サイドバーは上部ナビになる
- heroは1カラム
- ボタンは縦積み
- flowは縦方向にする
- 日本語コピーは短めにする
```

## ナビゲーションルール

全ページで同じサイドバー構造を使います。

```text
01 トップ
02 構成
03 信頼性
04 監視
05 CI/CD
06 障害対応
07 コスト制御
08 GitHub
```

現在ページには `sidebar__link--active` を付けます。

可視ブランドは `Yudai Tanaka's` に統一します。

## Heroルール

Home:

```text
- Reliability Ops Lab を大きく見せる
- 右側にCurrent Statusを置く
- Primary CTAは説明ページへ遷移させる
- raw JSONだけのAPIに初見ユーザーを直接送らない
```

Subpage:

```text
- 英語eyebrow
- 大きいページタイトル
- 日本語ラベル
- 説明コピー
- summary card
```

## コピーのルール

日本語コピーは、単純な和訳ではなく、初見で意味が分かる説明にします。

避ける表現:

```text
- 漢字だけが続く硬い説明
- 意味が曖昧な英語混在
- 実装済みに見えるFuture表現
- APIやCI/CDなどの専門用語だけで文脈を省く説明
```

PCとスマホで読みやすさが変わる場合は、以下をセットで使います。

```css
.copy-desktop
.copy-mobile
.hero-copy-desktop
.hero-copy-mobile
```

## ページ別ルール

### Home

目的:

```text
初見で、これはSRE / Platform Engineeringの運用ポートフォリオだと分かること。
```

ルール:

```text
- Primary CTAはReliability Dashboardへ送る
- Current Statusを見せる
- Operational Designは各証跡ページへの入口にする
- Future扱いの文言を実装済みページに残さない
```

### Architecture

目的:

```text
Pages、Workers、Grafana、GitHub Actions、GitHub Issuesの役割を説明すること。
```

ルール:

```text
- 役割は説明リストとして読みやすくする
- flowはPCではブロック、スマホでは縦並びにする
- Future itemsは本当に未来のものだけに限定する
```

### Reliability

目的:

```text
APIの現在状態、SLO、エンドポイント挙動、運用証跡を見せること。
```

ルール:

```text
- /api/error は期待されたデモ挙動として明記する
- Live checkの値は説明とセットで見せる
- raw JSONを主導線にしない
```

### Monitoring

目的:

```text
何を監視し、どの条件でアラートにし、どのようにIssueやRunbookへつなげるかを見せること。
```

### CI/CD

目的:

```text
PR、CI、デプロイ、本番確認、切り戻し方針を見せること。
```

測定済みのDORA指標のように見せず、delivery evidence mappingとして扱います。

### Incidents

目的:

```text
本番確認記録、Incident方針、Postmortem、follow-upを見せること。
```

期待されたデモエラーを実障害として扱わないようにします。

### Cost

目的:

```text
利用量、予算しきい値、コスト超過時の対応方針を見せること。
```

まだ実装していないランタイム制御は、実装候補として明記します。

## やらないこと

```text
- 一般消費者向けLPのような訴求に戻さない
- サイバー風の装飾を主役にしない
- gradient CTAを使わない
- privateな計画やキャリア文脈を公開ページに出さない
- future capabilityを実装済みのように見せない
- mobileで横スクロール前提の主要説明にしない
```

## 実装前チェックリスト

```text
[ ] 全ページでナビ構造が揃っている
[ ] active navが正しい
[ ] 可視ブランドがYudai Tanaka'sになっている
[ ] 見出しは黒、説明文はaccent greenを基本にしている
[ ] flowはPCでブロック、スマホで縦並びになっている
[ ] future itemsを実装済みに見せていない
[ ] private管理情報が公開されていない
[ ] GitHubリンク先ドキュメントが日本語で読める
[ ] raw JSON APIを初見向けの主導線にしていない
```

## 保守ルール

ページ単位の見た目や情報設計を変えた場合は、この文書も同じPRで更新します。

同じCSS overrideが複数ページで繰り返される場合は、ページ専用CSSではなく共通CSSへ移します。
