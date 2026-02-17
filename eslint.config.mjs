import nextConfig from "eslint-config-next";

const config = [
  { ignores: ["estimate/", "backend/"] },
  ...nextConfig,
];

export default config;
