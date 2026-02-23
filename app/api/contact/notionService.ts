import { Client } from "@notionhq/client";
import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";

let _notion: Client | null = null;

function getNotion(): Client | null {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return null;
  }
  if (!_notion) {
    _notion = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return _notion;
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

export interface ContactNotionPayload {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
}

export async function saveContactToNotion(
  payload: ContactNotionPayload
): Promise<void> {
  const notion = getNotion();
  if (!notion) return;

  const databaseId = process.env.NOTION_DATABASE_ID!;

  const children: BlockObjectRequest[] = [
    heading2("お問い合わせ種別"),
    paragraph(payload.subject || "未選択"),
    divider(),
    heading2("メッセージ"),
    paragraph(payload.message),
  ];

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      "名前": { title: [{ text: { content: payload.name } }] },
      "会社名": { rich_text: [{ text: { content: payload.company || "" } }] },
      "メールアドレス": { email: payload.email },
      "種別": { select: { name: "お問い合わせ" } },
      "ステータス": { select: { name: "未対応" } },
    },
    children,
  });
}
