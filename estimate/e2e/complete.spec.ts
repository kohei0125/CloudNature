import { test, expect } from "@playwright/test";
import { seedLocalStorage, MOCK_ESTIMATE } from "./helpers";

const MOCK_SESSION = {
  sessionId: "test-session-123",
  currentStep: 13,
  answers: {
    13: JSON.stringify({
      name: "テスト太郎",
      company: "テスト株式会社",
      email: "test@example.com",
    }),
  },
  messages: [],
  status: "completed",
  consent: true,
  aiOptions: {},
};

test.describe("Complete page (/complete)", () => {
  test("shows estimate data from localStorage", async ({ page }) => {
    // Navigate once to get access to localStorage, then seed data
    await page.goto("/complete");
    await seedLocalStorage(page, "estimate_result", MOCK_ESTIMATE);
    await seedLocalStorage(page, "session", MOCK_SESSION);
    await page.goto("/complete");

    // Success header
    await expect(
      page.getByText("概算お見積もりが完成しました")
    ).toBeVisible();

    // Client name
    await expect(page.getByText("テスト太郎 様")).toBeVisible();

    // Advantage cards
    await expect(
      page.getByText("AIが開発工程の80%を自動化")
    ).toBeVisible();
    await expect(page.getByText("納期も最短1/3に短縮")).toBeVisible();

    // CTA: booking link
    await expect(
      page.getByRole("link", { name: /無料相談を予約する/ })
    ).toBeVisible();
  });

  test("shows fallback when no estimate data", async ({ page }) => {
    // Clear any leftover data
    await page.goto("/complete");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/complete");

    // Should show fallback message
    await expect(
      page.getByText("見積もりデータが見つかりません")
    ).toBeVisible();

    // Link to restart
    await expect(
      page.getByRole("link", { name: "見積もりを始める" })
    ).toBeVisible();
  });

  test("savings percentage is calculated and displayed", async ({ page }) => {
    await page.goto("/complete");
    await seedLocalStorage(page, "estimate_result", MOCK_ESTIMATE);
    await seedLocalStorage(page, "session", MOCK_SESSION);
    await page.goto("/complete");

    // standard=1300000, hybrid=650000 → savings=50%
    await expect(page.getByText("約50%のコストダウン")).toBeVisible();
  });

  test("back to top link is present", async ({ page }) => {
    await page.goto("/complete");
    await seedLocalStorage(page, "estimate_result", MOCK_ESTIMATE);
    await seedLocalStorage(page, "session", MOCK_SESSION);
    await page.goto("/complete");

    await expect(
      page.getByRole("link", { name: "TOPページにもどる" })
    ).toBeVisible();
  });

  test("disclaimer text is shown", async ({ page }) => {
    await page.goto("/complete");
    await seedLocalStorage(page, "estimate_result", MOCK_ESTIMATE);
    await seedLocalStorage(page, "session", MOCK_SESSION);
    await page.goto("/complete");

    await expect(
      page.getByText("本見積もりはAIによる概算であり")
    ).toBeVisible();
  });
});
