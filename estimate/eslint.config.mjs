import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    rules: {
      // App Router handles fonts in layout.tsx, not pages/_document.js
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default config;
