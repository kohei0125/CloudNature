// ============================================================
// CloudNature ファネルダッシュボード — Google Apps Script
// ============================================================

// ── 定数 ──
const GA4_PROPERTY = 'properties/527141612';
const GSC_SITE_URL = 'sc-domain:cloudnature.jp';
const CORPORATE_HOST = 'cloudnature.jp';
const ESTIMATE_HOST = 'ai.cloudnature.jp';
// GA4管理画面で「キーイベント」にマーク済み → keyEvents メトリクスで取得
const KEY_EVENTS = ['close_convert_lead', 'qualify_lead'];
// キーイベント未指定だがファネル上重要 → eventCount メトリクスで取得
const TRACKED_EVENTS_COUNT = ['form_start'];
// 全追跡対象（Sheet 5 に書き込む）
const ALL_TRACKED_EVENTS = [...KEY_EVENTS, ...TRACKED_EVENTS_COUNT];

// シート名
const SHEET_SUMMARY = '週次サマリー';
const SHEET_CHANNEL = 'チャネル別';
const SHEET_QUERY = 'Top検索クエリ';
const SHEET_PAGE = 'Topページ';
const SHEET_KEY_EVENT = 'キーイベント詳細';
const SHEET_CHART = 'チャート';

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ISO 8601 year-week 文字列を返す（月曜始まり）。
 * 例: 2026-W12
 */
function getYearWeek(d) {
  const date = new Date(d.getTime());
  // ISO週の木曜日を基準にyearを決定
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return date.getFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

/**
 * Date を YYYY-MM-DD 文字列に変換する。
 */
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 既存Pythonの日付計算ロジックと同一アルゴリズム。
 * targetDate（省略時は現在日時）から3日前が属するISO週の月〜日を返す。
 */
function calcDateRanges(targetDate) {
  const today = targetDate || new Date();

  // GSCデータ遅延（3日）を考慮
  const latestAvailable = new Date(today.getTime());
  latestAvailable.setDate(latestAvailable.getDate() - 3);

  // latestAvailableが属する週の月曜を算出
  // JSのgetDay(): 日=0,月=1,...,土=6 → ISO月曜始まり: 月=0,...,日=6
  const dayOfWeek = (latestAvailable.getDay() + 6) % 7; // 月=0〜日=6
  const availableMonday = new Date(latestAvailable.getTime());
  availableMonday.setDate(availableMonday.getDate() - dayOfWeek);

  const endDate = new Date(availableMonday.getTime());
  endDate.setDate(endDate.getDate() + 6);

  const yearWeek = getYearWeek(availableMonday);
  const startStr = formatDate(availableMonday);
  const endStr = formatDate(endDate);

  return {
    yearWeek: yearWeek,
    startDate: availableMonday,
    endDate: endDate,
    startStr: startStr,
    endStr: endStr,
  };
}

/**
 * 対象週の既存行を削除する（冪等性のため）。
 * headerRows: スキップするヘッダー行数（Sheet 1 は 2、他は 1）。
 */
function clearWeekRows(sheet, yearWeek, headerRows) {
  if (typeof headerRows === 'undefined') headerRows = 1;
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= headerRows; i--) {
    if (data[i][0] === yearWeek) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ============================================================
// 初期化
// ============================================================

/**
 * スプレッドシートの6シートを作成し、ヘッダー・書式を設定する。
 */
function initializeSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Sheet 1: 週次サマリー ---
  let s1 = ss.getSheetByName(SHEET_SUMMARY);
  if (!s1) {
    s1 = ss.insertSheet(SHEET_SUMMARY);
  }
  // Row 1: マージヘッダー
  s1.getRange('A1').setValue('');
  s1.getRange('B1').setValue('');
  s1.getRange('C1').setValue('コーポレートサイト');
  s1.getRange('C1:G1').merge();
  s1.getRange('H1').setValue('見積もりサイト');
  s1.getRange('H1:L1').merge();
  s1.getRange('M1').setValue('検索');
  s1.getRange('M1:N1').merge();
  s1.getRange('O1').setValue('コンバージョン');
  s1.getRange('O1:Q1').merge();
  s1.getRange('A1:Q1').setFontWeight('bold').setHorizontalAlignment('center')
    .setBackground('#F4F2F0');

  // Row 2: 列ヘッダー
  const summaryHeaders = [
    '週', '期間',
    '訪問数', 'ユーザー数', 'ページ閲覧数', '直帰率', 'エンゲージメント率',
    '訪問数', 'ユーザー数', 'ページ閲覧数', '直帰率', 'エンゲージメント率',
    '検索クリック数', '検索表示回数',
    'フォーム開始', 'リード獲得', '成約',
  ];
  s1.getRange(2, 1, 1, summaryHeaders.length).setValues([summaryHeaders])
    .setFontWeight('bold').setBackground('#F4F2F0');

  // 書式設定
  s1.getRange('F:F').setNumberFormat('0.0%');
  s1.getRange('G:G').setNumberFormat('0.0%');
  s1.getRange('K:K').setNumberFormat('0.0%');
  s1.getRange('L:L').setNumberFormat('0.0%');

  s1.setFrozenRows(2);

  // --- Sheet 2: チャネル別 ---
  let s2 = ss.getSheetByName(SHEET_CHANNEL);
  if (!s2) {
    s2 = ss.insertSheet(SHEET_CHANNEL);
  }
  s2.getRange(1, 1, 1, 5).setValues([['週', 'サイト', '流入元', '訪問数', 'ユーザー数']])
    .setFontWeight('bold').setBackground('#F4F2F0');
  s2.setFrozenRows(1);

  // --- Sheet 3: Top検索クエリ ---
  let s3 = ss.getSheetByName(SHEET_QUERY);
  if (!s3) {
    s3 = ss.insertSheet(SHEET_QUERY);
  }
  s3.getRange(1, 1, 1, 6).setValues([['週', '検索キーワード', 'クリック数', '表示回数', 'クリック率', '平均順位']])
    .setFontWeight('bold').setBackground('#F4F2F0');
  s3.getRange('E:E').setNumberFormat('0.0%');
  s3.getRange('F:F').setNumberFormat('0.0');
  s3.setFrozenRows(1);

  // --- Sheet 4: Topページ ---
  let s4 = ss.getSheetByName(SHEET_PAGE);
  if (!s4) {
    s4 = ss.insertSheet(SHEET_PAGE);
  }
  s4.getRange(1, 1, 1, 4).setValues([['週', 'サイト', 'ページ', '閲覧数']])
    .setFontWeight('bold').setBackground('#F4F2F0');
  s4.setFrozenRows(1);

  // --- Sheet 5: キーイベント詳細 ---
  let s5 = ss.getSheetByName(SHEET_KEY_EVENT);
  if (!s5) {
    s5 = ss.insertSheet(SHEET_KEY_EVENT);
  }
  s5.getRange(1, 1, 1, 4).setValues([['週', 'サイト', 'アクション名', '件数']])
    .setFontWeight('bold').setBackground('#F4F2F0');
  s5.setFrozenRows(1);

  // --- Sheet 6: チャート ---
  let s6 = ss.getSheetByName(SHEET_CHART);
  if (!s6) {
    s6 = ss.insertSheet(SHEET_CHART);
  }

  // デフォルトの Sheet1 を削除
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('シート1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('initializeSpreadsheet 完了: 6シート作成済み');
}

// ============================================================
// GA4 データ取得
// ============================================================

/**
 * ホスト別の GA4 サマリーメトリクスを取得する。
 */
function getGA4HostMetrics(host, startStr, endStr) {
  const request = {
    dimensions: [{ name: 'hostName' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' },
      { name: 'engagementRate' },
    ],
    dateRanges: [{ startDate: startStr, endDate: endStr }],
    dimensionFilter: {
      filter: {
        fieldName: 'hostName',
        stringFilter: {
          value: host,
          matchType: 'EXACT',
        },
      },
    },
  };

  const response = AnalyticsData.Properties.runReport(request, GA4_PROPERTY);

  if (!response.rows || response.rows.length === 0) {
    return { sessions: 0, users: 0, pageviews: 0, bounceRate: 0, engagementRate: 0 };
  }

  const row = response.rows[0];
  return {
    sessions: parseInt(row.metricValues[0].value || '0', 10),
    users: parseInt(row.metricValues[1].value || '0', 10),
    pageviews: parseInt(row.metricValues[2].value || '0', 10),
    bounceRate: parseFloat(row.metricValues[3].value || '0'),
    engagementRate: parseFloat(row.metricValues[4].value || '0'),
  };
}

/**
 * ホスト別のチャネルデータを取得する。
 */
function getGA4ChannelsByHost(host, startStr, endStr) {
  const request = {
    dimensions: [
      { name: 'sessionDefaultChannelGroup' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
    ],
    dateRanges: [{ startDate: startStr, endDate: endStr }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'hostName',
              stringFilter: { value: host, matchType: 'EXACT' },
            },
          },
        ],
      },
    },
    limit: 20,
  };

  const response = AnalyticsData.Properties.runReport(request, GA4_PROPERTY);
  const results = [];

  if (response.rows) {
    for (const row of response.rows) {
      results.push({
        channel: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value || '0', 10),
        users: parseInt(row.metricValues[1].value || '0', 10),
      });
    }
  }

  return results;
}

/**
 * ホスト別の Top ページ（PV順）を取得する。
 */
function getGA4TopPagesByHost(host, startStr, endStr) {
  const request = {
    dimensions: [
      { name: 'pagePath' },
    ],
    metrics: [
      { name: 'screenPageViews' },
    ],
    dateRanges: [{ startDate: startStr, endDate: endStr }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'hostName',
              stringFilter: { value: host, matchType: 'EXACT' },
            },
          },
        ],
      },
    },
    limit: 10,
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  };

  const response = AnalyticsData.Properties.runReport(request, GA4_PROPERTY);
  const results = [];

  if (response.rows) {
    for (const row of response.rows) {
      results.push({
        pagePath: row.dimensionValues[0].value,
        pageviews: parseInt(row.metricValues[0].value || '0', 10),
      });
    }
  }

  return results;
}

/**
 * ホスト別のイベントデータを取得する。
 * KEY_EVENTS は keyEvents メトリクスで、TRACKED_EVENTS_COUNT は eventCount メトリクスで取得。
 * データがないイベントは0件で返す。
 */
function getGA4KeyEventsByHost(host, startStr, endStr) {
  const eventMap = {};

  // 1. キーイベント（keyEvents メトリクス）
  if (KEY_EVENTS.length > 0) {
    const keyRequest = {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'keyEvents' }],
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'hostName',
                stringFilter: { value: host, matchType: 'EXACT' },
              },
            },
            {
              filter: {
                fieldName: 'eventName',
                inListFilter: { values: KEY_EVENTS },
              },
            },
          ],
        },
      },
    };
    const keyResponse = AnalyticsData.Properties.runReport(keyRequest, GA4_PROPERTY);
    if (keyResponse.rows) {
      for (const row of keyResponse.rows) {
        eventMap[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value || '0', 10);
      }
    }
  }

  // 2. 通常イベント（eventCount メトリクス）
  if (TRACKED_EVENTS_COUNT.length > 0) {
    const countRequest = {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'hostName',
                stringFilter: { value: host, matchType: 'EXACT' },
              },
            },
            {
              filter: {
                fieldName: 'eventName',
                inListFilter: { values: TRACKED_EVENTS_COUNT },
              },
            },
          ],
        },
      },
    };
    const countResponse = AnalyticsData.Properties.runReport(countRequest, GA4_PROPERTY);
    if (countResponse.rows) {
      for (const row of countResponse.rows) {
        eventMap[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value || '0', 10);
      }
    }
  }

  // ALL_TRACKED_EVENTS の全てを含む結果を返す（データなしは0件）
  const results = [];
  for (const eventName of ALL_TRACKED_EVENTS) {
    results.push({
      eventName: eventName,
      count: eventMap[eventName] || 0,
    });
  }

  return results;
}

// ============================================================
// GSC データ取得（UrlFetchApp 経由の REST API 呼び出し）
// ============================================================

/**
 * GSC searchAnalytics.query を UrlFetchApp で呼び出すヘルパー。
 * GAS の高度サービス（SearchConsole）は serviceId/version の不整合で
 * 動作しないケースがあるため、REST API を直接呼び出す。
 */
function gscQuery_(siteUrl, payload) {
  const encodedUrl = encodeURIComponent(siteUrl);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}/searchAnalytics/query`;
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  const res = UrlFetchApp.fetch(endpoint, options);
  if (res.getResponseCode() !== 200) {
    throw new Error('GSC API error: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText());
}

/**
 * GSC サマリーメトリクスを取得する。
 */
function getGSCMetrics(startStr, endStr) {
  const response = gscQuery_(GSC_SITE_URL, {
    startDate: startStr,
    endDate: endStr,
    type: 'web',
  });

  if (!response.rows || response.rows.length === 0) {
    return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  }

  const row = response.rows[0];
  return {
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  };
}

/**
 * GSC Top 10 検索クエリを取得する。
 */
function getGSCTopQueries(startStr, endStr) {
  const response = gscQuery_(GSC_SITE_URL, {
    startDate: startStr,
    endDate: endStr,
    dimensions: ['query'],
    rowLimit: 10,
    type: 'web',
  });

  const results = [];
  if (response.rows) {
    for (const row of response.rows) {
      results.push({
        query: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      });
    }
  }

  return results;
}

// ============================================================
// 書き込み関数
// ============================================================

/**
 * Sheet 1（週次サマリー）に1行書き込む。
 * キーイベント（フォーム開始・リード獲得・成約）も統合。
 */
function writeToSummarySheet(yearWeek, dateRange, corpMetrics, estMetrics, gscMetrics, corpEvents, estEvents) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SUMMARY);

  clearWeekRows(sheet, yearWeek, 2);

  // キーイベントを合算（コーポレート + 見積もり）
  const eventTotals = {};
  for (const e of (corpEvents || [])) {
    eventTotals[e.eventName] = (eventTotals[e.eventName] || 0) + e.count;
  }
  for (const e of (estEvents || [])) {
    eventTotals[e.eventName] = (eventTotals[e.eventName] || 0) + e.count;
  }

  const row = [
    yearWeek,
    dateRange,
    corpMetrics.sessions,
    corpMetrics.users,
    corpMetrics.pageviews,
    corpMetrics.bounceRate,
    corpMetrics.engagementRate,
    estMetrics.sessions,
    estMetrics.users,
    estMetrics.pageviews,
    estMetrics.bounceRate,
    estMetrics.engagementRate,
    gscMetrics.clicks,
    gscMetrics.impressions,
    eventTotals['form_start'] || 0,
    eventTotals['qualify_lead'] || 0,
    eventTotals['close_convert_lead'] || 0,
  ];

  sheet.appendRow(row);
}

/**
 * Sheet 2（チャネル別）に書き込む。
 */
function writeToChannelSheet(yearWeek, corpChannels, estChannels) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_CHANNEL);

  clearWeekRows(sheet, yearWeek, 1);

  const rows = [];
  for (const ch of corpChannels) {
    rows.push([yearWeek, CORPORATE_HOST, ch.channel, ch.sessions, ch.users]);
  }
  for (const ch of estChannels) {
    rows.push([yearWeek, ESTIMATE_HOST, ch.channel, ch.sessions, ch.users]);
  }

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
  }
}

/**
 * Sheet 3（Top検索クエリ）に書き込む。
 */
function writeToQuerySheet(yearWeek, queries) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_QUERY);

  clearWeekRows(sheet, yearWeek, 1);

  const rows = [];
  for (const q of queries) {
    rows.push([yearWeek, q.query, q.clicks, q.impressions, q.ctr, q.position]);
  }

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  }
}

/**
 * Sheet 4（Topページ）に書き込む。GA4 PVベース。
 */
function writeToPageSheet(yearWeek, corpPages, estPages) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PAGE);

  clearWeekRows(sheet, yearWeek, 1);

  const rows = [];
  for (const p of corpPages) {
    rows.push([yearWeek, CORPORATE_HOST, p.pagePath, p.pageviews]);
  }
  for (const p of estPages) {
    rows.push([yearWeek, ESTIMATE_HOST, p.pagePath, p.pageviews]);
  }

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
  }
}

/**
 * Sheet 5（キーイベント詳細）に書き込む。
 */
function writeToKeyEventSheet(yearWeek, corpEvents, estEvents) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_KEY_EVENT);

  clearWeekRows(sheet, yearWeek, 1);

  const rows = [];
  for (const e of corpEvents) {
    rows.push([yearWeek, CORPORATE_HOST, e.eventName, e.count]);
  }
  for (const e of estEvents) {
    rows.push([yearWeek, ESTIMATE_HOST, e.eventName, e.count]);
  }

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
  }
}

// ============================================================
// チャート
// ============================================================

/**
 * Sheet 6 の既存チャートを全て削除し、6つのチャートを再作成する。
 *
 * Sheet 1 列構成（Row 2 ヘッダー基準）:
 *   A:週  B:期間
 *   C:Corp訪問数  D:Corpユーザー数  E:Corpページ閲覧数  F:Corp直帰率  G:Corpエンゲージメント率
 *   H:Est訪問数   I:Estユーザー数   J:Estページ閲覧数   K:Est直帰率   L:Estエンゲージメント率
 *   M:検索クリック数  N:検索表示回数
 *   O:フォーム開始  P:リード獲得  Q:成約
 */
function rebuildCharts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const chartSheet = ss.getSheetByName(SHEET_CHART);
  const summarySheet = ss.getSheetByName(SHEET_SUMMARY);

  // 既存チャートを全て削除
  const existingCharts = chartSheet.getCharts();
  for (const chart of existingCharts) {
    chartSheet.removeChart(chart);
  }

  const lastRow = summarySheet.getLastRow();
  if (lastRow <= 2) {
    Logger.log('データがないためチャートをスキップ');
    return;
  }

  const chartWidth = 600;
  const chartHeight = 400;

  // 1. サイト訪問数の推移（折れ線、2系列）
  const sessionsChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('C2:C' + lastRow)) // Corp 訪問数
    .addRange(summarySheet.getRange('H2:H' + lastRow)) // Est 訪問数
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', 'サイト訪問数の推移')
    .setOption('hAxis.title', '週')
    .setOption('vAxis.title', '訪問数')
    .setOption('series', {
      0: { labelInLegend: 'コーポレートサイト' },
      1: { labelInLegend: '見積もりサイト' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(1, 1, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(sessionsChart);

  // 2. ページ閲覧数の推移（折れ線、2系列）
  const pvChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('E2:E' + lastRow)) // Corp ページ閲覧数
    .addRange(summarySheet.getRange('J2:J' + lastRow)) // Est ページ閲覧数
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', 'ページ閲覧数の推移')
    .setOption('hAxis.title', '週')
    .setOption('vAxis.title', '閲覧数')
    .setOption('series', {
      0: { labelInLegend: 'コーポレートサイト' },
      1: { labelInLegend: '見積もりサイト' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(1, 8, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(pvChart);

  // 3. Google検索パフォーマンス（コンボチャート）
  const gscChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.COMBO)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('N2:N' + lastRow)) // 検索表示回数
    .addRange(summarySheet.getRange('M2:M' + lastRow)) // 検索クリック数
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', 'Google検索パフォーマンス')
    .setOption('hAxis.title', '週')
    .setOption('series', {
      0: { type: 'bars', labelInLegend: '検索結果に表示された回数' },
      1: { type: 'line', labelInLegend: 'クリックされた回数', targetAxisIndex: 1 },
    })
    .setOption('vAxes', {
      0: { title: '表示回数' },
      1: { title: 'クリック数' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(22, 1, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(gscChart);

  // 4. コンバージョン推移（折れ線、3系列）
  const convChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('O2:O' + lastRow)) // フォーム開始
    .addRange(summarySheet.getRange('P2:P' + lastRow)) // リード獲得
    .addRange(summarySheet.getRange('Q2:Q' + lastRow)) // 成約
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', 'コンバージョン推移（フォーム → リード → 成約）')
    .setOption('hAxis.title', '週')
    .setOption('vAxis.title', '件数')
    .setOption('series', {
      0: { labelInLegend: 'フォーム開始' },
      1: { labelInLegend: 'リード獲得' },
      2: { labelInLegend: '成約' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(22, 8, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(convChart);

  // 5. エンゲージメント率の推移（折れ線、2系列）
  const engagementChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('G2:G' + lastRow)) // Corp エンゲージメント率
    .addRange(summarySheet.getRange('L2:L' + lastRow)) // Est エンゲージメント率
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', 'エンゲージメント率の推移')
    .setOption('hAxis.title', '週')
    .setOption('vAxis.title', 'エンゲージメント率')
    .setOption('vAxis.format', 'percent')
    .setOption('series', {
      0: { labelInLegend: 'コーポレートサイト' },
      1: { labelInLegend: '見積もりサイト' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(43, 1, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(engagementChart);

  // 6. 直帰率の推移（折れ線、2系列）
  const bounceChart = chartSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(summarySheet.getRange('A2:A' + lastRow))
    .addRange(summarySheet.getRange('F2:F' + lastRow)) // Corp 直帰率
    .addRange(summarySheet.getRange('K2:K' + lastRow)) // Est 直帰率
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', '直帰率の推移（低いほど良い）')
    .setOption('hAxis.title', '週')
    .setOption('vAxis.title', '直帰率')
    .setOption('vAxis.format', 'percent')
    .setOption('series', {
      0: { labelInLegend: 'コーポレートサイト' },
      1: { labelInLegend: '見積もりサイト' },
    })
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(43, 8, 0, 0)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .build();
  chartSheet.insertChart(bounceChart);

  Logger.log('rebuildCharts 完了: 6チャート作成');
}

// ============================================================
// メインエントリポイント
// ============================================================

/**
 * 週次データを取得・書き込みする。
 * targetDate: 省略時は new Date()（定期実行用）。
 * overrideRange: { startStr, endStr } を直接指定する場合（backfill用）。
 */
function fetchWeeklyData(targetDateOrEvent, overrideRange) {
  let yearWeek, startStr, endStr;

  if (overrideRange) {
    startStr = overrideRange.startStr;
    endStr = overrideRange.endStr;
    yearWeek = getYearWeek(new Date(startStr));
  } else {
    // GASトリガー/エディタ実行時はイベントオブジェクトが渡されるため、Date以外は無視
    const targetDate = (targetDateOrEvent instanceof Date) ? targetDateOrEvent : undefined;
    const range = calcDateRanges(targetDate);
    yearWeek = range.yearWeek;
    startStr = range.startStr;
    endStr = range.endStr;
  }

  const dateRange = startStr + ' ~ ' + endStr;
  Logger.log('取得対象: %s (%s)', yearWeek, dateRange);

  // GA4 データ取得
  const corpMetrics = getGA4HostMetrics(CORPORATE_HOST, startStr, endStr);
  const estMetrics = getGA4HostMetrics(ESTIMATE_HOST, startStr, endStr);
  const corpChannels = getGA4ChannelsByHost(CORPORATE_HOST, startStr, endStr);
  const estChannels = getGA4ChannelsByHost(ESTIMATE_HOST, startStr, endStr);
  const corpPages = getGA4TopPagesByHost(CORPORATE_HOST, startStr, endStr);
  const estPages = getGA4TopPagesByHost(ESTIMATE_HOST, startStr, endStr);
  const corpEvents = getGA4KeyEventsByHost(CORPORATE_HOST, startStr, endStr);
  const estEvents = getGA4KeyEventsByHost(ESTIMATE_HOST, startStr, endStr);

  // GSC データ取得
  const gscMetrics = getGSCMetrics(startStr, endStr);
  const gscQueries = getGSCTopQueries(startStr, endStr);

  // 各シートに書き込み
  writeToSummarySheet(yearWeek, dateRange, corpMetrics, estMetrics, gscMetrics, corpEvents, estEvents);
  writeToChannelSheet(yearWeek, corpChannels, estChannels);
  writeToQuerySheet(yearWeek, gscQueries);
  writeToPageSheet(yearWeek, corpPages, estPages);
  writeToKeyEventSheet(yearWeek, corpEvents, estEvents);

  // チャート再作成
  rebuildCharts();

  Logger.log('fetchWeeklyData 完了: %s', yearWeek);
}

/**
 * 過去データを一括取得する。
 * 引数は週開始日（月曜日）の文字列。月曜日でない場合はエラー。
 * 例: backfill('2026-01-06', '2026-03-16')
 */
function backfill(startMondayStr, endMondayStr) {
  const startMonday = new Date(startMondayStr);
  const endMonday = new Date(endMondayStr);

  // 月曜日チェック（JS: getDay() 月=1）
  if (startMonday.getDay() !== 1) {
    throw new Error('startMondayStr は月曜日の日付を指定してください: ' + startMondayStr);
  }
  if (endMonday.getDay() !== 1) {
    throw new Error('endMondayStr は月曜日の日付を指定してください: ' + endMondayStr);
  }

  let current = new Date(startMonday.getTime());
  let weekCount = 0;

  while (current <= endMonday) {
    const monday = new Date(current.getTime());
    const sunday = new Date(current.getTime());
    sunday.setDate(sunday.getDate() + 6);

    const startStr = formatDate(monday);
    const endStr = formatDate(sunday);

    Logger.log('backfill: %s ~ %s', startStr, endStr);
    fetchWeeklyData(null, { startStr: startStr, endStr: endStr });

    weekCount++;
    current.setDate(current.getDate() + 7);

    // APIレート制限回避
    if (current <= endMonday) {
      Utilities.sleep(1000);
    }
  }

  Logger.log('backfill 完了: %d 週分取得', weekCount);
}

/**
 * 毎週月曜 10:30 JST のトリガーを設定する。
 */
function setupTrigger() {
  // 既存の fetchWeeklyData トリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'fetchWeeklyData') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('既存トリガーを削除: %s', trigger.getUniqueId());
    }
  }

  // 新規トリガー作成
  ScriptApp.newTrigger('fetchWeeklyData')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(10)
    .nearMinute(30)
    .create();

  Logger.log('setupTrigger 完了: 毎週月曜 10:30 JST');
}
