import type { Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// localStorage seeding helpers
// ---------------------------------------------------------------------------
const STORAGE_PREFIX = "cn_estimate_";
const SCHEMA_VERSION = 1;

/** Seed a value into the app's localStorage with the correct format. */
export async function seedLocalStorage(
  page: Page,
  key: string,
  data: unknown
) {
  await page.evaluate(
    ({ prefix, ver, k, d }) => {
      const stored = {
        v: ver,
        data: d,
        timestamp: Date.now(),
        ttl: 86400000,
      };
      localStorage.setItem(prefix + k, JSON.stringify(stored));
    },
    { prefix: STORAGE_PREFIX, ver: SCHEMA_VERSION, k: key, d: data }
  );
}

// ---------------------------------------------------------------------------
// Mock API setup
// ---------------------------------------------------------------------------
export const MOCK_SESSION_ID = "test-session-123";

export const MOCK_AI_FEATURES = [
  { value: "user_auth", label: "ユーザー認証・ログイン機能" },
  { value: "dashboard", label: "ダッシュボード" },
  { value: "notification", label: "通知機能" },
  { value: "file_upload", label: "ファイルアップロード" },
  { value: "search", label: "検索機能" },
];

export const MOCK_ESTIMATE = {
  projectName: "テストプロジェクト",
  summary: "WEBアプリ開発の概算見積もりです。",
  developmentModelExplanation: "AIハイブリッド開発モデル",
  features: [
    {
      name: "ユーザー認証",
      detail: "ログイン・ログアウト機能",
      standardPrice: 500000,
      hybridPrice: 250000,
    },
    {
      name: "ダッシュボード",
      detail: "管理画面",
      standardPrice: 800000,
      hybridPrice: 400000,
    },
  ],
  discussionAgenda: ["技術選定", "スケジュール確認"],
  totalCost: {
    standard: 1300000,
    hybrid: 650000,
    message: "AIハイブリッド開発により約50%のコスト削減が可能です。",
  },
};

export async function setupApiMocks(page: Page) {
  // Mock: POST /api/estimate/start
  await page.route("**/api/estimate/start", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        sessionId: MOCK_SESSION_ID,
        status: "in_progress",
      }),
    })
  );

  // Mock: POST /api/estimate/step
  await page.route("**/api/estimate/step", async (route) => {
    const body = JSON.parse(route.request().postData() ?? "{}");
    const response: Record<string, unknown> = {
      success: true,
      nextStep: body.stepNumber + 1,
    };

    // Step 7 triggers AI feature generation
    if (body.stepNumber === 7) {
      response.aiOptions = { step8Features: MOCK_AI_FEATURES };
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  // Mock: POST /api/estimate/generate
  await page.route("**/api/estimate/generate", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "completed",
        estimate: MOCK_ESTIMATE,
      }),
    })
  );
}
