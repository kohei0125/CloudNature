import type { Metadata } from "next";
import { REALTIME_TRANSLATE_META } from "@/content/realtime-translate";
import RealtimeTranslateApp from "@/components/realtime-translate/RealtimeTranslateApp";

// 社内向けリアルタイム翻訳ツール（非公開運用: noindex / sitemap 除外）
// 設計: docs/20260607_openai_translate.md

export const metadata: Metadata = {
  title: REALTIME_TRANSLATE_META.title,
  description: REALTIME_TRANSLATE_META.description,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RealtimeTranslatePage() {
  return <RealtimeTranslateApp />;
}
