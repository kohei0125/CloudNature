# Apps Script GA4 権限エラー恒久対策

対応日: 2026-04-29

## 背景

週次SEOファネル情報をスプレッドシートへ保存するGoogle Apps Script (`fetchWeeklyData` / `updateCharts`) が、毎回権限エラーで失敗する状況が再発していた。

### エラー内容

```
2026/04/27 10:25:23  エラー  Exception: You do not have permission to call analyticsdata.properties.runReport.
Required permissions: https://www.googleapis.com/auth/analytics.readonly.
  at getGA4HostMetrics(コード:229:45)
  at fetchWeeklyData(コード:824:23)
```

### 症状

- `fetchWeeklyData` のエラー率 100%
- `updateCharts` トリガーは無効状態
- 過去にも同様の対応を実施したが再発

## 原因

Apps Script のデフォルトGCPプロジェクト（番号: `638139893800`）は Google が内部管理する領域で、ユーザーから直接操作できない。このプロジェクトは API 有効化状態が Google 側の都合で変動することがあり、結果として GA4 Data API の呼び出し権限が不定期に失われる。

`appsscript.json` のスコープ宣言・Advanced Service 設定自体は正しかったが、API 有効化状態を制御できないため再発を繰り返していた。

## 恒久対策

Apps Script を**自前のGCPプロジェクト**に紐づけ、API 有効化を自分で管理する構成に変更した。

### 1. GCPプロジェクト作成

- プロジェクト名: `cloudnature-apps-script`
- プロジェクト番号: `732878044533`

### 2. 必要なAPIを有効化

- Google Analytics Data API
- Google Search Console API（webmasters）

### 3. OAuth同意画面の設定

| 項目 | 設定値 |
| --- | --- |
| ユーザータイプ | 外部 |
| アプリ名 | CloudNature SEO Script |
| ユーザーサポートメール | watakooh5@gmail.com |
| デベロッパー連絡先 | watakooh5@gmail.com |
| 公開ステータス | テスト |
| テストユーザー | watakooh5@gmail.com |

### 4. Apps ScriptをGCPに紐づけ

「プロジェクトの設定」→「Google Cloud Platform（GCP）プロジェクト」のプロジェクト番号を `638139893800`（旧デフォルト）から `732878044533`（自前）に変更。

### 5. トリガーを削除→再作成

`fetchWeeklyData` / `updateCharts` のトリガーを一度削除し、新GCPで再認可した上で再作成。

| 関数 | スケジュール |
| --- | --- |
| fetchWeeklyData | 毎週月曜日 10:00–11:00 |
| updateCharts | 毎週月曜日 11:00–12:00 |

### 6. 動作確認

両関数を手動実行し、新GCPで認可ダイアログ（アプリ名「CloudNature SEO Script」）が表示されることを確認。実行は正常完了。

## `appsscript.json` 構成（参考）

マニフェスト自体は問題なし。今回の修正対象外だが、恒久対策の前提として以下が必要。

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {
    "enabledAdvancedServices": [
      { "userSymbol": "AnalyticsData", "version": "v1beta", "serviceId": "analyticsdata" },
      { "userSymbol": "SearchConsole", "version": "v1", "serviceId": "webmasters" }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}
```

## 今後再発した場合のチェックリスト

優先度順に確認する。

1. **GA4プロパティの権限**: `watakooh5@gmail.com` が対象GA4プロパティで「閲覧者」以上を持っているか
2. **GCPプロジェクト紐づけ**: Apps Script の「プロジェクトの設定」で GCP プロジェクト番号が `732878044533` のままか（勝手にデフォルトへ戻っていないか）
3. **API有効化状態**: GCP コンソールで Analytics Data API / Search Console API が有効か
4. **トリガーオーナー**: トリガーの「オーナー」列が `watakooh5@gmail.com` か（共有アカウント等に変わっていないか）
5. **マニフェスト**: `appsscript.json` の `oauthScopes` / `enabledAdvancedServices` に欠落がないか
6. **再認可**: 上記すべてOKなら、トリガー削除→手動実行で再認可→トリガー再作成

## 関連メモ

- OAuth同意画面の「テスト」ステータスは現状テストユーザー登録があれば期限切れにならない。自分一人で使う限り「本番環境に公開」は不要。
- `updateCharts` が無効化されていた原因は、過去の認可期限切れに伴うトリガー停止と推測。今回の再構成で解消。
