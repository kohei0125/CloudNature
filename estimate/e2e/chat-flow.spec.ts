import { test, expect, type Page } from "@playwright/test";
import {
  setupApiMocks,
  seedLocalStorage,
  MOCK_SESSION_ID,
  MOCK_AI_FEATURES,
  MOCK_ESTIMATE,
} from "./helpers";

// ---------------------------------------------------------------------------
// Helper: build session data for localStorage seeding
// ---------------------------------------------------------------------------
function buildSession(
  currentStep: number,
  answers: Record<number, string | string[]>,
  opts?: { aiOptions?: Record<string, unknown> }
) {
  return {
    sessionId: MOCK_SESSION_ID,
    currentStep,
    answers,
    messages: [],
    status: "in_progress",
    consent: false,
    aiOptions: opts?.aiOptions ?? {},
  };
}

// Pre-filled answers for steps 1-7
const ANSWERS_1_TO_7: Record<number, string> = {
  1: "corporation",
  2: "manufacturing",
  3: "21-50",
  4: "在庫管理の効率化と受発注のデジタル化を進めたいです。",
  5: "internal",
  6: "web_app",
  7: "new",
};

const ANSWERS_1_TO_11: Record<number, string | string[]> = {
  ...ANSWERS_1_TO_7,
  8: ["user_auth", "dashboard"],
  9: "3months",
  10: "both",
  11: "1m_3m",
};

const ANSWERS_ALL: Record<number, string | string[]> = {
  ...ANSWERS_1_TO_11,
  12: "",
  13: JSON.stringify({
    name: "テスト太郎",
    company: "テスト株式会社",
    email: "test@example.com",
  }),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
test.describe("Chat flow (/chat)", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("loads chat page and shows first question", async ({ page }) => {
    await page.goto("/chat");

    // First question about business type
    await expect(
      page.getByText("事業形態を教えてください", { exact: false })
    ).toBeVisible();

    // Business type options should be visible
    await expect(
      page.getByRole("radio", { name: "法人（株式会社・合同会社等）" })
    ).toBeVisible();
    await expect(
      page.getByRole("radio", { name: "個人事業主" })
    ).toBeVisible();
    await expect(
      page.getByRole("radio", { name: "その他" })
    ).toBeVisible();
  });

  test("clicking a select option marks it as selected", async ({ page }) => {
    await page.goto("/chat");

    const option = page.getByRole("radio", {
      name: "法人（株式会社・合同会社等）",
    });
    await expect(option).toHaveAttribute("aria-checked", "false");

    await option.click();

    await expect(option).toHaveAttribute("aria-checked", "true");
  });

  test("select auto-advance navigates to next step", async ({ page }) => {
    await page.goto("/chat");

    // Click first option - should auto-advance to step 2
    await page
      .getByRole("radio", { name: "法人（株式会社・合同会社等）" })
      .click();

    // Wait for auto-advance (250ms delay + API call + animation)
    await expect(
      page.getByText("業種を教えてください", { exact: false })
    ).toBeVisible({ timeout: 10000 });
  });

  test("step 4 text input renders with validation", async ({ page }) => {
    // Seed session at step 4
    await page.goto("/chat");
    await seedLocalStorage(page, "session", buildSession(4, ANSWERS_1_TO_7));
    await page.goto("/chat");

    // Step 4 question about challenges
    await expect(
      page.getByText("課題や、システムで解決したいこと", { exact: false })
    ).toBeVisible();

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();

    // Type less than 10 chars - "次へ" should be disabled
    await textarea.fill("短い文");
    const nextButton = page.getByRole("button", { name: "次へ" });
    await expect(nextButton).toBeDisabled();

    // Fill valid text (10+ chars) - "次へ" should become enabled
    await textarea.fill("在庫管理を効率化して人手不足を解消したいです");
    await expect(nextButton).toBeEnabled();
  });

  test("step 8 multi-select renders AI features and allows toggling", async ({
    page,
  }) => {
    // Seed session at step 8 with AI features
    await page.goto("/chat");
    await seedLocalStorage(
      page,
      "session",
      buildSession(8, ANSWERS_1_TO_7, {
        aiOptions: { step8Features: MOCK_AI_FEATURES },
      })
    );
    await page.goto("/chat");

    // Step 8 question
    await expect(
      page.getByText("機能候補から", { exact: false })
    ).toBeVisible();

    // Multi-select indicator
    await expect(page.getByText("複数選択できます")).toBeVisible();

    // AI-generated options should be visible
    const auth = page.getByRole("checkbox", {
      name: "ユーザー認証・ログイン機能",
    });
    const dashboard = page.getByRole("checkbox", { name: "ダッシュボード" });

    await expect(auth).toBeVisible();
    await expect(dashboard).toBeVisible();

    // Select two features
    await auth.click();
    await dashboard.click();

    await expect(auth).toHaveAttribute("aria-checked", "true");
    await expect(dashboard).toHaveAttribute("aria-checked", "true");

    // Uncheck one
    await auth.click();
    await expect(auth).toHaveAttribute("aria-checked", "false");
    await expect(dashboard).toHaveAttribute("aria-checked", "true");
  });

  test("step 12 optional text can be skipped", async ({ page }) => {
    // Seed session at step 12
    await page.goto("/chat");
    await seedLocalStorage(
      page,
      "session",
      buildSession(12, ANSWERS_1_TO_11, {
        aiOptions: { step8Features: MOCK_AI_FEATURES },
      })
    );
    await page.goto("/chat");

    // Step 12 is optional
    await expect(
      page.getByText("その他ご要望", { exact: false })
    ).toBeVisible();

    // "次へ" should be enabled (optional step)
    const nextButton = page.getByRole("button", { name: "次へ" });
    await expect(nextButton).toBeEnabled();
  });

  test("step 13 contact form validates inputs", async ({ page }) => {
    // Seed session at step 13
    await page.goto("/chat");
    await seedLocalStorage(
      page,
      "session",
      buildSession(13, { ...ANSWERS_1_TO_11, 12: "" }, {
        aiOptions: { step8Features: MOCK_AI_FEATURES },
      })
    );
    await page.goto("/chat");

    // Step 13 question
    await expect(
      page.getByText("情報を入力してください", { exact: false })
    ).toBeVisible();

    // Contact form fields visible
    const nameInput = page.locator("#contact-name");
    const companyInput = page.locator("#contact-company");
    const emailInput = page.locator("#contact-email");

    await expect(nameInput).toBeVisible();
    await expect(companyInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Trust signals visible
    await expect(page.getByText("SSL暗号化通信")).toBeVisible();

    // Submit button should be disabled initially (no input)
    const submitButton = page.getByRole("button", { name: "送信する" });
    await expect(submitButton).toBeDisabled();

    // Fill only name - still disabled (email required)
    await nameInput.fill("テスト太郎");
    await expect(submitButton).toBeDisabled();

    // Fill valid email - should become enabled
    await emailInput.fill("test@example.com");
    await expect(submitButton).toBeEnabled();
  });

  test("step 13 submit navigates to /complete", async ({ page }) => {
    // Seed session at step 13 with all answers
    await page.goto("/chat");
    await seedLocalStorage(
      page,
      "session",
      buildSession(13, { ...ANSWERS_1_TO_11, 12: "" }, {
        aiOptions: { step8Features: MOCK_AI_FEATURES },
      })
    );
    await page.goto("/chat");

    // Fill contact form
    await page.locator("#contact-name").fill("テスト太郎");
    await page.locator("#contact-company").fill("テスト株式会社");
    await page.locator("#contact-email").fill("test@example.com");

    // Click submit
    await page.getByRole("button", { name: "送信する" }).click();

    // Should navigate to /complete
    await expect(page).toHaveURL(/\/complete/, { timeout: 15000 });
  });

  test("back button returns to previous step", async ({ page }) => {
    // Seed session at step 3
    await page.goto("/chat");
    await seedLocalStorage(
      page,
      "session",
      buildSession(3, { 1: "corporation", 2: "manufacturing" })
    );
    await page.goto("/chat");

    // Verify step 3
    await expect(
      page.getByText("従業員規模", { exact: false })
    ).toBeVisible();

    // Click back
    await page.getByRole("button", { name: "前のステップに戻る" }).click();

    // Should be at step 2
    await expect(
      page.getByText("業種を教えてください", { exact: false })
    ).toBeVisible();
  });

  test("progress bar is visible", async ({ page }) => {
    await page.goto("/chat");

    // Progress bar container should exist
    await expect(page.getByText("欲しいシステムの見積が3分で！")).toBeVisible();
  });

  test("exit button returns to landing page", async ({ page }) => {
    await page.goto("/chat");

    // Click the exit button
    await page.getByRole("button", { name: /終了する/ }).click();

    await expect(page).toHaveURL("/");
  });
});
