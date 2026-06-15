# Public Site Design Reference

## Current Status

```text
Stopped at Phase 16 v1 checkpoint
```

SRE Lab currently keeps AI Moving Assistant as the only active consumer-facing service.

AWS Cost Simulator was removed from the active service portfolio.

## Purpose

公開サイトのデザイン品質を統一し、将来サービスを追加する場合にもレイアウトやUIが崩れないようにする。

本ドキュメントは公開サイトのデザイン方針を定義する。

---

# Design Goal

目標は以下とする。

- 個人開発感を減らす
- 商用品質に近づける
- ツールを使いたくなる導線を作る
- 将来サービス追加時も拡張しやすい
- モバイル・PC両対応
- SREポートフォリオ色を前面に出しすぎない

公開サイトは、現時点では「AI引越し診断」を中心にした便利ツールとして構成する。

将来、収益導線やサービス追加の判断ができた場合のみ、複数ツール構成へ拡張する。

---

# Reference Policy

完全コピーは禁止。

ただし以下は積極的に参考にする。

- セクション構成
- 余白
- カード配置
- CTA配置
- フォームレイアウト
- 結果表示レイアウト
- 情報密度
- 視線誘導

以下は参考にしない。

- ロゴ
- ブランド名
- コピー文
- 画像
- イラスト
- 独自装飾

目標模倣レベルは Level 4 とする。

Level 4:
レイアウト構造・余白・カード密度・CTA配置を高いレベルで参考にする。

---

# Top Page Reference

## Primary Reference

マネーフォワード クラウド

### Reason

複数サービスを1ブランド配下で見せる構造が、将来のSRE Lab構想と近いため。

ただし現時点では、AI Moving Assistantを主役にした単一サービス構成として扱う。

### Adopt

- Hero
- ツールカード
- CTA
- サービス一覧構造
- セクション余白

### Current Layout

Hero

↓

AI Moving Assistant primary card

↓

無料チェックリストサンプル導線

↓

利用シーン

↓

注意事項

---

## Secondary Reference

freee

### Reason

説明を短く分かりやすく伝える構成が優れているため。

### Adopt

- 短いコピー
- メリット訴求
- 情報整理

---

# AI Moving Assistant Reference

## Primary Reference

SUUMO 引越し

### Reason

同ジャンルサービスであり、入力導線とCTA設計が優れているため。

### Adopt

- フォーム導線
- CTA
- 入力補助
- 安心感

### Layout

Hero

↓

入力フォーム強調

↓

診断結果

↓

無料チェックリストサンプルCTA

↓

使い方

↓

注意事項

---

## Secondary Reference

LIFULL HOME'S 引越し

### Reason

一般ユーザー向けの分かりやすいUIを採用しているため。

### Adopt

- 入力説明
- フォーム余白
- 安心感

---

# Removed Service Reference

## AWS Cost Simulator

AWS Cost Simulator was previously considered for a calculator-style layout.

It is now removed from the active service portfolio and should not be used as an active design target.

If a future calculator-style service is added, this reference can be reused only after a separate service decision.

---

# Design Rules

## Typography

- 説明文は短く
- 専門用語を減らす
- 1段落は3行程度まで

## Cards

- active serviceを明確にカード化する
- 将来追加時も同じカード設計を利用できるようにする

## CTA

- 各ページに主要CTAを1つ
- ボタン文言は行動ベース
- 現在の主要CTAはAI Moving Assistantの診断開始と無料サンプル閲覧

例:

- 診断する
- 無料サンプルを見る
- 作成する

## Spacing

- セクション間余白は大きめ
- フォーム内余白も十分確保

## Current Stop Policy

- 新規SRE Lab機能追加は当面行わない
- Phase 17には実収益導線ができるまで進まない
- 決済、アフィリエイト、メール収集、個人情報収集は別判断なしに追加しない

## Future Services

将来追加するサービスも同ルールを適用する。

候補例:

- AI転職診断
- AI家計診断
- AI学習コーチ
- 不動産 / 引越し補助
