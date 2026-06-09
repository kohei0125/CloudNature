"use client";

import { useEffect, useState } from "react";
import { GATE_COPY } from "@/content/realtime-translate";
import PasswordGate from "./PasswordGate";
import TranslatorPanel from "./TranslatorPanel";

// リアルタイム翻訳ツール全体: ゲート画面 → 翻訳画面の切替
// 設計: docs/20260607_openai_translate.md

const STORAGE_KEY = "realtime-translate-password";

// 【一時設定】パスワードゲートをスキップして即開始する。
// false に戻すとパスワード入力を再び必須にできる。
// サーバー側（API Route）はトークン発行時に固定パスワードを毎回照合するため、
// スキップ時はその固定パスワードをクライアントから自動で渡す。
const BYPASS_GATE = true;
const BYPASS_PASSWORD = "クラウドネイチャー";

const RealtimeTranslateApp = () => {
  const [password, setPassword] = useState<string | null>(
    BYPASS_GATE ? BYPASS_PASSWORD : null
  );
  const [gateNotice, setGateNotice] = useState<string | null>(null);

  // 同一タブ内の再読み込みでは再入力を不要にする
  // （パスワード自体はトークン発行のたびにサーバー側で再照合される）
  useEffect(() => {
    if (BYPASS_GATE) return;
    const restorePassword = () => {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPassword(saved);
      }
    };
    restorePassword();
  }, []);

  const handleUnlock = (value: string) => {
    sessionStorage.setItem(STORAGE_KEY, value);
    setGateNotice(null);
    setPassword(value);
  };

  // 戻る: 保持中のパスワードを破棄し、ゲート画面で再入力を求める
  // （ゲートスキップ中は固定パスワードを保持したままにする）
  const handleBack = () => {
    if (BYPASS_GATE) return;
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword(null);
  };

  // 保存済みパスワードの失効（401）: 理由を表示してゲート画面へ戻す
  const handleAuthError = () => {
    setGateNotice(GATE_COPY.reauthNotice);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-cream pt-14 md:pt-[56px]">
      {password === null ? (
        <PasswordGate onUnlock={handleUnlock} notice={gateNotice} />
      ) : (
        <TranslatorPanel
          password={password}
          onBack={handleBack}
          onAuthError={handleAuthError}
        />
      )}
    </div>
  );
};

export default RealtimeTranslateApp;
