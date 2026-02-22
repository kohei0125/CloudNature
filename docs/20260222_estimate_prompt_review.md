# 見積もりプロンプト最適化レビュー

**日付**: 2026-02-22
**対象**: `backend/app/prompts/v1/estimate_generation.txt`（本番使用中）および `backend/app/prompts/v1/pattern/formal/estimate_generation.txt`（未使用）

## 検証目的

見積もり生成プロンプト（約230行）が長大化しており、LLMが全制約を正確に遵守できるか、より良いアーキテクチャがないかを調査・改善する。

## 対象範囲

- `backend/app/prompts/v1/estimate_generation.txt` — 本番プロンプト（234行）
- `backend/app/core/llm/openai_adapter.py` — LLM呼び出し
- `backend/app/services/estimate_service.py` — サービス層（バリデーション含む）
- `backend/app/schemas/llm_output.py` — JSON出力バリデーション
- `backend/app/core/llm/fallback.py` — フォールバック
- `backend/app/config.py` — モデル設定（gpt-4.1-mini）

## 現状分析

### プロンプト構成（234行の内訳）

| セクション | 行数 | 内容 | 性質 |
|-----------|------|------|------|
| 役割定義 | 2行 | PMロール設定 | 文章生成向け |
| ユーザー入力定義 | 16行 | step_1〜step_12 | 参照情報 |
| ベース価格表 | 22行 | 17カテゴリの価格レンジ | **決定論的計算** |
| 複合乗数テーブル | 55行 | 7種の乗数+上限ルール | **決定論的計算** |
| hybrid_price計算 | 6行 | standard × 0.6 | **決定論的計算** |
| 予算整合性チェック | 20行 | 予算レンジ対応表 | **決定論的計算+条件分岐** |
| 機能粒度ガイドライン | 14行 | 機能数制約・金額制約 | **決定論的計算** |
| エッジケース対応 | 10行 | 6パターン | 条件分岐+文章生成 |
| summary生成ルール | 8行 | 100〜200文字、トーン指定 | 文章生成向け |
| discussion_agenda | 10行 | 条件別3〜5個生成 | 文章生成向け |
| total_cost.message | 5行 | 削減額含むメッセージ | 文章生成向け |
| JSONスキーマ | 20行 | 出力フォーマット定義 | 構造定義 |
| 出力ルール | 12行 | 各種制約 | 混合（計算+文章） |
| セキュリティ | 5行 | インジェクション対策 | セキュリティ |

**計算ロジック: 約120行（全体の51%）** — プロンプトの半分以上が決定論的な計算ルール。

### 既存のバリデーション（サーバー側）

`estimate_service.py` + `llm_output.py` で以下を検証済み:
- JSONスキーマ整合性
- hybrid_price が standard_price の 48〜72% 範囲内か
- total_cost が features 合計と1%以内で一致するか
- 金額が妥当な範囲内か（feature: 0〜1億、合計: 0〜5億）
- hybrid合計が最低30万円以上か

→ つまり**LLMが計算を間違えてもバリデーションで弾いてリトライ**する設計。最大3回リトライ。

### 問題点

1. **計算精度**: gpt-4.1-mini で7種の乗数掛け合わせ+丸め+上限制約を正確に行うのは不安定。バリデーション失敗→リトライが頻発する可能性
2. **再現性**: 同一入力でも毎回異なる金額が出る（LLMの確率的性質）
3. **コスト・レイテンシ**: リトライ発生時に追加API呼び出し+待ち時間が発生
4. **保守性**: 価格改定時にプロンプト内のテーブルを手動修正する必要がある
5. **formal版が未使用**: `pattern/formal/` は参照されておらず、本番版と乖離あり（価格帯が異なる）

## Codex レビュー結果

Codex CLI (gpt-5.3-codex) による分析:

1. **長さそのものより「独立ルールの数」と「例外分岐の多さ」が精度低下の主因**
2. **計算ルールと文章生成ルールの混在**が構造的な弱点
3. **2段階分割を推奨**: 計算→文章生成で精度・デバッグ性ともに向上
4. **mini系モデルでは「一部ルールを無視してそれっぽく出す」傾向が強い**
5. **ベストプラクティス: 決定論的計算はコード側が基本**

## 改善計画

### アーキテクチャ変更: 計算のコード化 + プロンプト軽量化

```
[現在]
ユーザー入力 → [LLM: 計算+文章生成 (1回)] → JSON出力 → バリデーション → (失敗時リトライ)

[改善後]
ユーザー入力 → [Python: 価格計算エンジン] → 計算済みデータ → [LLM: 文章生成のみ] → JSON出力 → バリデーション
```

### Python側で実装する計算ロジック（新規: `pricing_engine.py`）

- ベース価格テーブル（17カテゴリ）
- 複合乗数計算（7種）
- 総合乗数上限（4.0倍キャップ）
- hybrid_price算出（× 0.6、1000円丸め）
- 予算整合性チェック + フラグ生成
- 機能粒度バリデーション
- エッジケース判定 + discussion_agendaヒント生成

### LLMに残す役割（プロンプト軽量化: 約60〜80行）

- `project_name`: 業種・目的を反映した命名
- `summary`: 課題認識+提案概要+期待効果（100〜200文字）
- `features[].name / detail`: 機能の命名と利用メリット説明
- `discussion_agenda`: 未確定事項の抽出（ヒント付き）
- `total_cost.message`: 削減額を含む説明文
- `development_model_explanation`: テンプレート文

### LLMへの入力データ形式

```json
{
  "user_input": { "step_1": "...", ..., "step_12": "..." },
  "calculated": {
    "features": [
      { "category": "承認ワークフロー", "standard_price": 720000, "hybrid_price": 432000 }
    ],
    "total_standard": 3200000,
    "total_hybrid": 1920000,
    "savings_percent": 40,
    "budget_status": "within_budget",
    "multiplier_summary": "ユーザー規模1.2×デバイス1.3=複合1.56",
    "discussion_hints": ["step_4が曖昧", "migration選択"]
  }
}
```

### ファイル変更一覧

| ファイル | 操作 | 内容 |
|---------|------|------|
| `backend/app/core/pricing_engine.py` | **新規** | 価格計算エンジン |
| `backend/app/prompts/v1/estimate_generation.txt` | **大幅書き換え** | 文章生成特化プロンプト（〜80行） |
| `backend/app/core/llm/openai_adapter.py` | **修正** | pricing_engine呼び出し+計算済みデータをLLMに渡す |
| `backend/app/core/llm/adapter.py` | **修正** | generate_estimate のシグネチャ変更 |
| `backend/app/core/llm/fallback.py` | **修正** | 新シグネチャに合わせる |
| `backend/app/services/estimate_service.py` | **修正** | pricing_engine統合 |
| `backend/app/schemas/llm_output.py` | **修正** | バリデーション調整（計算済み値との整合性チェック） |
| `backend/tests/test_pricing_engine.py` | **新規** | 計算エンジンのユニットテスト |

### 期待される効果

| 指標 | 現状 | 改善後 |
|------|------|--------|
| プロンプト行数 | 234行 | 60〜80行 |
| 価格計算の正確性 | LLM依存（不安定） | 100%正確（コード） |
| リトライ率（推定） | 高（計算ミス起因） | 低（文章品質のみ） |
| モデル変更時の影響 | 計算精度が大きく変動 | 文章品質のみ変動 |
| 価格改定の保守性 | プロンプト手動編集 | Python辞書の修正 |
| formal版との整合 | 乖離あり | 価格テーブルをコードで一元管理 |

## 結果・対応状況

- [x] 検証ドキュメント作成
- [x] pricing_engine.py 実装（376行、17カテゴリ価格表+7種乗数+予算チェック+エッジケース検出）
- [x] プロンプト軽量化（234行 → 82行、計算ロジック全削除、文章生成特化）
- [x] openai_adapter.py 修正（calculated_dataを `{user_input, calculated}` 形式で送信）
- [x] adapter.py / fallback.py 修正（シグネチャ変更、calculated_dataベースに移行）
- [x] estimate_service.py 修正（pricing_engine統合、_enforce_calculated_pricesで金額保証）
- [x] llm_output.py バリデーション簡素化（金額精度チェック不要に）
- [x] テスト作成・実行（31テスト全パス）
- [x] Codex による最終レビュー

### Codex レビュー指摘と対応

| 指摘 | 重要度 | 対応 |
|------|--------|------|
| _enforce_calculated_prices がfeature数不整合時に内訳と合計が一致しない | P1 | features配列をcalculated基準で再構成するよう修正 |
| プロンプトが `{user_input, calculated}` を期待するが flat JSON を送信 | P2 | openai_adapter.py で2キー構造に分離して送信するよう修正 |
