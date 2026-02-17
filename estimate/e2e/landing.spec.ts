import { test, expect } from "@playwright/test";

test.describe("Landing page (/)", () => {
  test("displays hero section with heading and CTA", async ({ page }) => {
    await page.goto("/");

    // Hero heading text
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("コスト");

    // CTA button linking to /chat
    const ctaLink = page.locator('a[href="/chat"]').first();
    await expect(ctaLink).toBeVisible();
  });

  test("cost simulator updates on selection", async ({ page }) => {
    await page.goto("/");

    // Simulator heading
    await expect(page.getByText("概算シミュレーター")).toBeVisible();

    // Default state: Webアプリ + 小規模 = 80万円
    await expect(page.getByText("80")).toBeVisible();

    // Click "AIエージェント" app type
    await page.getByRole("button", { name: "AIエージェント" }).click();
    // 100 * 1 = 100
    await expect(page.getByText("100")).toBeVisible();

    // Click "中規模" scale
    await page.getByRole("button", { name: "中規模" }).click();
    // 100 * 2 = 200
    await expect(page.getByText("200")).toBeVisible();
  });

  test("simulator CTA navigates to /chat", async ({ page }) => {
    await page.goto("/");

    const simCta = page.getByRole("link", {
      name: "この条件で詳しく見積もる",
    });
    await expect(simCta).toBeVisible();
    await simCta.click();

    await expect(page).toHaveURL(/\/chat/);
  });

  test("FAQ accordion opens and closes", async ({ page }) => {
    await page.goto("/");

    // Scroll to FAQ section
    const faqHeading = page.getByText("よくあるご質問");
    await faqHeading.scrollIntoViewIfNeeded();

    // Click first FAQ question
    const firstQuestion = page.getByText("AI見積もりの精度はどの程度ですか？");
    await firstQuestion.click();

    // Answer should become visible
    const firstAnswer = page.getByText("本サービスのAI見積もりは概算です");
    await expect(firstAnswer).toBeVisible();

    // Click again to close
    await firstQuestion.click();
    await expect(firstAnswer).not.toBeVisible();
  });

  test("benefits section shows 3 cards", async ({ page }) => {
    await page.goto("/");

    const reasonsSection = page.locator("#reasons");
    await reasonsSection.scrollIntoViewIfNeeded();

    // Each card title appears twice (mobile + desktop), use .first()
    await expect(
      page.getByRole("heading", { name: "専門データ学習済みAIが正確に見積もり" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "最先端のAI活用で設計・開発の効率化" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "中間マージンを排除し40%コスト削減" }).first()
    ).toBeVisible();
  });

  test("flow section shows 4 steps", async ({ page }) => {
    await page.goto("/");

    const flowSection = page.locator("#flow");
    await flowSection.scrollIntoViewIfNeeded();

    // Use getByRole('heading') to avoid matching description text
    await expect(
      flowSection.getByRole("heading", { name: "AI見積もり" })
    ).toBeVisible();
    await expect(
      flowSection.getByRole("heading", { name: "詳細ヒアリング" })
    ).toBeVisible();
    await expect(
      flowSection.getByRole("heading", { name: "開発" })
    ).toBeVisible();
    await expect(
      flowSection.getByRole("heading", { name: "納品" })
    ).toBeVisible();
  });
});
