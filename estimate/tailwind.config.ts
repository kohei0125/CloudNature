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
        sans: ["var(--font-sans)", "Noto Sans JP", "sans-serif"],
        serif: ["var(--font-serif)", "Noto Serif JP", "serif"]
      },
      colors: {
        sage: "#8A9668",
        forest: "#19231B",
        pebble: "#EDE8E5",
        sunset: "#DD9348",
        cloud: "#C8E8FF",
        earth: "#261D14",
        sea: "#79C0BC",
        stone: "#CADCEB",
        cream: "#F0EEE9",
        linen: "#f5f3f0",
        mist: "#F8F9FA",
        charcoal: "#1a1a1a",
        clay: "#e0ddd7",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "nudge-x": "nudge-x 1.5s ease-in-out infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "nudge-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3px)" },
        },
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
