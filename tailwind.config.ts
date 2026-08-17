import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-sans)", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "BIZ UDPGothic", "sans-serif"],
      },
      colors: {
        teal: {
          DEFAULT: "#0e483e",
          50: "#F6FAFA",
          100: "#E0F2F1",
          200: "#B2DFDB",
          300: "#80CBC4",
          400: "#4DB6AC",
          500: "#26A69A",
          600: "#00897B",
          700: "#005D5F",
          800: "#055448",
          900: "#0A5346",
          950: "#042F2E",
        },
        // レガシー互換（他ページで参照されている可能性あり）
        sage: "#8A9668",
        forest: "#19231B",
        pebble: "#F0F0F0",
        sunset: "#DD9348",
        cloud: "#C8E8FF",
        earth: "#261D14",
        sea: "#79C0BC",
        stone: "#CADCEB",
        cream: "#FAFAFA",
        linen: "#F5F5F5",
        mist: "#F8F9FA",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "hero-fade-in": "hero-fade-in 700ms ease-out both",
        // TOP ヒーローの登場演出。開始タイミングは lib/hero-motion.ts の
        // HERO_MOTION_DELAY を animationDelay として各要素に渡す。
        "hero-wipe": "hero-wipe 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-rise": "hero-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-zoom-in": "hero-zoom-in 1200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        // ヘッダーの登場演出（hero-appear）はユーティリティクラスではなく
        // app/globals.css に直接定義している。TOP かどうかの判定を JS で持てないため
        // （理由は globals.css のコメント参照）。ここに再定義しないこと。
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "hero-fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // 左から右へ拭き出すように文字を出す
        "hero-wipe": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0 0 0)" },
        },
        // わずかに下から浮かせながらフェードイン
        "hero-rise": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        // 背景写真。わずかに引きながらフェードイン
        "hero-zoom-in": {
          from: { opacity: "0", transform: "scale(1.03)" },
          to: { opacity: "1", transform: "none" },
        },
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
};

export default config;
