import { Client } from "@notionhq/client";
import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import type { ConsultationRequestBody } from "@/lib/emailTemplates";

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

export async function saveConsultationToNotion(
  body: ConsultationRequestBody
): Promise<void> {
  const notion = getNotion();
  if (!notion) return;

  const databaseId = process.env.NOTION_DATABASE_ID!;

  const utmLines = [
    body.utmSource && `utm_source: ${body.utmSource}`,
    body.utmMedium && `utm_medium: ${body.utmMedium}`,
    body.utmCampaign && `utm_campaign: ${body.utmCampaign}`,
    body.pageReferrer && `referrer: ${body.pageReferrer}`,
  ].filter((line): line is string => Boolean(line));

  const children: BlockObjectRequest[] = [
    heading2("ご相談内容"),
    paragraph(body.topic || "未記入"),
    divider(),
    heading2("連絡先"),
    paragraph(`${body.name}（${body.role}） / ${body.email}`),
  ];

  if (utmLines.length > 0) {
    children.push(divider(), heading2("流入情報"), paragraph(utmLines.join("\n")));
  }

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      "案件名": { title: [{ text: { content: `${body.company} 無料相談（${body.name}様）` } }] },
      "案件種別": { select: { name: "無料相談" } },
      "対象区分": { select: { name: "エンジニア向け" } },
      "流入元": { select: { name: "Web問い合わせ" } },
      "ステータス": { select: { name: "未接触" } },
      "顧客・主催者": { rich_text: [{ text: { content: body.company } }] },
      "窓口担当者": { rich_text: [{ text: { content: `${body.name}（${body.role}）` } }] },
    },
    children,
  });
}
