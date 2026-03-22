# ファネルデータ Google Spreadsheet — GAS実装指示書

## 1. 概要

### 目的
週次のファネルデータ（GA4 + GSC）をGoogle Spreadsheetに蓄積し、チャートで可視化する。

### アーキテクチャ
- **GASがGA4 Data API / GSC APIから直接データを取得**する方式
- 既存のバックエンド（`backend/app/tasks/weekly_report.py`）のメール送信とは完全に独立
- スプレッドシートオーナーのOAuth権限でAPIにアクセス

### スケジュール
- 毎週月曜 10:30 JST（既存メール送信 10:00 JSTの30分後）
- GASのTime-driven triggerで自動実行

---

## 2. 前提・制約

| 項目 | 値 |
|---|---|
| GA4 プロパティ | `properties/527141612` |
| GSC サイトURL | `sc-domain:cloudnature.jp`（ドメインプロパティ、サブドメイン含む） |
| コーポレートホスト | `cloudnature.jp` |
| 見積もりホスト | `ai.cloudnature.jp` |
| タイムゾーン | `Asia/Tokyo (JST)` — GAS `appsscript.json` とスプレッドシート設定の両方で設定必須 |
| 率の保存形式 | 直帰率・エンゲージメント率・CTRは **0〜1の小数で保存**（GA4/GSC APIの戻り値そのまま）。セルの表示書式を `%` に設定することで `0.456 → 45.6%` と表示 |
| GA4 ホスト分離 | 同一プロパティで2サイトを収集。`hostName` ディメンションのフィルタで分離 |
| GAS実行時間制限 | 6分以内に完了すること |

### GA4 API で使用するメトリクス・ディメンション

既存バックエンド実装（`backend/app/services/ga4_service.py`）と同等:

**サマリー用メトリクス:**
- `sessions`, `totalUsers`, `screenPageViews`, `bounceRate`, `engagementRate`

**チャネル別:**
- ディメンション: `sessionDefaultChannelGroup`
- メトリクス: `sessions`, `totalUsers`

**ページ別:**
- ディメンション: `hostName`, `pagePath`
- メトリクス: `screenPageViews`

**キーイベント / 追跡イベント:**
- ディメンション: `eventName`
- メトリクス: `keyEvents`（GA4でキーイベント指定済みのもの）または `eventCount`（未指定のもの）

**ホスト分離フィルタ（重要）:**
```javascript
// GA4 Data API v1beta の dimensionFilter でホスト名を絞り込む
dimensionFilter: {
  filter: {
    fieldName: 'hostName',
    stringFilter: {
      value: hostName,  // 'cloudnature.jp' or 'ai.cloudnature.jp'
      matchType: 'EXACT'
    }
  }
}
```

### GSC API リクエスト構造

既存バックエンド実装（`backend/app/services/search_console_service.py`）と同等:

```javascript
// サマリー（ディメンションなし）
{ startDate, endDate, type: 'web' }
// → clicks, impressions, ctr, position

// Top 10 クエリ
{ startDate, endDate, dimensions: ['query'], rowLimit: 10, type: 'web' }

// Top 10 ページ
{ startDate, endDate, dimensions: ['page'], rowLimit: 10, type: 'web' }
```

---

## 3. スプレッドシート構成

### Sheet 1: 週次サマリー

Row 1: マージヘッダー（コーポレート C〜G / 見積もり H〜L / CVR M / GSC N〜Q）
Row 2: 列ヘッダー
Row 3+: データ行（古い順、新しい週を下に追加）

| 列 | ヘッダー | 書式 | 説明 |
|---|---|---|---|
| A | 週 | テキスト | ISO Year-Week（例: `2026-W12`） |
| B | 期間 | テキスト | 日付範囲（例: `2026-03-16 ~ 2026-03-22`） |
| C | Corp セッション | 数値 | `cloudnature.jp` のセッション数 |
| D | Corp ユーザー | 数値 | |
| E | Corp PV | 数値 | `screenPageViews` |
| F | Corp 直帰率 | % (0〜1保存) | `bounceRate` |
| G | Corp エンゲージメント率 | % (0〜1保存) | `engagementRate` |
| H | Est セッション | 数値 | `ai.cloudnature.jp` のセッション数 |
| I | Est ユーザー | 数値 | |
| J | Est PV | 数値 | |
| K | Est 直帰率 | % (0〜1保存) | |
| L | Est エンゲージメント率 | % (0〜1保存) | |
| M | Est→Corp CVR | % (計算式) | `=IFERROR(H{row}/C{row}, 0)`（見積もりセッション÷コーポレートセッション） |
| N | GSC クリック | 数値 | |
| O | GSC 表示回数 | 数値 | |
| P | GSC CTR | % (0〜1保存) | |
| Q | GSC 平均順位 | 小数1桁 | |

### Sheet 2: チャネル別

| 列 | ヘッダー | 説明 |
|---|---|---|
| A | 週 | ISO Year-Week |
| B | ホスト | `cloudnature.jp` or `ai.cloudnature.jp` |
| C | チャネル | `Organic Search` / `Direct` / `Referral` 等 |
| D | セッション | |
| E | ユーザー | |

### Sheet 3: Top検索クエリ

| 列 | ヘッダー | 書式 |
|---|---|---|
| A | 週 | テキスト |
| B | クエリ | テキスト |
| C | クリック | 数値 |
| D | 表示回数 | 数値 |
| E | CTR | % (0〜1保存) |
| F | 平均順位 | 小数1桁 |

### Sheet 4: Topページ

| 列 | ヘッダー |
|---|---|
| A | 週 |
| B | ホスト |
| C | ページパス |
| D | PV |

### Sheet 5: キーイベント詳細

| 列 | ヘッダー |
|---|---|
| A | 週 |
| B | ホスト |
| C | イベント名 |
| D | 件数 |

- 対象イベントは `ALL_TRACKED_EVENTS` 定数で固定（`close_convert_lead`, `qualify_lead`, `form_start`）
- キーイベント（`keyEvents`）と通常イベント（`eventCount`）を区別して取得
- GA4管理画面でkey eventが増減しても時系列の意味が変わらないようにする

### Sheet 6: チャート

グラフ専用シート（データは置かない）

---

## 4. 冪等性の仕様

**全シート共通: delete-then-insert パターン**

1. 書き込み前に対象 `yearWeek` の既存行を検索・削除
2. 削除後に新規行を追加

**シート別の検索方法:**
- Sheet 1: A列で `yearWeek` を検索（1行のみ）
- Sheet 2〜5: A列で `yearWeek` を検索し、該当行を**全て**削除（複数行あり得る）

**チャート（Sheet 6）:**
- 既存チャートを全て削除してから再作成（データ範囲が変わるため）

**実装パターン:**
```javascript
function clearWeekRows(sheet, yearWeek, headerRows = 1) {
  const data = sheet.getDataRange().getValues();
  // ヘッダー行をスキップし、下から上に走査（インデックスずれ防止）
  for (let i = data.length - 1; i >= headerRows; i--) {
    if (data[i][0] === yearWeek) {
      sheet.deleteRow(i + 1);  // getValues()は0始まり、deleteRow()は1始まり
    }
  }
}
// Sheet 1: clearWeekRows(sheet, yearWeek, 2)  ← 2行ヘッダー
// Sheet 2〜5: clearWeekRows(sheet, yearWeek, 1)
```

---

## 5. GAS実装指示

以下の5つのプロンプトに分けてClaude for Chromeに渡す。各プロンプトは前のプロンプトの出力コードに依存する。

---

### Prompt 1: 定数・設定・初期化・日付計算

以下のGASコードを生成してください。

**`appsscript.json` に必要な設定:**
```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly"
  ]
}
```

**定数定義:**
```javascript
const GA4_PROPERTY = 'properties/527141612';
const GSC_SITE_URL = 'sc-domain:cloudnature.jp';
const CORPORATE_HOST = 'cloudnature.jp';
const ESTIMATE_HOST = 'ai.cloudnature.jp';
// GA4管理画面で「キーイベント」にマーク済み → keyEvents メトリクスで取得
const KEY_EVENTS = ['close_convert_lead', 'qualify_lead'];
// キーイベント未指定だがファネル上重要 → eventCount メトリクスで取得
const TRACKED_EVENTS_COUNT = ['form_start'];
const ALL_TRACKED_EVENTS = [...KEY_EVENTS, ...TRACKED_EVENTS_COUNT];

// シート名
const SHEET_SUMMARY = '週次サマリー';
const SHEET_CHANNEL = 'チャネル別';
const SHEET_QUERY = 'Top検索クエリ';
const SHEET_PAGE = 'Topページ';
const SHEET_KEY_EVENT = 'キーイベント詳細';
const SHEET_CHART = 'チャート';
```

**`initializeSpreadsheet()` 関数:**
- 6つのシートを作成（既存なら何もしない）
- 各シートにヘッダー行を書き込む（Sheet 1はRow 1にマージヘッダー、Row 2に列ヘッダー。Sheet 2〜5はRow 1にヘッダー）
- Sheet 1 の F, G, K, L, M, P 列に `%` 書式を設定
- Sheet 1 の Q 列に小数1桁書式を設定
- Sheet 3 の E 列に `%` 書式、F 列に小数1桁書式を設定
- Sheet 1 の Row 1〜2 をフリーズ（2行ヘッダーのため `setFrozenRows(2)`）、Sheet 2〜5 は Row 1 をフリーズ
- デフォルトの `Sheet1` シートが存在すれば削除

**`calcDateRanges(targetDate)` 関数:**
引数省略時は `new Date()` を使用。既存Pythonの日付計算ロジック（`backend/app/tasks/weekly_report.py:34-72`）と **完全に同じアルゴリズム** で完了済みISO週の日付範囲を返す:

```
1. latestAvailable = targetDate - 3日（GSCデータ遅延考慮）
2. latestAvailableが属するISO週の月曜（availableMonday）を算出
   → availableMonday = latestAvailable - latestAvailable.getDay() 相当
   （注: JSのgetDay()は日=0,月=1,...,土=6。ISOの月曜始まりに変換が必要）
3. startDate = availableMonday, endDate = availableMonday + 6日
4. 戻り値: { yearWeek: '2026-W12', startDate: Date, endDate: Date,
             startStr: '2026-03-16', endStr: '2026-03-22' }
```

**動作例（毎週月曜10:30 JST実行を想定）:**
- 2026-03-23(月) → latestAvailable=3/20(金) → availableMonday=3/16 → **2026-W12** (3/16〜3/22)
- 2026-03-30(月) → latestAvailable=3/27(金) → availableMonday=3/23 → **2026-W13** (3/23〜3/29)

これにより、メール送信（10:00）とスプレッドシート更新（10:30）が同一週のデータを対象にする。

既存Pythonの参考コード:
```python
latest_available = today_jst - timedelta(days=3)
available_monday = latest_available - timedelta(days=latest_available.weekday())
current_start = available_monday
current_end = available_monday + timedelta(days=6)
```

**JavaScript での weekday 変換に注意:**
Pythonの `weekday()` は月=0〜日=6。JavaScriptの `getDay()` は日=0, 月=1〜土=6。
ISO月曜始まりへの変換: `const dayOfWeek = (d.getDay() + 6) % 7;`（月=0〜日=6 に統一）

**`getYearWeek(date)` 関数:**
ISO 8601 year-week 文字列を返す（例: `2026-W12`）。月曜始まり。

**`clearWeekRows(sheet, yearWeek, headerRows)` 関数:**
上記の冪等性パターンを実装。`headerRows` 引数でスキップする行数を指定（Sheet 1は `2`、Sheet 2〜5は `1`）。

---

### Prompt 2: GA4データ取得関数

以下のGA4データ取得関数をGASで実装してください。GA4 Data API v1beta を `AnalyticsData.Properties.runReport()` で呼び出します。

**`getGA4HostMetrics(host, startStr, endStr)` 関数:**
- `hostName` でフィルタして、指定ホストのサマリーメトリクスを取得
- メトリクス: `sessions`, `totalUsers`, `screenPageViews`, `bounceRate`, `engagementRate`
- `dimensionFilter` で `hostName` を `EXACT` マッチ
- 戻り値: `{ sessions, users, pageviews, bounceRate, engagementRate }`

```javascript
// GA4 Data API のリクエスト構造
const request = {
  dimensions: [],
  metrics: [
    { name: 'sessions' },
    { name: 'totalUsers' },
    { name: 'screenPageViews' },
    { name: 'bounceRate' },
    { name: 'engagementRate' }
  ],
  dateRanges: [{ startDate: startStr, endDate: endStr }],
  dimensionFilter: {
    filter: {
      fieldName: 'hostName',
      stringFilter: {
        value: host,
        matchType: 'EXACT'
      }
    }
  }
};
const response = AnalyticsData.Properties.runReport(request, GA4_PROPERTY);
```

**`getGA4ChannelsByHost(host, startStr, endStr)` 関数:**
- `hostName` でフィルタした上で、`sessionDefaultChannelGroup` をディメンションに追加
- メトリクス: `sessions`, `totalUsers`
- `dimensionFilter` は `andGroup` で `hostName` フィルタを掛ける
- 戻り値: `[{ channel, sessions, users }, ...]`

```javascript
dimensionFilter: {
  andGroup: {
    expressions: [
      {
        filter: {
          fieldName: 'hostName',
          stringFilter: { value: host, matchType: 'EXACT' }
        }
      }
    ]
  }
}
```

**`getGA4TopPagesByHost(host, startStr, endStr)` 関数:**
- `hostName` でフィルタし、`pagePath` をディメンションに
- メトリクス: `screenPageViews`
- `limit`: 10
- 戻り値: `[{ pagePath, pageviews }, ...]`

**`getGA4KeyEventsByHost(host, startStr, endStr)` 関数:**
- 2つのAPIリクエストを発行し、結果をマージする:
  1. `KEY_EVENTS`（`close_convert_lead`, `qualify_lead`）→ `keyEvents` メトリクスで取得
  2. `TRACKED_EVENTS_COUNT`（`form_start`）→ `eventCount` メトリクスで取得
- それぞれ `hostName` EXACT + `eventName` `inListFilter` の `andGroup` でフィルタ
- 戻り値: `[{ eventName, count }, ...]`
- `ALL_TRACKED_EVENTS` に含まれるがデータがないイベントは0件として含める

---

### Prompt 3: GSCデータ取得関数

以下のGSCデータ取得関数をGASで実装してください。Search Console APIを `SearchConsole.Searchanalytics.query()` で呼び出します。

**`getGSCMetrics(startStr, endStr)` 関数:**
- ディメンションなしでサマリーを取得
- 戻り値: `{ clicks, impressions, ctr, position }`

```javascript
const response = SearchConsole.Searchanalytics.query(
  {
    startDate: startStr,
    endDate: endStr,
    type: 'web'
  },
  GSC_SITE_URL
);
// response.rows[0] → { clicks, impressions, ctr, position }
```

**`getGSCTopQueries(startStr, endStr)` 関数:**
- ディメンション: `query`
- `rowLimit`: 10
- 戻り値: `[{ query, clicks, impressions, ctr, position }, ...]`

※ `getGSCTopPages` は不要（Sheet 4 は GA4 ベースの PV データを使用するため）。

---

### Prompt 4: 書き込み関数・チャート作成

以下の書き込み関数とチャート作成関数をGASで実装してください。

**書き込み関数（全て delete-then-insert パターン）:**

**`writeToSummarySheet(yearWeek, dateRange, corpMetrics, estMetrics, gscMetrics)` 関数:**
- Sheet 1 に1行書き込む
- M列（CVR）は計算式 `=IFERROR(H{row}/C{row}, 0)` を `setFormula()` で設定（Corp セッション=0 時の #DIV/0! 防止）
- `clearWeekRows()` → `appendRow()` の順

**`writeToChannelSheet(yearWeek, corpChannels, estChannels)` 関数:**
- Sheet 2 に複数行書き込む（コーポレート + 見積もり）
- 各行: `[yearWeek, host, channel, sessions, users]`

**`writeToQuerySheet(yearWeek, queries)` 関数:**
- Sheet 3 に複数行書き込む
- 各行: `[yearWeek, query, clicks, impressions, ctr, position]`

**`writeToPageSheet(yearWeek, corpPages, estPages)` 関数:**
- Sheet 4 に複数行書き込む（GA4 Top PVページ、コーポレート + 見積もり）
- 各行: `[yearWeek, host, pagePath, pageviews]`（4列、シート定義と一致）
- データソース: `getGA4TopPagesByHost()` の結果

**`writeToKeyEventSheet(yearWeek, corpEvents, estEvents)` 関数:**
- Sheet 5 に複数行書き込む
- 各行: `[yearWeek, host, eventName, count]`

**`rebuildCharts()` 関数:**
Sheet 6 の既存チャートを全て削除してから以下の5つを再作成:

1. **セッション推移**（折れ線、2系列）
   - X軸: Sheet 1 の A列（週）
   - 系列1: Sheet 1 の C列（Corp セッション）
   - 系列2: Sheet 1 の H列（Est セッション）

2. **PV推移**（折れ線、2系列）
   - 系列1: Sheet 1 の E列（Corp PV）
   - 系列2: Sheet 1 の J列（Est PV）

3. **CVR推移**（折れ線、1系列）
   - 系列: Sheet 1 の M列（Est→Corp CVR）

4. **GSC クリック・表示回数**（コンボチャート）
   - 棒: Sheet 1 の O列（表示回数）
   - 線: Sheet 1 の N列（クリック）

5. **エンゲージメント率推移**（折れ線、2系列）
   - 系列1: Sheet 1 の G列（Corp エンゲージメント率）
   - 系列2: Sheet 1 の L列（Est エンゲージメント率）

チャートの配置:
- 各チャート幅600px、高さ400px
- 2列配置（1行目にチャート1・2、2行目にチャート3・4、3行目にチャート5）
- チャートタイトルを設定

---

### Prompt 5: メインエントリポイント・バックフィル・トリガー

以下のメイン関数をGASで実装してください。

**`fetchWeeklyData(targetDate)` 関数:**
エントリポイント。引数省略時は `new Date()`。

```
1. calcDateRanges(targetDate) で対象週の日付範囲を取得
2. GA4データを取得:
   - getGA4HostMetrics(CORPORATE_HOST, ...)   → Sheet 1
   - getGA4HostMetrics(ESTIMATE_HOST, ...)    → Sheet 1
   - getGA4ChannelsByHost(CORPORATE_HOST, ...) → Sheet 2
   - getGA4ChannelsByHost(ESTIMATE_HOST, ...)  → Sheet 2
   - getGA4TopPagesByHost(CORPORATE_HOST, ...) → Sheet 4
   - getGA4TopPagesByHost(ESTIMATE_HOST, ...)  → Sheet 4
   - getGA4KeyEventsByHost(CORPORATE_HOST, ...) → Sheet 5
   - getGA4KeyEventsByHost(ESTIMATE_HOST, ...)  → Sheet 5
3. GSCデータを取得:
   - getGSCMetrics(...)      → Sheet 1
   - getGSCTopQueries(...)   → Sheet 3
4. 各シートに書き込み:
   - writeToSummarySheet(yearWeek, dateRange, corpMetrics, estMetrics, gscMetrics)
   - writeToChannelSheet(yearWeek, corpChannels, estChannels)
   - writeToQuerySheet(yearWeek, queries)
   - writeToPageSheet(yearWeek, corpPages, estPages)
   - writeToKeyEventSheet(yearWeek, corpEvents, estEvents)
5. rebuildCharts()
6. Logger.log() で完了メッセージ
```

注意:
- Sheet 4（Topページ）は **GA4の `screenPageViews` ベース**（`getGA4TopPagesByHost` の結果、4列: 週/ホスト/パス/PV）
- GSCの `getGSCTopPages()` は使用しない（GSCのページデータは Sheet 3 の検索クエリとは指標が異なるため）

**`backfill(startMondayStr, endMondayStr)` 関数:**
- 引数: **週開始日（月曜日）** の文字列（例: `'2026-01-05'`, `'2026-03-16'`）
- 引数が月曜日でない場合はエラーを投げる（誤用防止）
- startMonday から endMonday まで7日ずつループし、各月曜日に +6日した日曜日を endDate として `fetchWeeklyData()` に **直接日付範囲を渡す**（`calcDateRanges()` の3日オフセットを経由しない）
- 各週の実行後に `Utilities.sleep(1000)` を挟んでAPIレート制限を回避
- 使用例: `backfill('2026-01-06', '2026-03-16')` → W02〜W12 の11週分を取得

**`setupTrigger()` 関数:**
- 既存の `fetchWeeklyData` トリガーがあれば削除
- 毎週月曜 10:30 JST のTime-driven triggerを作成
- `ScriptApp.newTrigger('fetchWeeklyData').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(10).nearMinute(30).create()`

---

## 6. セットアップ手順

GASコードは `gas/funnel_dashboard.js` に実装済み。`gas/appsscript.json` も同梱。

1. Google Spreadsheet「CloudNature ファネルダッシュボード」を新規作成
2. **スプレッドシート設定 → 全般 → タイムゾーンを `(GMT+09:00) Tokyo` に変更**
3. メニュー「拡張機能」→「Apps Script」でエディタを開く
4. `appsscript.json` を表示（「プロジェクトの設定」→「appsscript.json マニフェスト ファイルをエディタで表示する」をON）
5. `gas/appsscript.json` の内容をApps Scriptの `appsscript.json` に貼り付け
6. `gas/funnel_dashboard.js` の内容をApps Scriptの `コード.gs` に貼り付け
7. **GCPプロジェクトとの紐付け:**
   - Apps Script エディタ →「プロジェクトの設定」→「Google Cloud Platform (GCP) プロジェクト」
   - 既存GCPプロジェクトのプロジェクト番号を入力
8. **GCP Console で以下のAPIを有効化:**
   - Google Analytics Data API (`analyticsdata.googleapis.com`)
   - Search Console API (`searchconsole.googleapis.com`)
9. Apps Script エディタ →「サービス」→ 以下を追加:
   - `Google Analytics Data API` (識別子: `AnalyticsData`)
   - `Google Search Console API` (識別子: `SearchConsole`)
10. `initializeSpreadsheet()` を実行 → 6シートとヘッダー・書式が自動作成される
12. `fetchWeeklyData()` を手動実行して動作確認
13. 必要に応じて `backfill('2026-01-06', '2026-03-16')` で過去データを一括取得（引数は月曜日の日付）
14. `setupTrigger()` を実行 → 毎週月曜10:30 JST自動実行が設定される
15. Cloud Run に `FUNNEL_SPREADSHEET_URL` 環境変数を設定 → 週次メールにリンクが表示される

---

## 7. 注意事項

### APIクォータ
- **GA4 Data API**: 1プロパティあたり1日10,000トークン。`runReport` 1回あたり約10トークン消費。週次実行（8回/週）では問題なし
- **GSC API**: 1日25,000リクエスト。週次3リクエストでは問題なし
- `backfill()` で大量に過去データを取得する際は `Utilities.sleep(1000)` で間隔を空ける

### GAS実行時間制限
- 通常アカウント: **6分**
- 週次1回の実行では十分余裕がある
- `backfill()` で多数の週を処理する場合、6分制限に注意。20週以上の場合は分割実行を推奨

### 日付計算の安全性
- 既存バックエンド（`weekly_report.py`）と同一アルゴリズム: `targetDate - 3日` が属する週を対象
- メール送信（10:00）とスプレッドシート更新（10:30）が常に同じ週のデータを参照する
- `targetDate` 引数で任意の日付を渡せば過去週の再取得が可能
- `backfill()` は月曜日を直接指定する方式で、日付計算の誤用を防止

### デバッグ
- `Logger.log()` でデバッグ情報を出力
- Apps Script エディタの「実行数」タブでログを確認可能
- APIレスポンスが空の場合は0で埋める（エラーにしない）

### Sheet 4（Topページ）のデータソース
- Sheet 4 は **GA4の `screenPageViews` ベース**（4列: 週/ホスト/パス/PV）
- GSC APIの `page` ディメンションはURLベースのクリック・表示回数であり、PVとは異なる指標のため使用しない

### メールへのスプレッドシートリンク
- 週次レポートメールのフッターにスプレッドシートへのリンクを追加済み
- 環境変数 `FUNNEL_SPREADSHEET_URL` にスプレッドシートのURLを設定すること
- GCP Secret Manager に追加、または Cloud Run の環境変数として設定
- 未設定の場合はリンクが表示されない（エラーにはならない）

---

## 8. 検証チェックリスト

- [ ] `initializeSpreadsheet()` → 6シートとヘッダー・書式が正しく作成される
- [ ] `fetchWeeklyData()` → 全シートにデータが書き込まれる
- [ ] 同じ週で再実行 → 重複行がなく、データが上書きされる（冪等性）
- [ ] Sheet 6 にチャートが正しく表示される
- [ ] 再実行後もチャートが崩れない
- [ ] `backfill()` で過去数週分を取得し、チャートのトレンドが正しく表示される
- [ ] % 列が正しく表示される（セルに `0.456` → 表示 `45.6%`）
- [ ] 翌週の自動実行後、新しい行追加とチャート自動更新を確認
- [ ] 週次メールのフッターにスプレッドシートリンクが表示される（`FUNNEL_SPREADSHEET_URL` 設定後）
