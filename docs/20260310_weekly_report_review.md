# 週次SEOレポート機能 検証ドキュメント

## 検証目的

Google Search Console API + GA4 Data APIと連携し、トレンド推移・改善策・次のアクションを含む実用的な週次レポートをメール送信する機能を実装する。

## 対象範囲

- `backend/` 配下の新規サービス・タスク・モデル・エンドポイント
- deploy.sh の環境変数追加

## 確認項目リスト

### Search Console（第1・2回Codexレビュー反映済み）
- [x] Sitemaps API（エラー監視）+ URL Inspection API（主要URL個別チェック）のハイブリッド
- [x] Cloud RunではADC、ローカルのみJSONキーフォールバック
- [x] `google-api-python-client`は同期I/O → `asyncio.to_thread()`で包む
- [x] データ遅延考慮: JST月曜起算で前の完了週を対象
- [x] DBに`WeeklyReportLog`テーブル、`year_week`一意制約で重複送信防止
- [x] 最低100imp以上でフィルタ（ノイズ対策）— アクション候補・注目クエリ・上昇下落クエリで適用
- [x] サマリー=次元なし、Top10=次元ありで分離

### GA4（第3回Codexレビュー反映済み）
- [x] `google-analytics-data`の`BetaAnalyticsDataClient`（同期）を使用
- [x] Search ConsoleとGA4で同一Cloud Run SAを使用（ADC共有）
- [x] `keyEvents`メトリクスを使用（batchRunReportsの4番目のリクエストとして追加）
- [x] `batchRunReports`で4リクエストをまとめてAPI呼び出し回数削減
- [x] GA4とGSCで日付境界/タイムゾーン差を統一（JST月曜起算）
- [x] ページ別Top10は`pagePath`（閲覧ページ）を使用（`landingPage`ではない）

### アクショナブルレポート（第4回Codexレビュー反映済み）
- [x] `weekly_metrics`テーブルに週次集計を蓄積（最大26週保持）
- [x] ルールベース判定+LLM（Gemini）文面生成のハイブリッド
- [x] テキストsparkline（▁▂▃▄▅▆▇）+ WoW%（メール互換性重視）
- [x] 最低表示しきい値でフィルタ
- [x] エンゲージメント判定はOrganic Searchチャネルのみで判定（全流入との混在を回避）

### 障害時の失敗ポリシー
- [x] 全データソース失敗時はエラーで中断、レポート送信しない
- [x] 部分失敗時は警告付きレポートを送信、失敗ソースの0データはDB保存しない
- [x] 部分失敗の警告をメール冒頭に表示

### レポートセクション構成
- [x] 今週やることTop3（LLMアクション提案）
- [x] GA4サマリー（sparkline + WoW%）
- [x] チャネル別流入
- [x] 閲覧ページ別Top10
- [x] キーイベント
- [x] GSCサマリー（sparkline + WoW%）
- [x] Top10検索クエリ
- [x] Top10ページ
- [x] 注目クエリ（高表示・低CTR = 改善機会、100imp以上）
- [x] 上昇/下落クエリ（前週比20%以上、100imp以上）
- [x] インデックス状況
- [x] サイトマップ

## Codexレビュー結果

- 第1〜4回レビュー結果は実装計画に全て反映済み（上記確認項目参照）

## 実装後レビュー指摘事項と対応

### 対応済み

| # | 優先度 | 指摘 | 対応 |
|---|---|---|---|
| 1 | P0 | 週次定義が設計書と不一致（固定オフセット vs JST月曜起算） | JST月曜起算に修正、year_weekもデータ期間基準に |
| 2 | P0 | API失敗が「成功レポート」に化ける | 全ソース失敗→中断、部分失敗→警告付き送信、0データDB保存防止 |
| 3 | P1 | GSCとGA4データの混在（全流入でSEO判定） | エンゲージメント判定をOrganic Searchチャネルのみに限定 |
| 4 | P1 | keyEvents未実装 | GA4 batchRunReportsにkeyEventsリクエスト追加、テンプレートにセクション追加 |
| 5 | P1 | landingPageとページ別の混同 | `pagePath`+`screenPageViews`に変更、ラベルを「閲覧ページ別」に |
| 6 | P1 | 100impフィルタがレポート本体に未反映 | 「注目クエリ」「上昇/下落クエリ」セクションを追加（100imp以上フィルタ適用） |

### TODO（将来対応）

| # | 優先度 | 指摘 | 備考 |
|---|---|---|---|
| 7 | ~~P2~~ | ~~ai.cloudnature.jp にGA4タグ未設置~~ | **対応済み**: estimate側にGoogleAnalyticsコンポーネント追加、サイト別（hostName）レポートセクション追加。GSC/アクション提案のhost分離は将来課題。cross-domain設定はGA4管理画面で手動設定済み、セッション継続は要件外 |
| 8 | P2 | ローカル検証環境にGoogle SDK未整備 | pyproject.toml の dev dependencies に追加が必要。別タスク化 |
