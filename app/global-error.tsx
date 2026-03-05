"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", fontFamily: "sans-serif" }}>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", color: "#E07A5F", marginBottom: "1rem" }}>
              ERROR
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#2D6A4F" }}>
              問題が発生しました
            </h1>
            <p style={{ color: "#666", maxWidth: "32rem", margin: "0 auto" }}>
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#7C9A82",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              もう一度試す
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
