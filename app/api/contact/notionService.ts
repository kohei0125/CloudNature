import { Client } from "@notionhq/client";
import type { BlockObjectRequest, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  buildSalesFingerprints,
  CONFIDENCE_THRESHOLD,
  describeTriage,
  type SalesFingerprints,
  type TriageResult,
} from "@/lib/contact/triage";

// Notion「📩 リード管理」DBのプロパティ名。読み(fetchSalesFingerprints)と
// 書き(saveContactToNotion)の両方から参照するため1か所にまとめる。
// 読み側は失敗を握り潰して層2へ進む作りなので、名前がずれると無言で
// 照合が効かなくなる
const LEAD_PROPERTIES = {
  name: "名前",
  company: "会社名",
  email: "メールアドレス",
  phone: "電話番号",
  kind: "種別",
  status: "ステータス",
  createdAt: "作成日時",
} as const;

// 層1の読み出しはフォーム送信のレスポンスを待たせるため、SDK既定の60秒ではなく
// 短いタイムアウトにする。保存(saveContactToNotion)は after() 内で走るので既定のままでよい
const READ_TIMEOUT_MS = 2500;

let _notion: Client | null = null;
let _readNotion: Client | null = null;

function createClient(timeoutMs?: number): Client | null {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return null;
  }
  return new Client({ auth: process.env.NOTION_API_KEY, ...(timeoutMs ? { timeoutMs } : {}) });
}

function getNotion(): Client | null {
  if (!_notion) _notion = createClient();
  return _notion;
}

function getReadNotion(): Client | null {
  if (!_readNotion) _readNotion = createClient(READ_TIMEOUT_MS);
  return _readNotion;
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

function heading2(text: string): BlockObjectRequest {
  return {
    object: "block",
    type: "heading_2",
    heading_2: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

function paragraph(text: string): BlockObjectRequest {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: truncate(text, 2000) } }] },
  };
}

function divider(): BlockObjectRequest {
  return { object: "block", type: "divider", divider: {} };
}

// --- 過去の「営業」判定の読み出し ---------------------------------------

// @notionhq/client v5 では databases.query が廃止され、データソース単位のクエリになった。
// データソースIDは環境変数を増やさずにDBから解決し、プロセス内でキャッシュする
let _leadDataSourceId: string | null = null;

async function getLeadDataSourceId(notion: Client): Promise<string | null> {
  if (_leadDataSourceId) return _leadDataSourceId;

  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  if (!("data_sources" in database)) {
    console.error("[notion] lead database returned no data source list");
    return null;
  }
  if (database.data_sources.length === 0) {
    console.error("[notion] lead database has no data source");
    return null;
  }
  if (database.data_sources.length > 1) {
    // 先頭を決め打ちするため、増えたときは気づけるようにしておく
    console.warn(
      `[notion] lead database has ${database.data_sources.length} data sources; using the first`
    );
  }

  _leadDataSourceId = database.data_sources[0].id;
  return _leadDataSourceId;
}

// 自動仕分けが付けた「営業」を次の判定材料にすると、1件の誤判定が同じドメイン全体へ
// 永続的に広がってしまう。人が最後に触った行だけを信頼するため、インテグレーション
// (ボット)のIDを取得して突き合わせる
let _botUserId: string | null = null;

async function getBotUserId(notion: Client): Promise<string> {
  if (_botUserId) return _botUserId;

  const me = await notion.users.me({});
  _botUserId = me.id;
  return _botUserId;
}

function readEmail(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  return prop?.type === "email" ? (prop.email ?? "") : "";
}

function readPhone(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  return prop?.type === "phone_number" ? (prop.phone_number ?? "") : "";
}

/**
 * ステータスが「営業」のリードから、メールアドレス・ドメイン・電話番号の指紋を作る。
 * 手動でステータスを直した結果がそのまま次回の判定材料になるため、
 * ブラックリストを別途持たなくてよい。
 *
 * ただし自動仕分けが書いた行は除外する（最終更新者がボットの行）。含めてしまうと
 * 誤判定が自分の入力になって増幅するため。ボットIDを特定できない場合は
 * 指紋を作らず層1をスキップする（フェイルクローズ）。
 *
 * 新しい順に最大100件まで見る。営業が100件を超えた場合は古い指紋から落ちるが、
 * 同じ送信元は繰り返し届くため実用上の取りこぼしは小さい。
 */
export async function fetchSalesFingerprints(): Promise<SalesFingerprints | null> {
  const notion = getReadNotion();
  if (!notion) return null;

  try {
    const [botUserId, dataSourceId] = await Promise.all([
      getBotUserId(notion),
      getLeadDataSourceId(notion),
    ]);
    if (!dataSourceId) return null;

    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: LEAD_PROPERTIES.status, select: { equals: "営業" } },
      sorts: [{ property: LEAD_PROPERTIES.createdAt, direction: "descending" }],
      page_size: 100,
    });

    // results には data source オブジェクトも混ざりうる。object と properties の
    // 両方で絞り込まないと、スキーマ定義をページとして読んでしまう
    const rows = res.results.flatMap((page) => {
      if (page.object !== "page" || !("properties" in page)) return [];
      // 人が確認していない（自動仕分けのまま触られていない）行は使わない
      if (page.last_edited_by.id === botUserId) return [];

      return [
        {
          email: readEmail(page, LEAD_PROPERTIES.email),
          phone: readPhone(page, LEAD_PROPERTIES.phone),
        },
      ];
    });

    // 「営業」の行はあるのに1件も指紋にならない状態は、層1が無言で効かなくなっている
    // 可能性が高い（プロパティ名の変更、ボット判定の取り違え等）。ログで気づけるようにする
    if (res.results.length > 0 && rows.length === 0) {
      console.warn(
        `[notion] ${res.results.length} 営業 leads found but none were human-reviewed; layer 1 is inactive`
      );
    }

    return buildSalesFingerprints(rows);
  } catch (err) {
    console.error("[notion] Failed to load past sales verdicts:", err);
    return null;
  }
}

// --- 保存 ---------------------------------------------------------------

const TRIAGE_SOURCE_LABELS: Record<TriageResult["source"], string> = {
  rule: "過去の判定との照合",
  evaluation: "AIによる本文の判定",
  fallback: "判定できず",
};

function buildTriageBlocks(triage: TriageResult): BlockObjectRequest[] {
  const { verdictLabel, confidencePercent, reasonBullets } = describeTriage(triage);
  const source = TRIAGE_SOURCE_LABELS[triage.source];
  const summary =
    triage.source === "fallback"
      ? `${verdictLabel}（${source}）`
      : `${verdictLabel}（確信度 ${confidencePercent}% / ${source}）`;

  const lines = [summary, ...reasonBullets];

  // 「見込み客」は確信度に関係なく未対応になるため、確信度で止まった場合だけ注記する
  if (triage.verdict !== null && triage.status === "未対応" && triage.confidence < CONFIDENCE_THRESHOLD) {
    lines.push("※ 確信度が低いためステータスは「未対応」のままにしています");
  }

  return [heading2("🤖 自動仕分け"), paragraph(lines.join("\n")), divider()];
}

export interface ContactNotionPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  triage?: TriageResult;
}

export async function saveContactToNotion(
  payload: ContactNotionPayload
): Promise<void> {
  const notion = getNotion();
  if (!notion) return;

  const databaseId = process.env.NOTION_DATABASE_ID!;

  const children: BlockObjectRequest[] = [
    ...(payload.triage ? buildTriageBlocks(payload.triage) : []),
    heading2("お問い合わせ種別"),
    paragraph(payload.subject || "未選択"),
    divider(),
    heading2("メッセージ"),
    paragraph(payload.message),
  ];

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      [LEAD_PROPERTIES.name]: { title: [{ text: { content: payload.name } }] },
      [LEAD_PROPERTIES.company]: { rich_text: [{ text: { content: payload.company || "" } }] },
      [LEAD_PROPERTIES.email]: { email: payload.email },
      [LEAD_PROPERTIES.phone]: { phone_number: payload.phone },
      [LEAD_PROPERTIES.kind]: { select: { name: "お問い合わせ" } },
      [LEAD_PROPERTIES.status]: { select: { name: payload.triage?.status ?? "未対応" } },
    },
    children,
  });
}
