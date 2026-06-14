# Public Site Design Reference

## Purpose

公開サイトのデザイン品質を統一し、サービス追加時にレイアウトやUIが崩れないようにする。

本ドキュメントは公開サイトのデザイン方針を定義する。

---

# Design Goal

目標は以下とする。

- 個人開発感を減らす
- 商用品質に近づける
- ツールを使いたくなる導線を作る
- サービス追加時も拡張しやすい
- モバイル・PC両対応
- SREポートフォリオ色を前面に出さない

公開サイトは「クラウドとAIの便利ツール集」として構成する。

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

複数サービスを1ブランド配下で見せる構造がSRE Labと近いため。

### Adopt

- Hero
- ツールカード
- CTA
- サービス一覧構造
- セクション余白

### Layout

Hero

↓

目的別ツールカード

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

同ジャンルサービスであり、
入力導線とCTA設計が優れているため。

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

# AWS Cost Simulator Reference

## Primary Reference

Calculator Style Layout

### Reason

料金試算ツールとして最も理解しやすいため。

### Adopt

- 左入力
- 右結果
- 大きな料金表示
- 内訳表示

### Layout

Hero

↓

2カラム入力/結果

↓

内訳カード

↓

前提条件

↓

注意事項

---

## Secondary Reference

マネーフォワード

### Adopt

- 数字の見せ方
- 結果カード
- 情報整理

---

# Design Rules

## Typography

- 説明文は短く
- 専門用語を減らす
- 1段落は3行程度まで

## Cards

- サービス単位でカード化
- 将来追加時も同じカードを利用

## CTA

- 各ページに主要CTAを1つ
- ボタン文言は行動ベース

例:

- 試算する
- 診断する
- 作成する

## Spacing

- セクション間余白は大きめ
- フォーム内余白も十分確保

## Future Services

将来追加するサービスも同ルールを適用する。

例:

- Terraform構成診断
- AI障害要約
- 学習支援ツール
- AWS構成レビュー

