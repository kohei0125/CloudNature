import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildSalesFingerprints,
  describeTriage,
  emailDomain,
  isFreeEmailDomain,
  matchSalesFingerprints,
  normalizePhone,
  parseEvaluation,
  resolveGatewayToken,
  toNotionStatus,
  triageContact,
  type TriageInput,
} from "@/lib/contact/triage";

const baseInput: TriageInput = {
  name: "渡邉浩平",
  email: "info@example.co.jp",
  phone: "025-000-0000",
  company: "株式会社サンプル",
  subject: "AI導入・業務自動化の相談",
  message: "業務自動化について相談したいです。",
};

describe("normalizePhone", () => {
  it("表記ゆれを同一視する", () => {
    expect(normalizePhone("03-6689-0477")).toBe("0366890477");
    expect(normalizePhone("0366890477")).toBe("0366890477");
    expect(normalizePhone(" 03 (6689) 0477 ")).toBe("0366890477");
  });

  it("国番号表記を国内表記へ寄せる", () => {
    expect(normalizePhone("+81 3-6689-0477")).toBe("0366890477");
    expect(normalizePhone("008136689 0477")).toBe("0366890477");
  });

  it("国番号と国内の先頭0が併記されていても同じ値になる", () => {
    expect(normalizePhone("+81 (0)90-1234-5678")).toBe("09012345678");
    expect(normalizePhone("090-1234-5678")).toBe("09012345678");
    expect(normalizePhone("+81")).toBe("");
  });

  it("空文字・数字なしは空文字", () => {
    expect(normalizePhone("")).toBe("");
    expect(normalizePhone("---")).toBe("");
    expect(normalizePhone(undefined)).toBe("");
  });
});

describe("isFreeEmailDomain", () => {
  it("フリーメールとそのサブドメインを判定する", () => {
    expect(isFreeEmailDomain("gmail.com")).toBe(true);
    expect(isFreeEmailDomain("dolphin.ocn.ne.jp")).toBe(true);
    expect(isFreeEmailDomain("cloudnature.jp")).toBe(false);
    expect(isFreeEmailDomain("")).toBe(false);
  });

  it("フリーメールに似た別ドメインを巻き込まない", () => {
    expect(isFreeEmailDomain("notgmail.com")).toBe(false);
  });
});

describe("emailDomain", () => {
  it("最後の@以降を返す", () => {
    expect(emailDomain("a@b@cloudnature.jp")).toBe("cloudnature.jp");
    expect(emailDomain("invalid")).toBe("");
  });
});

describe("buildSalesFingerprints", () => {
  it("フリーメールはドメインを指紋に含めない", () => {
    const fp = buildSalesFingerprints([
      { email: "spam@gmail.com", phone: "090-1111-2222" },
      { email: "sales@spam-corp.co.jp", phone: "03-6689-0477" },
    ]);

    expect(fp.emails.has("spam@gmail.com")).toBe(true);
    expect(fp.domains.has("gmail.com")).toBe(false);
    expect(fp.domains.has("spam-corp.co.jp")).toBe(true);
    expect(fp.phones.has("09011112222")).toBe(true);
  });

  it("桁数の足りない電話番号は指紋にしない", () => {
    const fp = buildSalesFingerprints([{ email: "", phone: "1" }]);
    expect(fp.phones.size).toBe(0);
  });

  it("大文字のメールアドレスを正規化する", () => {
    const fp = buildSalesFingerprints([{ email: " Sales@Spam-Corp.CO.JP " }]);
    expect(fp.emails.has("sales@spam-corp.co.jp")).toBe(true);
  });
});

describe("matchSalesFingerprints", () => {
  const fp = buildSalesFingerprints([
    { email: "sales@spam-corp.co.jp", phone: "050-5212-6504" },
    { email: "spam@gmail.com", phone: "" },
  ]);

  it("同じドメインからの再送を検出する", () => {
    const reasons = matchSalesFingerprints(
      { ...baseInput, email: "another@spam-corp.co.jp" },
      fp
    );
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("spam-corp.co.jp");
  });

  it("会社名を変えても電話番号の使い回しを検出する", () => {
    const reasons = matchSalesFingerprints(
      { ...baseInput, email: "new@other-corp.jp", phone: "05052126504" },
      fp
    );
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("05052126504");
  });

  it("フリーメールの他ユーザーを巻き込まない", () => {
    expect(matchSalesFingerprints({ ...baseInput, email: "customer@gmail.com" }, fp)).toEqual([]);
  });

  it("同じフリーメールアドレスそのものは検出する", () => {
    const reasons = matchSalesFingerprints({ ...baseInput, email: "SPAM@gmail.com" }, fp);
    expect(reasons).toHaveLength(1);
  });

  it("無関係な送信元は一致しない", () => {
    expect(matchSalesFingerprints(baseInput, fp)).toEqual([]);
  });
});

describe("toNotionStatus", () => {
  it("確信度が閾値以上なら判定どおりのステータスにする", () => {
    expect(toNotionStatus("営業", 0.9)).toBe("営業");
    expect(toNotionStatus("その他", 0.8)).toBe("その他");
  });

  it("確信度が低いときは人間に回す", () => {
    expect(toNotionStatus("営業", 0.79)).toBe("未対応");
    expect(toNotionStatus("その他", 0.5)).toBe("未対応");
  });

  it("見込み客は常に未対応", () => {
    expect(toNotionStatus("見込み客", 1)).toBe("未対応");
  });
});

describe("resolveGatewayToken", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("APIキーを最優先し、次にヘッダ、最後に環境変数を使う", () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "key");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "env");
    expect(resolveGatewayToken("header")).toBe("key");

    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    expect(resolveGatewayToken("header")).toBe("header");
    expect(resolveGatewayToken(null)).toBe("env");

    vi.stubEnv("VERCEL_OIDC_TOKEN", "");
    expect(resolveGatewayToken(null)).toBeNull();
  });
});

describe("describeTriage", () => {
  it("判定なしは「判定不能」と表示し、確信度を%へ丸める", () => {
    expect(
      describeTriage({ status: "未対応", verdict: null, confidence: 0, reasons: ["理由"], source: "fallback" })
    ).toEqual({ verdictLabel: "判定不能", confidencePercent: 0, reasonBullets: ["・理由"] });

    expect(
      describeTriage({ status: "営業", verdict: "営業", confidence: 0.876, reasons: [], source: "evaluation" })
    ).toEqual({ verdictLabel: "営業", confidencePercent: 88, reasonBullets: [] });
  });
});

describe("parseEvaluation", () => {
  const ok = (answer: Record<string, unknown>) => ({
    answers: { category: { type: "choice", ...answer } },
  });

  it("choice と confidence を読み、内訳を根拠に残す", () => {
    expect(
      parseEvaluation(
        ok({ choice: "営業", confidence: 0.96, probabilities: { 営業: 0.97, その他: 0.02, 見込み客: 0.01 } })
      )
    ).toEqual({
      verdict: "営業",
      confidence: 0.96,
      reasons: ["判定の内訳: 営業 97% / その他 2% / 見込み客 1%"],
    });
  });

  it("confidence が無ければ選ばれた選択肢の確率で代用する", () => {
    expect(parseEvaluation(ok({ choice: "その他", probabilities: { その他: 0.91, 営業: 0.09 } }))?.confidence).toBe(
      0.91
    );
  });

  it("確信度を0〜1に丸める", () => {
    expect(parseEvaluation(ok({ choice: "営業", confidence: 5 }))?.confidence).toBe(1);
    expect(parseEvaluation(ok({ choice: "営業", confidence: -1 }))?.confidence).toBe(0);
    expect(parseEvaluation(ok({ choice: "営業" }))?.confidence).toBe(0);
  });

  it("想定外の形はnull", () => {
    expect(parseEvaluation(null)).toBeNull();
    expect(parseEvaluation({})).toBeNull();
    expect(parseEvaluation({ answers: {} })).toBeNull();
    expect(parseEvaluation(ok({ choice: "不明" }))).toBeNull();
    expect(parseEvaluation({ answers: { other: { choice: "営業" } } })).toBeNull();
  });
});

/** /v1/evaluate のレスポンス形をそのまま返す fetch のモック */
function evaluationResponding(answer: Record<string, unknown>) {
  return vi.fn(async (_url: string, _init: { headers: Record<string, string> }) => ({
    ok: true,
    json: async () => ({ model: "typesafe-ai/jev", answers: { category: { type: "choice", ...answer } } }),
  }));
}

describe("triageContact", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("過去の判定と一致したら評価モデルを呼ばずに営業と判定する", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await triageContact(
      { ...baseInput, email: "another@spam-corp.co.jp" },
      {
        fetchSalesFingerprints: async () =>
          buildSalesFingerprints([{ email: "sales@spam-corp.co.jp", phone: "" }]),
      }
    );

    expect(result.status).toBe("営業");
    expect(result.source).toBe("rule");
    expect(result.confidence).toBe(1);
    expect(result.reasons[0]).toContain("spam-corp.co.jp");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("層1の取得が遅いときは待ち続けずに層2へ進む", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      evaluationResponding({ choice: "営業", confidence: 0.95, probabilities: { 営業: 0.95 } })
    );
    vi.useFakeTimers();

    const promise = triageContact(baseInput, {
      fetchSalesFingerprints: () => new Promise(() => {}),
    });
    await vi.advanceTimersByTimeAsync(3000);
    const result = await promise;

    vi.useRealTimers();
    expect(result.status).toBe("営業");
    expect(result.source).toBe("evaluation");
  });

  it("認証情報が未設定なら未対応で返し、理由をそれと分かる形で残す", async () => {
    // どちらかが環境に残っていると実際にAI Gatewayへリクエストが飛ぶため両方潰す
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await triageContact(baseInput, { fetchSalesFingerprints: async () => null });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.status).toBe("未対応");
    expect(result.source).toBe("fallback");
    expect(result.verdict).toBeNull();
    expect(result.reasons[0]).toContain("認証情報");
  });

  it("環境変数が無くてもリクエストヘッダのOIDCトークンで判定できる", async () => {
    // 本番のVercel Functionでは環境変数にトークンが入らず、ヘッダ経由で渡る
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");
    const fetchSpy = evaluationResponding({
      choice: "営業",
      confidence: 0.96,
      probabilities: { 営業: 0.97 },
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await triageContact(baseInput, {
      fetchSalesFingerprints: async () => null,
      oidcToken: "header-token",
    });

    expect(result.status).toBe("営業");
    expect(result.source).toBe("evaluation");
    expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBe("Bearer header-token");
  });

  it("呼び出しに失敗した場合は認証情報の欠如と区別できる理由を残す", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 401, text: async () => "unauthorized" }))
    );

    const result = await triageContact(baseInput, { fetchSalesFingerprints: async () => null });

    expect(result.status).toBe("未対応");
    expect(result.reasons[0]).toContain("呼び出しに失敗");
  });

  it("過去判定の取得に失敗してもLLM判定へ進む", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      evaluationResponding({ choice: "営業", confidence: 0.9, probabilities: { 営業: 0.9, その他: 0.1 } })
    );

    const result = await triageContact(baseInput, {
      fetchSalesFingerprints: async () => {
        throw new Error("notion down");
      },
    });

    expect(result.status).toBe("営業");
    expect(result.source).toBe("evaluation");
  });

  it("LLMが失敗したら未対応で返す", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("timeout");
      })
    );

    const result = await triageContact(baseInput, { fetchSalesFingerprints: async () => null });

    expect(result.status).toBe("未対応");
    expect(result.source).toBe("fallback");
  });

  it("LLMが見込み客と判定したら未対応のまま残す", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      evaluationResponding({ choice: "見込み客", confidence: 0.95, probabilities: { 見込み客: 0.95 } })
    );

    const result = await triageContact(baseInput, { fetchSalesFingerprints: async () => null });

    expect(result.status).toBe("未対応");
    expect(result.verdict).toBe("見込み客");
    expect(result.source).toBe("evaluation");
  });
});
