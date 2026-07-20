"use client";

import { useState, type FormEvent } from "react";
import { MAIN_SITE_URL } from "@/lib/metadata";
import { MAX_SHORT_FIELD_LENGTH, MAX_EMAIL_LENGTH, MAX_TOPIC_LENGTH } from "@/lib/validation";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type Status = "idle" | "pending" | "success" | "error";

const GENERIC_ERROR_MESSAGE = "送信に失敗しました。しばらく経ってから再度お試しください。";

/** 流入計測用。フォーム送信時にのみ参照するため、mount時にstate化する必要はない */
function readUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      page_referrer: document.referrer ?? "",
    };
  } catch {
    // URLSearchParams非対応環境では計測をスキップ
    return { utm_source: "", utm_medium: "", utm_campaign: "", page_referrer: "" };
  }
}

export default function ConsultationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // ハニーポット: 通常の利用者には見えないフィールド（bot対策）
    if (formData.get("website")) {
      setStatus("success");
      return;
    }

    setStatus("pending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          role: formData.get("role"),
          topic: formData.get("topic"),
          website: formData.get("website"),
          ...readUtmParams(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          res.status === 429
            ? "送信回数の上限に達しました。しばらく経ってから再度お試しください。"
            : data.error || GENERIC_ERROR_MESSAGE
        );
        return;
      }

      setStatus("success");
      form.reset();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead" });
    } catch {
      setStatus("error");
      setErrorMessage(GENERIC_ERROR_MESSAGE);
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite">
        <p className="form__note">
          お申し込みありがとうございます。担当より日程調整のご連絡を差し上げます。
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="form__note">
        オンライン30分・相談無料。入力約1分。送信後、担当より日程調整のご連絡を差し上げます。
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__row">
          <label className="form__label" htmlFor="f-name">
            お名前
          </label>
          <input
            className="form__input"
            type="text"
            id="f-name"
            name="name"
            autoComplete="name"
            placeholder="例）山田 太郎"
            maxLength={MAX_SHORT_FIELD_LENGTH}
            required
          />
        </div>
        <div className="form__row">
          <label className="form__label" htmlFor="f-company">
            会社名
          </label>
          <input
            className="form__input"
            type="text"
            id="f-company"
            name="company"
            autoComplete="organization"
            placeholder="例）株式会社サンプル"
            maxLength={MAX_SHORT_FIELD_LENGTH}
            required
          />
        </div>
        <div className="form__row">
          <label className="form__label" htmlFor="f-email">
            メールアドレス
          </label>
          <input
            className="form__input"
            type="email"
            id="f-email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="例）taro.yamada@example.com"
            maxLength={MAX_EMAIL_LENGTH}
            required
          />
        </div>
        <div className="form__row">
          <label className="form__label" htmlFor="f-role">
            役職
          </label>
          <input
            className="form__input"
            type="text"
            id="f-role"
            name="role"
            autoComplete="organization-title"
            placeholder="例）開発部長 / CTO"
            maxLength={MAX_SHORT_FIELD_LENGTH}
            required
          />
        </div>
        <div className="form__row">
          <label className="form__label" htmlFor="f-topic">
            ご相談したいこと（任意）
          </label>
          <textarea
            className="form__input form__textarea"
            id="f-topic"
            name="topic"
            rows={3}
            placeholder="例）レビュー工程でのAI活用と品質基準の作り方を相談したい"
            maxLength={MAX_TOPIC_LENGTH}
          />
        </div>
        {/* スパム対策のhoneypot: 通常の利用者には見えない。botが入力すると送信側で破棄する */}
        <div className="form__hp" aria-hidden="true">
          <label htmlFor="f-website">この項目は入力しないでください</label>
          <input type="text" id="f-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {status === "error" && (
          <p role="alert" aria-live="assertive" style={{ color: "#c0392b", fontSize: "0.85rem", margin: 0 }}>
            {errorMessage}
          </p>
        )}

        <button
          className="btn btn--primary btn--large btn--block"
          type="submit"
          disabled={status === "pending"}
        >
          {status === "pending" ? "送信中…" : "30分無料相談を申し込む"}
          {status !== "pending" && <span aria-hidden="true">›</span>}
        </button>
        <p className="form__consent">
          ご入力いただいた個人情報は、当社の
          <a href={`${MAIN_SITE_URL}/privacy`} target="_blank" rel="noopener">
            プライバシーポリシー
          </a>
          に基づき適切に管理します。
        </p>
      </form>
    </>
  );
}
