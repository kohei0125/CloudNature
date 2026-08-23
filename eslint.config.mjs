import nextConfig from "eslint-config-next";

const config = [
  { ignores: ["estimate/", "backend/", "ai-dev/"] },
  ...nextConfig,
];

export default config;
