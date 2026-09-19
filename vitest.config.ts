import path from "node:path";
import { defineConfig } from "vitest/config";

// ルートNext.jsプロジェクト用のテスト設定。estimate/・ai-dev/はNext.js側のtsconfig excludeと
// 同様、別ワークスペース扱いのためここでは対象に含めない
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
    exclude: ["estimate/**", "ai-dev/**", "backend/**", "node_modules/**"],
  },
});
