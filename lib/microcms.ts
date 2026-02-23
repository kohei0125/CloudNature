import type { MicroCMSListResponse, MicroCMSNewsArticle } from "@/types/microcms";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

const BASE_URL = SERVICE_DOMAIN ? `https://${SERVICE_DOMAIN}.microcms.io/api/v1` : "";

function isConfigured(): boolean {
  return Boolean(SERVICE_DOMAIN && API_KEY);
}

async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string>,
  revalidate = 60,
): Promise<T | null> {
  if (!isConfigured()) return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": API_KEY! },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

/** ニュース一覧を取得 */
export async function getNewsList(params?: {
  limit?: number;
  offset?: number;
  category?: string;
}): Promise<MicroCMSListResponse<MicroCMSNewsArticle>> {
  const empty: MicroCMSListResponse<MicroCMSNewsArticle> = {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: 0,
  };

  const query: Record<string, string> = {
    limit: String(params?.limit ?? 10),
    offset: String(params?.offset ?? 0),
    orders: "-publishedAt",
  };

  if (params?.category) {
    query.filters = `category[contains]${params.category}`;
  }

  const res = await fetchAPI<MicroCMSListResponse<MicroCMSNewsArticle>>("/news", query);
  return res ?? empty;
}

/** contentId で記事1件を取得（GET /api/v1/news/{id}） */
export async function getNewsArticle(
  id: string,
): Promise<MicroCMSNewsArticle | null> {
  return fetchAPI<MicroCMSNewsArticle>(`/news/${id}`);
}

/** ビルド時用: 全 contentId をページネーションで取得 */
export async function getAllNewsIds(): Promise<string[]> {
  const ids: string[] = [];
  const PER_PAGE = 100;
  let offset = 0;

  for (;;) {
    const res = await fetchAPI<MicroCMSListResponse<MicroCMSNewsArticle>>(
      "/news",
      { fields: "id", limit: String(PER_PAGE), offset: String(offset), orders: "-publishedAt" },
      60,
    );
    if (!res || res.contents.length === 0) break;
    ids.push(...res.contents.map((a) => a.id));
    if (ids.length >= res.totalCount) break;
    offset += PER_PAGE;
  }

  return ids;
}
