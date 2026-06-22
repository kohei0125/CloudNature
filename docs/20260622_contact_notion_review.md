# 問い合わせフォーム Notion保存不具合 調査・修正レビュー

## 検証目的

問い合わせメールは届くが、Notionにデータが保存されない原因を特定し、修正する。
（Vercelログにエラーは出ていない）

## 対象範囲

- `app/api/contact/route.ts`
- `app/api/contact/notionService.ts`

## 確認項目リスト

- [x] 本番(Vercel)に `NOTION_API_KEY` / `NOTION_DATABASE_ID` が設定されているか
      → 両方 Production に設定済み（環境変数未設定の線は除外）
- [x] Notion保存呼び出しが `await` されているか
- [x] レスポンス返却と保存処理のライフサイクル整合性

## 調査結果（原因）

`route.ts` の Notion保存が **`await` されない fire-and-forget 呼び出し** だった。

```ts
saveContactToNotion({ ... }).catch((err) => { ... });
return NextResponse.json({ success: true });
```

Vercel のサーバーレス関数はレスポンス返却直後に実行環境を凍結する。

- メール送信は `await Promise.allSettled(...)` でレスポンス前に完了 → 届く
- Notion保存は未 await のまま `return` → 進行中の Notion API リクエストが
  完走できず破棄される → 保存失敗
- 例外発生ではなく「凍結」なので `.catch()` に到達せず、ログにも残らない
  （症状「ログにエラー無し」と一致）

## 修正内容

Next.js 16 の `after()` を使用し、レスポンス返却後も関数寿命を延長して
保存処理を完走させる。

```ts
import { NextRequest, NextResponse, after } from "next/server";
// ...
after(async () => {
  try {
    await saveContactToNotion({ ... });
  } catch (err) {
    console.error("[notion] Failed to save contact:", err);
  }
});
return NextResponse.json({ success: true });
```

- レスポンスは従来どおり即時返却（保存待ちで遅延させない）
- 保存失敗時は確実に `console.error` に到達しログへ記録される

## 検証

- [x] `npx tsc --noEmit` パス
- [x] `npx eslint app/api/contact/route.ts` パス (EXIT=0)
- [ ] Codex レビュー — Codex CLI が ChatGPT アカウントのモデル制約
      (`model is not supported when using Codex with a ChatGPT account`)
      で起動できず未実施。CLI認証復旧後に再実施する
- [ ] 本番デプロイ後、実フォーム送信で Notion 保存を確認
