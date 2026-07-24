#!/usr/bin/env node
/**
 * 記事ページのスクリーンショット撮影（モバイル + デスクトップを並列）
 *
 * 使い方:
 *   node screenshot.cjs <URL> [出力ディレクトリ]
 *
 * 出力:
 *   <出力ディレクトリ>/mobile_view.png       モバイル ファーストビュー
 *   <出力ディレクトリ>/mobile_mid.png        モバイル スクロール後
 *   <出力ディレクトリ>/mobile_full.png       モバイル フルページ
 *   <出力ディレクトリ>/desktop_view.png      デスクトップ ファーストビュー
 *   <出力ディレクトリ>/desktop_mid.png       デスクトップ スクロール後
 *
 * 前提:
 *   - dev サーバーが起動済み
 *   - リポジトリ内のどこかに Playwright がインストール済み（estimate/ 配下を想定）
 */

const path = require('path');
const fs = require('fs');

// Playwright のパスを __dirname 基準で解決（ハードコード回避）
function loadChromium() {
  const repoRoot = path.resolve(__dirname, '../../../..');
  const candidates = [
    path.join(repoRoot, 'node_modules', 'playwright'),
    path.join(repoRoot, 'estimate', 'node_modules', 'playwright'),
    path.join(process.cwd(), 'node_modules', 'playwright'),
  ];
  for (const p of candidates) {
    try {
      return require(p).chromium;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
  throw new Error('Playwright が見つかりません。estimate/ などで npm install してください。');
}

const url = process.argv[2];
const outDir = process.argv[3] || '/tmp/article-screenshots';

if (!url) {
  console.error('使い方: node screenshot.cjs <URL> [出力ディレクトリ]');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

async function capture(browser, label, viewport, deviceScaleFactor, scrollY) {
  console.log(`→ ${label} (${viewport.width}x${viewport.height}) を撮影中...`);
  const ctx = await browser.newContext({ viewport, deviceScaleFactor });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, `${label}_view.png`), fullPage: false });
  if (label === 'mobile') {
    await page.screenshot({ path: path.join(outDir, `${label}_full.png`), fullPage: true });
  }
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${label}_mid.png`), fullPage: false });
  await ctx.close();
}

(async () => {
  const chromium = loadChromium();
  const browser = await chromium.launch();

  await Promise.all([
    capture(browser, 'mobile', { width: 390, height: 844 }, 2, 1500),
    capture(browser, 'desktop', { width: 1280, height: 800 }, 1, 1200),
  ]);

  await browser.close();
  console.log(`完了。出力先: ${outDir}`);
})().catch(e => { console.error(e); process.exit(1); });
