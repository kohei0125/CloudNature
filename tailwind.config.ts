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
        cloud: "#C8E8FF"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
