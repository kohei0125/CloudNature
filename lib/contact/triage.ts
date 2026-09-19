// お問い合わせの営業仕分け
// 設計: docs/20260920_contact_sales_triage_review.md
//
// 層1: Notionで過去に「営業」と判定済みのリードと、メール/ドメイン/電話番号が一致するか
// 層2: Vercel AI Gateway の評価モデル(typesafe-ai/jev)で本文を読んで分類
//
// どちらも失敗したときは「未対応」へ倒す(フェイルオープン)。見込み客を営業と誤判定して
// 埋もれさせるほうが、営業を未対応のまま残すより損失が大きいため。

import {
  TRIAGE_CHOICES,
  TRIAGE_QUESTION,
  TRIAGE_QUESTION_KEY,
  type TriageChoice,
} from "@/lib/contact/prompts/triage";

// Vercel AI Gateway の評価モダリティ。チャット補完とは別エンドポイント
// https://vercel.com/docs/ai-gateway/modalities/evaluation
const AI_GATEWAY_EVALUATE_URL = "https://ai-gateway.vercel.sh/v1/evaluate";
// TypeSafe AI の評価専用モデル。分類・ルーティング向けで、入力のみ課金（100万トークンあたり$0.042）
const DEFAULT_MODEL = "typesafe-ai/jev";
const REQUEST_TIMEOUT_MS = 8000;
/** 層1(Notion読み出し)全体の待ち時間の上限。フォームの応答を長く待たせないため */
const FINGERPRINT_BUDGET_MS = 3000;
/** この確信度を下回る判定は人間に回す(「未対応」のまま残す) */
export const CONFIDENCE_THRESHOLD = 0.8;
/** 評価モデルへ渡す本文の上限。営業メールは長文が多いため切り詰める */
const MAX_MESSAGE_CHARS = 4000;
/** 電話番号の一致判定に使う最小桁数。PHONE_REGEX は1桁でも通るため別途下限を設ける */
const MIN_PHONE_DIGITS = 9;

export type TriageVerdict = TriageChoice;
/** Notion「リード管理」DBのステータスのうち、自動仕分けが設定しうる値 */
export type TriageStatus = "営業" | "その他" | "未対応";
export type TriageSource = "rule" | "evaluation" | "fallback";

export interface TriageInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
}

/** 過去に「営業」と判定されたリードから作る指紋。すべて正規化済み */
export interface SalesFingerprints {
  emails: ReadonlySet<string>;
  domains: ReadonlySet<string>;
  phones: ReadonlySet<string>;
}

export interface TriageResult {
  status: TriageStatus;
  verdict: TriageVerdict | null;
  confidence: number;
  reasons: string[];
  source: TriageSource;
}

// 過去の営業リードのドメインをそのまま照合すると、gmail.com の営業が1件あるだけで
// 全 gmail ユーザーが営業扱いになる。フリーメールはドメインを指紋に含めず、
// アドレス完全一致のみで判定する
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.co.jp",
  "yahoo.com",
  "ybb.ne.jp",
  "outlook.com",
  "outlook.jp",
  "hotmail.com",
  "hotmail.co.jp",
  "live.jp",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "docomo.ne.jp",
  "ezweb.ne.jp",
  "au.com",
  "softbank.ne.jp",
  "i.softbank.jp",
  "vodafone.ne.jp",
  "ocn.ne.jp",
  "nifty.com",
  "biglobe.ne.jp",
  "so-net.ne.jp",
  "plala.or.jp",
  "dion.ne.jp",
  "excite.co.jp",
  "goo.ne.jp",
  "infoseek.jp",
  "jcom.home.ne.jp",
] as const;

export function normalizeEmail(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(at + 1);
}

/** プロバイダのサブドメイン(dolphin.ocn.ne.jp 等)もフリーメール扱いにする */
export function isFreeEmailDomain(domain: string): boolean {
  if (!domain) return false;
  return FREE_EMAIL_DOMAINS.some((free) => domain === free || domain.endsWith(`.${free}`));
}

/**
 * 電話番号を数字のみに揃える。`03-6689-0477` と `0366890477` を同一視するため。
 * `+81` / `0081` の国番号表記は国内表記(先頭0)へ寄せる。
 */
export function normalizePhone(raw: string | null | undefined): string {
  const trimmed = (raw ?? "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  // `+81 (0)90-...` のように国番号と国内の先頭0が併記される書き方があるため、
  // 国番号を外したあとに残った先頭0も落としてから国内表記へ揃える
  if (/^(\+81|0081)/.test(trimmed)) {
    const national = digits.replace(/^(0081|81)/, "").replace(/^0+/, "");
    return national ? `0${national}` : "";
  }
  return digits;
}

export function buildSalesFingerprints(
  rows: ReadonlyArray<{ email?: string | null; phone?: string | null }>
): SalesFingerprints {
  const emails = new Set<string>();
  const domains = new Set<string>();
  const phones = new Set<string>();

  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (email) {
      emails.add(email);
      const domain = emailDomain(email);
      if (domain && !isFreeEmailDomain(domain)) {
        domains.add(domain);
      }
    }

    const phone = normalizePhone(row.phone);
    if (phone.length >= MIN_PHONE_DIGITS) {
      phones.add(phone);
    }
  }

  return { emails, domains, phones };
}

/** 一致した指紋の説明を返す。一致しなければ空配列 */
export function matchSalesFingerprints(
  input: TriageInput,
  fingerprints: SalesFingerprints
): string[] {
  const reasons: string[] = [];

  const email = normalizeEmail(input.email);
  if (email && fingerprints.emails.has(email)) {
    reasons.push(`過去に営業と判定した同じメールアドレス（${email}）です`);
  }

  const domain = emailDomain(email);
  if (domain && fingerprints.domains.has(domain)) {
    reasons.push(`過去に営業と判定した同じドメイン（${domain}）からの送信です`);
  }

  const phone = normalizePhone(input.phone);
  if (phone.length >= MIN_PHONE_DIGITS && fingerprints.phones.has(phone)) {
    reasons.push(`過去に営業と判定した同じ電話番号（${phone}）です`);
  }

  return reasons;
}

/**
 * 判定結果のうち、通知メールとNotionの両方で使う表示用の値。
 * 「判定不能」の文言や確信度の丸め方が2か所でずれないよう、ここにまとめる。
 * 文面そのものは読み手（担当者のGmail / Notionの記録）で異なるため各所に置く。
 */
export function describeTriage(triage: TriageResult): {
  verdictLabel: string;
  confidencePercent: number;
  reasonBullets: string[];
} {
  return {
    verdictLabel: triage.verdict ?? "判定不能",
    confidencePercent: Math.round(triage.confidence * 100),
    reasonBullets: triage.reasons.map((reason) => `・${reason}`),
  };
}

export function toNotionStatus(verdict: TriageVerdict, confidence: number): TriageStatus {
  if (confidence < CONFIDENCE_THRESHOLD) return "未対応";
  if (verdict === "営業") return "営業";
  if (verdict === "その他") return "その他";
  return "未対応";
}

interface EvaluationVerdict {
  verdict: TriageVerdict;
  confidence: number;
  reasons: string[];
}

function isTriageChoice(value: unknown): value is TriageVerdict {
  return typeof value === "string" && (TRIAGE_CHOICES as readonly string[]).includes(value);
}

/** 内訳を1行にまとめる。評価モデルは理由の文章を返さないため、これを根拠として残す */
function formatProbabilities(probabilities: Record<string, unknown>): string[] {
  const entries = Object.entries(probabilities)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => `${label} ${Math.round(value * 100)}%`);

  return entries.length > 0 ? [`判定の内訳: ${entries.join(" / ")}`] : [];
}

/** /v1/evaluate のレスポンスを検証する。想定外の形なら null(=判定不能) */
export function parseEvaluation(data: unknown): EvaluationVerdict | null {
  if (typeof data !== "object" || data === null) return null;

  const answers = (data as Record<string, unknown>).answers;
  if (typeof answers !== "object" || answers === null) return null;

  const answer = (answers as Record<string, unknown>)[TRIAGE_QUESTION_KEY];
  if (typeof answer !== "object" || answer === null) return null;

  const { choice, confidence, probabilities } = answer as Record<string, unknown>;
  if (!isTriageChoice(choice)) return null;

  const probabilityMap =
    typeof probabilities === "object" && probabilities !== null
      ? (probabilities as Record<string, unknown>)
      : {};

  // confidence は choice の確率より校正されているためそちらを優先し、
  // 欠けていた場合は選ばれた選択肢の確率で代用する
  const rawConfidence =
    typeof confidence === "number" && Number.isFinite(confidence)
      ? confidence
      : typeof probabilityMap[choice] === "number"
        ? (probabilityMap[choice] as number)
        : 0;

  return {
    verdict: choice,
    confidence: Math.min(1, Math.max(0, rawConfidence)),
    reasons: formatProbabilities(probabilityMap),
  };
}

async function classifyWithEvaluation(input: TriageInput): Promise<EvaluationVerdict | null> {
  // Vercelのデプロイ環境では VERCEL_OIDC_TOKEN が自動で入るため、通常は
  // AI_GATEWAY_API_KEY の設定は不要。明示的なキーがあればそちらを優先する
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!apiKey) return null;

  const model = process.env.AI_GATEWAY_TRIAGE_MODEL || DEFAULT_MODEL;

  try {
    const res = await fetch(AI_GATEWAY_EVALUATE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model,
        state: {
          名前: input.name,
          会社名: input.company || "",
          メールアドレス: input.email,
          電話番号: input.phone,
          お問い合わせ種別: input.subject,
          本文: input.message.slice(0, MAX_MESSAGE_CHARS),
        },
        questions: { [TRIAGE_QUESTION_KEY]: TRIAGE_QUESTION },
        // 問い合わせ者の個人情報を送るため、データを保持しない経路に限定する。
        // 条件を満たすプロバイダーがなければリクエストは失敗し、「未対応」へ倒れる
        providerOptions: { gateway: { zeroDataRetention: true } },
      }),
    });

    if (!res.ok) {
      console.error(`[triage] AI Gateway returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }

    return parseEvaluation(await res.json());
  } catch (err) {
    console.error("[triage] classification failed:", err);
    return null;
  }
}

export interface TriageDeps {
  /** 過去に「営業」と判定されたリードの指紋。取得できないときは null */
  fetchSalesFingerprints: () => Promise<SalesFingerprints | null>;
}

/**
 * Notionが落ちていても層2へ進めるよう、取得失敗は null に潰す。
 * この読み出しはフォーム送信のレスポンスを待たせるため、全体の待ち時間にも上限を設ける
 * （Notion SDK 側のタイムアウトは1リクエストごとの上限でしかないため）。
 */
async function loadFingerprints(deps: TriageDeps): Promise<SalesFingerprints | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      deps.fetchSalesFingerprints(),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => {
          console.error("[triage] loading past verdicts timed out");
          resolve(null);
        }, FINGERPRINT_BUDGET_MS);
      }),
    ]);
  } catch (err) {
    console.error("[triage] failed to load past verdicts:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function triageContact(
  input: TriageInput,
  deps: TriageDeps
): Promise<TriageResult> {
  // 層1: 人が「営業」と確認済みのリードと照合する。ここで決まれば層2は呼ばない。
  // 並列化すれば0.3〜0.5秒ほど速くなるが、既知の営業にまで問い合わせ者の個人情報を
  // 外部へ送ることになるため、応答時間より送信量を抑えるほうを選んだ
  const fingerprints = await loadFingerprints(deps);
  if (fingerprints) {
    const reasons = matchSalesFingerprints(input, fingerprints);
    if (reasons.length > 0) {
      return { status: "営業", verdict: "営業", confidence: 1, reasons, source: "rule" };
    }
  }

  // 層2: 本文を評価モデルで分類する
  const evaluation = await classifyWithEvaluation(input);
  if (!evaluation) {
    return {
      status: "未対応",
      verdict: null,
      confidence: 0,
      reasons: ["自動仕分けを実行できませんでした（手動で確認してください）"],
      source: "fallback",
    };
  }

  return {
    status: toNotionStatus(evaluation.verdict, evaluation.confidence),
    verdict: evaluation.verdict,
    confidence: evaluation.confidence,
    reasons: evaluation.reasons,
    source: "evaluation",
  };
}
