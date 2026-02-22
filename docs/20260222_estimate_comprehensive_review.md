# AI見積もりシステム 包括レビュー & 改善実装記録

## 検証目的
見積もり精度と信頼性の向上。非機能要件コスト、工程按分、運用保守費、精度レンジの反映。

## 対象範囲
- バックエンド: pricing_engine, LLMプロンプト, スキーマ, サービス層, メールテンプレート
- フロントエンド: TypeScript型, PDF見積書, 完了画面, ステップコンテンツ

## 実装内容

### Phase 1: バックエンド計算精度の向上
| 変更 | ファイル | 内容 |
|------|---------|------|
| 1-1 | pricing_engine.py | 工程按分(_calculate_phase_breakdown), 保守費(_calculate_maintenance), 精度レンジ(_calculate_confidence), NFRキーワード検出(_detect_nfr_keywords), 業種乗数テーブル拡充(healthcare:1.15, logistics:1.05), B2C乗数(1.5) |
| 1-2 | estimate_generation.txt | phase_breakdown/maintenance/confidence入力説明追加、phase_summary/maintenance_note/confidence_note出力追加 |
| 1-2 | llm_output.py | ESTIMATE_GENERATION_SCHEMA に3フィールド(phase_summary, maintenance_note, confidence_note)追加 |
| 1-2 | estimate_service.py | _enforce_calculated_pricesでphase_breakdown/maintenance/confidenceデータを保証 |
| 1-2 | fallback.py | フォールバック出力にphase_summary/maintenance_note/confidence_note追加 |
| 1-3 | estimate.ts | PhaseItem, PhaseBreakdown, MaintenanceEstimate, ConfidenceLevel型追加、GeneratedEstimateにOptionalフィールド追加 |
| 1-3 | EstimatePdf.tsx | 工程別概算テーブル、運用保守費セクション、disclaimer拡充(精度レンジ・支払い条件) |
| 1-3 | pdf_service.py | camelCaseマッピングにphaseBreakdown/maintenance/confidence追加 |
| 1-3 | estimate_email.html | プロジェクト総額・運用保守費行追加(条件付き) |
| 1-3 | estimate_notification.html | 見積もり概要セクション(プロジェクト名・金額・業種・精度レンジ) |
| 1-3 | email_service.py | 新パラメータ対応(project_total, maintenance_monthly, industry, confidence_range) |
| 1-3 | estimate.py (API) | _send_emailsでphase_breakdown/maintenance/confidenceデータを抽出し渡す |
| 1-4 | test_pricing_engine.py | 50テストケース(既存20+新規30): phase_breakdown, maintenance, confidence, NFR検出, B2C乗数, logistics乗数 |

### Phase 2: ヒアリング精度の向上
| 変更 | ファイル | 内容 |
|------|---------|------|
| 2-1 | estimate.ts (content) | Step 12質問文を「セキュリティ・稼働率・多言語対応」への誘導に改善 |
| 2-1 | stepConfig.ts | Step 12 placeholderに具体例を追加 |
| 2-2 | estimate.ts (content) | Step 5 deploymentTargetにclient_b2c追加、ラベル細分化 |
| 2-2 | pricing_engine.py | _TARGETにclient_b2b: 1.3, client_b2c: 1.5追加 |

### Phase 3: 完了画面の改善
| 変更 | ファイル | 内容 |
|------|---------|------|
| 3-1 | complete/page.tsx | プロジェクト名・概算金額・削減率・精度レンジのサマリーカード追加 |

## テスト結果
- `python -m pytest tests/test_pricing_engine.py -v`: **50 passed** (0.05s)
- import整合性: pricing_engine OK (DB依存のestimate_serviceはローカルDB未接続のためスキップ)

## 確認項目
- [x] 工程按分比率の合計が100%
- [x] 実装コスト=プロジェクト総額の50%
- [x] 年間保守費=プロジェクト総額の15%
- [x] 精度レンジが未定項目数に応じて変動
- [x] 業種乗数(healthcare:1.15, logistics:1.05)が正しく適用
- [x] B2C乗数(1.5)が正しく適用
- [x] NFRキーワード(セキュリティ/SLA/多言語)の検出
- [x] 全金額が1000円単位に丸められている
- [x] 既存テスト(healthcare乗数1.1→1.15に修正)がパス
- [x] フォールバックアダプタが新フィールドを返す

## Codexレビュー結果 & 対応

### 指摘1 [P2]: 工程合計と総額の丸め不一致
- 原因: 各工程を個別に_round_to_1000で丸めた後、project_totalも別途丸めるため合計が不一致
- 対応: 丸め誤差を最大工程（実装）で吸収するロジックを追加

### 指摘2 [P2]: user_inputがenforce後の結果に含まれない
- 原因: _enforce_calculated_pricesがuser_inputをLLM出力にコピーしていなかった
- 対応: `llm_output["user_input"] = calculated_data.get("user_input", {})` を追加

### 指摘3 [P3]: フロントエンドAPIルートで新フィールドが伝搬されない
- 原因: generate/route.ts と session/route.ts のsnake→camelCase変換に新フィールドが未追加
- 対応: phaseSummary/maintenanceNote/confidenceNote/phaseBreakdown/maintenance/confidenceの変換を追加

### 修正後テスト: 50 passed (0.03s)
