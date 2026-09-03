# アーキテクチャ図

Archify（Agent Skill）で生成する、検証済みのインタラクティブなアーキテクチャ図を置くディレクトリ。

## 構成

各図は「ソース（typed JSON IR）」と「成果物（自己完結 HTML）」のペアで管理する。

| ファイル | 役割 |
|---|---|
| `<name>.architecture.json` | ソース。図の唯一の真実。編集はこちらだけを行う |
| `<name>.html` | 成果物。単一ファイルで自己完結（外部CDN・外部アセット参照なし） |

命名は `<対象>.<種別>.json` / `<対象>.html`。種別は `architecture` / `workflow` / `sequence` / `dataflow` / `lifecycle`。

## 一覧

| 図 | 内容 |
|---|---|
| `cloudnature-production` | 本番アーキテクチャ。3サイト（Vercel）→ 見積もりAPI（Cloud Run）→ Neon、および Notion / Resend / OpenAI / Secret Manager の連携 |

## 再生成手順

HTML は直接編集しない。JSON を編集し、以下を順に実行する。

```bash
SKILL=~/.agents/skills/archify

# 1. 検証（showcase は 9チェック・エラー0・警告0 が合格ライン）
node $SKILL/bin/archify.mjs validate architecture \
  docs/architecture/cloudnature-production.architecture.json --quality showcase --json

# 2. デリバリ（検証を通ったものだけが HTML をアトミックに置き換える）
node $SKILL/bin/archify.mjs deliver architecture \
  docs/architecture/cloudnature-production.architecture.json \
  docs/architecture/cloudnature-production.html --quality showcase --json

# 3. デスクトップ収まり検証（1440x900 / 1600x1000 / 1920x1080 / 2048x1320 の light・dark）
node $SKILL/bin/archify.mjs visual-check \
  docs/architecture/cloudnature-production.html --json
```

`visual-check` は PNG スクリーンショットとコンタクトシートを同じディレクトリに出力する。
これらは再生成可能な検証証跡なのでコミットしない（確認後に削除する）。

## 注意点

- **`meta.locale` に日本語は指定できない**（`en` / `zh-CN` のみ）。そのため省略しており、
  ビューアUI（Legend / PATH / MAP / LENS / Present / Export）と `<html lang>` は英語のままになる。
  ノード名・ラベル・カードなど図の内容は日本語で出力される。
- `validate` が通っても `visual-check` は別判定。縦に長い構図は全解像度で不合格になるため、
  横長（縦の広がりを抑えた）構図で組むこと。
- 検証エラーは該当ID・実測px・許容値・適用可能な修正手段を JSON で返す。
  憶測で直さず、返された `subject` と `supportedFixes` に従って修正する。

## ビューア操作

| 操作 | キー |
|---|---|
| テーマ切替 / ビジュアルスタイル切替 | <kbd>T</kbd> / <kbd>S</kbd> |
| ノード検索 | <kbd>/</kbd> |
| 経路探索 / ロール比較 / 全体マップ | <kbd>R</kbd> / <kbd>L</kbd> / <kbd>M</kbd> |
| ガイドストーリー再生 / 前後の章 | <kbd>P</kbd> / <kbd>[</kbd> <kbd>]</kbd> |
| プレゼンモード / エクスポート | <kbd>F</kbd> / <kbd>E</kbd> |

`#focus=<id>` `#route=<from>~<to>` `#lens=<kind>~<kind>` `#view=<view-id>` で状態を URL に固定できる。
