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
        linen: "#F4F2F0",
        mist: "#F8F9FA",
      },
      backgroundImage: {
        "inorganic-lines": "repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
};

export default config;
