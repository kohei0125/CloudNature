import { USECASES_ARTICLES } from "@/content/usecases";
import { CANONICAL_SITE_URL } from "@/lib/site";

// llms.txt: AI クローラ・AI 検索向けのサイト概要（AIEO）
// 記事一覧は sitemap.ts と同じく USECASES_ARTICLES から生成し、記事追加に自動追従させる

export const dynamic = "force-static";

export function GET() {
  const articleLines = USECASES_ARTICLES.map(
    (article) =>
      `- [${article.title}](${CANONICAL_SITE_URL}/usecases/${article.id}): ${article.excerpt}`
  ).join("\n");

  const body = `# 株式会社クラウドネイチャー

> 新潟のAI開発・AIエージェント開発会社。中小企業向けに、AI導入支援・業務自動化・AIエージェント開発・システム開発を提供する伴走型パートナー。

## 会社概要

株式会社クラウドネイチャーは、新潟市を拠点にAI開発・AIエージェント開発・AI導入支援を提供する開発会社です。
「何から始めればいいか分からない」状態から、現場でAIが動き、運用に定着するところまでを伴走します。
スモールスタートを重視し、AIで解決できることと、システム開発が必要なことを切り分けながら提案します。

## 主要サービス

- [AI導入・伴走支援](${CANONICAL_SITE_URL}/services/ai-support): 無料診断、法人向けAI研修、個別スクール、導入後の運用定着支援
- [AIエージェント開発](${CANONICAL_SITE_URL}/services/ai-agent): 社内ナレッジAI、問い合わせ自動応答、SaaS連携自動化
- [システム開発](${CANONICAL_SITE_URL}/services/system-dev): 既存システム連携、業務Webアプリ開発、業務効率化システム開発

## 導入事例

- [導入事例一覧](${CANONICAL_SITE_URL}/cases): 実績と成果の一覧ページ
- AI見積もりシステムの自社開発: 見積もり作成時間を数日から1分へ短縮（工数95%削減）
- AI学習管理システム: 研修管理工数を削減し、学習定着を支援
- コンテンツマーケティングの自律的運営: 執筆・投稿工数を80%削減し、公開頻度を向上

## AIガイド

- [AI導入のヒント・実践ガイド](${CANONICAL_SITE_URL}/usecases): AI導入、業務自動化、最新ツール活用に関する記事一覧
${articleLines}

## 導入フロー

1. 無料ヒアリング
2. ご提案・お見積もり
3. 設計・プロトタイプ
4. 開発・テスト
5. 導入・研修
6. 運用・定着支援

## ページ一覧

- [トップページ](${CANONICAL_SITE_URL}/): AI導入支援の概要、導入事例、FAQ、CTA
- [サービス一覧](${CANONICAL_SITE_URL}/services): サービス全体の整理、導入フロー、FAQ
- [導入事例](${CANONICAL_SITE_URL}/cases): 実績と成果の一覧
- [AIガイド](${CANONICAL_SITE_URL}/usecases): AI導入・業務自動化のガイド記事一覧
- [お知らせ](${CANONICAL_SITE_URL}/news): 最新情報、事例紹介、技術ブログ
- [企業情報](${CANONICAL_SITE_URL}/company): 会社概要、代表メッセージ、アクセス
- [お問い合わせ](${CANONICAL_SITE_URL}/contact): 無料相談・お問い合わせフォーム
- [AI見積もり](https://ai.cloudnature.jp/chat): AIによる無料の概算見積もりツール
- [プライバシーポリシー](${CANONICAL_SITE_URL}/privacy): 個人情報の取り扱い方針
- [情報セキュリティ方針](${CANONICAL_SITE_URL}/security): 情報資産の保護と安全管理

## お問い合わせ

- 相談無料・秘密厳守・営業電話なし
- [お問い合わせフォーム](${CANONICAL_SITE_URL}/contact)
- [無料AI見積もり](https://ai.cloudnature.jp/chat)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
