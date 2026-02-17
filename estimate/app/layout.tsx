import type { Metadata, Viewport } from "next";
import EstimateHeader from "@/components/shared/EstimateHeader";
import "./globals.css";

export const viewport: Viewport = {
  viewportFit: "cover",
};

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const metadata: Metadata = {
  title: "次世代AIシステム見積もり・要件定義プラットフォーム | CloudNature",
  description:
    "ハイブリッドAIエージェントが最適なアーキテクチャを逆算し、精緻なWBSと確率論的見積もりを最短1分で自動生成。そのまま稟議書として活用できます。",
  icons: {
    icon: "/favicon.png",
  },
  ...(!isProduction && {
    robots: { index: false, follow: false },
  }),
};

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="min-h-screen font-sans selection:bg-blue-200">
          <EstimateHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
