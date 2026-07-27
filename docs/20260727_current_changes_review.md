# 現在の変更レビュー

## 検証目的

未コミットの変更について、不具合・回帰・保守性上の問題がないか確認する。

## 対象範囲

- 現在の Git 作業ツリーに含まれる追跡済み・未追跡の変更

## 確認項目

- 仕様・既存動作との整合性
- バグ、回帰、境界条件の見落とし
- 型安全性、例外処理、セキュリティ
- テスト・ドキュメントの不足
- コーディング規約への適合

## Codex レビュー結果

- Codex CLI で未コミット差分のレビューを試行したが、利用可能モデル
  (`gpt-5.3-codex` / `gpt-5.2-codex` / `gpt-5.1-codex`) が ChatGPT アカウントで
  サポートされていないため中断した。
- Codex は `backend/app/config.py:14` の `gemini-3.5-flash-lite` を無効なモデル ID として
  P1 指摘したが、Google 公式ドキュメント上で同 ID の GA 提供を確認できたため、この指摘は採用しない。
- 一方、同モデルの移行ガイドでは `temperature` 等のサンプリングパラメータが非推奨であり、
  将来は HTTP 400 になると明記されている。現在の実装は
  `backend/app/core/llm/gemini_adapter.py:63,95` で `temperature` を渡しているため、
  モデル更新に必要な移行が未完了。

### 指摘

- **P2** `gemini-3.5-flash-lite` 利用時は `GenerateContentConfig` から
  `temperature` を削除する必要がある。現時点では無視されるが、将来のモデル/API更新で
  Gemini 呼び出しが HTTP 400 となり、OpenAI への不要なフェイルオーバーまたは全失敗を招く。

### 検証

- Google 公式 Gemini モデル一覧・移行ガイドでモデル ID と API 変更を確認。
- OpenAI 公式モデルページで `gpt-5.4-nano` と Chat Completions 対応を確認。
- `pytest -q tests/test_llm_chain.py tests/test_gemini_adapter.py` を実行したが、
  ローカル環境に `pydantic_settings` と `pytest-asyncio` がなく、テスト収集時に停止した。

## 対応状況

- **P2指摘（temperature非推奨）は対応済み。**
  - `backend/app/core/llm/gemini_adapter.py` の `generate_dynamic_questions` /
    `generate_estimate` 両メソッドの `GenerateContentConfig` から `temperature` を削除。
  - OpenAI (`gpt-5.4-nano`) 側は `temperature` を引き続きサポートしていることを
    ライブAPI呼び出しで確認済みのため変更なし。
  - `backend/docs/estimate_logic.md` の「6.2 2回のAI呼び出し」表を、
    Gemini/OpenAIでtemperature挙動が異なる旨を反映するよう更新。
  - 修正後 `pytest`（backend全103件）が通過することを確認
    （Codexの実行環境では `pydantic_settings`/`pytest-asyncio` 未導入により収集失敗していたが、
    本セッションの環境では依存関係が揃っており問題なく実行できた）。
  - 修正後、`GeminiAdapter.generate_dynamic_questions` を実APIへライブ呼び出しし、
    `temperature`未指定でも正常応答（6件の機能候補を返却）することを確認。
- Codexが指摘した「`gemini-3.5-flash-lite` は無効なモデルID」というP1指摘は、
  Google公式ドキュメント上でGA提供が確認できたため不採用（本セッションでも
  同モデルへの実APIライブ呼び出しで正常応答を確認済み）。
