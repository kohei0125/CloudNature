# Notion保存処理レビュー

## 検証目的

AI見積もり結果のNotion保存に関する変更が、既存フローを壊さず、安全かつ確実に動作することを確認する。

## 対象範囲

- `backend/app/services/notion_service.py`
- Notion保存処理から参照される設定・スキーマ・呼び出し元
- 関連テストおよび `backend/docs/estimate_logic.md`

## 確認項目リスト

- [x] 変更内容と保存データの整合性
- [x] Notion APIの制約・型・文字数上限への対応
- [x] 未設定時・API失敗時のエラーハンドリング
- [x] 機密情報・個人情報の取り扱い
- [x] 呼び出し元への影響と後方互換性
- [x] テストの有無・妥当性
- [x] 実装と `backend/docs/estimate_logic.md` の整合性
- [x] Codex対話レビューを試行（モデル制約により実行失敗）

## レビュー結果

### 中: 空のフォロー文面を正常値として受理する

- 対象: `backend/app/schemas/llm_output.py:95`
- `follow_up_message` は必須キーだが、スキーマが `{"type": "string"}` のみのため、空文字や空白だけの文字列もバリデーションを通過する。
- その場合、意図した個別文面がNotionへ保存されないか、定型文だけが保存される。少なくとも `minLength` を設け、必要なら150〜250文字の仕様も検証するのが望ましい。

### 低: 空白だけの入力で定型文のみ保存される

- 対象: `backend/app/services/email_service.py:41-43`
- 空判定を `strip()` より前に行っているため、`"   "` は空と見なされず、個別文面なしで打ち合わせ依頼の定型文だけを返す。
- `strip()` 後の値で空判定すべき。

### 低: Notion保存結果を直接検証するテストがない

- 対象: `backend/app/services/notion_service.py:304-313`
- 追加テストは文面組み立て関数のみを対象としており、`notion.pages.create()` の `children` に「送付メール文面」が追加されること、空の場合に追加されないこと、2,000文字制限で安全に処理されることを検証していない。

### 軽微: コメントと実際の送信フローが矛盾する

- 対象: `backend/app/services/notion_service.py:304`
- コメントは「クライアントへ実際に送信した」としているが、仕様書と実装では担当者がNotionを確認して手動送信する下書きである。運用上の誤解を避けるため表現を合わせるべき。

## Codex対話レビュー

Codex CLIで読み取り専用レビューを2回試行したが、既定の `gpt-5.3-codex` と代替の `gpt-5-codex` はいずれも、ChatGPTアカウントでは未対応という400エラーで開始できなかった。

主要エラー:

```text
The 'gpt-5.3-codex' model is not supported when using Codex with a ChatGPT account.
The 'gpt-5-codex' model is not supported when using Codex with a ChatGPT account.
```

## 検証結果

- 関連テスト: **34 passed**
  - `tests/test_email_service.py`
  - `tests/test_fallback_adapter.py`
  - `tests/test_gemini_adapter.py`
- 警告: Google GenAI依存パッケージ由来のDeprecationWarning 1件
- 初回の通常Python環境では依存不足、`uv run` のプロジェクトビルドでは `setuptools.backends` 不足が発生したため、依存定義を隔離環境へ読み込んで実行した。
- Notion APIへの実通信は未実施。

## 対応状況

4件すべて指摘の通りと判断し、修正済み。

- **中（follow_up_messageの空文字受理）**: `validate_estimate_output()` に `.strip()` チェックを追加。
  空/空白なら不合格とし、リトライ→最終的に常に非空文字を返す `FallbackAdapter` に委ねる。
- **低（空白だけで定型文のみ保存）**: `build_follow_up_message_text()` の空判定を `.strip()` 後に行うよう修正。
- **低（テスト不足）**: `tests/test_notion_service.py` を新規作成し、`notion.pages.create()` の
  `children` に「送付メール文面」が follow_up_message の有無・空白のみのケースで
  正しく追加/スキップされることを検証。あわせて `tests/test_llm_output_schema.py`
  （スキーマ検証の空文字/空白/欠落ケース）、`tests/test_email_service.py` への
  空白のみ入力ケースも追加。
- **軽微（コメント矛盾）**: `notion_service.py` のコメントを
  「担当者が手動でクライアントへ送信する際の下書き文面」に修正。

修正後、pytest 116件（新規8件）すべてパス。実際のGemini APIでのライブ呼び出しでも
厳格化後のバリデーションを通過することを確認済み。
