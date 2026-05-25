import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { GeneratedEstimate } from "@/types/estimate";
import PdfHeader from "./shared/PdfHeader";
import { styles } from "./shared/PdfStyles";

interface EstimatePdfProps {
  estimate: GeneratedEstimate;
  clientName: string;
  date: string;
  documentNumber: string;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

/**
 * 従来型開発の参考注記。ハイブリッドの方が安い場合のみ「約X%削減」を返す。
 * standard/hybrid が不正（0以下・増加）なら参考行を出さない（null）。
 */
function buildReferenceNote(standard: number, hybrid: number): string | null {
  if (standard <= 0 || hybrid <= 0 || hybrid >= standard) return null;
  const discountRate = Math.round((1 - hybrid / standard) * 100);
  return `ご参考：従来型開発の場合 約${formatPrice(standard)}（約${discountRate}%削減）`;
}

export default function EstimatePdf({
  estimate,
  clientName,
  date,
  documentNumber,
}: EstimatePdfProps) {
  const features = estimate.features ?? [];
  const discussionAgenda = estimate.discussionAgenda ?? [];
  const summary = estimate.summary ?? "";
  const confidenceLabel = estimate.confidence?.rangeLabel;
  const referenceNote = buildReferenceNote(
    estimate.totalCost.standard,
    estimate.totalCost.hybrid
  );

  const remarkLines = [
    "※ 本見積書はAIによる概算であり、正式なお見積もり・機能要件ではありません。",
    "※ 正確な費用は、無料相談にて別途お見積もりいたします。",
    "※ 表示価格はすべて税別です。",
  ];
  if (estimate.confidenceNote) remarkLines.push(`※ ${estimate.confidenceNote}`);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <PdfHeader
          clientName={clientName}
          projectName={estimate.projectName}
          date={date}
          documentNumber={documentNumber}
          confidenceLabel={confidenceLabel}
        />

        {/* 合計バナー（御見積金額・税別） */}
        <View style={styles.banner} wrap={false}>
          <Text style={styles.bannerLabel}>御見積金額（税別）</Text>
          <Text style={styles.bannerAmount}>
            {formatPrice(estimate.totalCost.hybrid)}
          </Text>
        </View>

        {/* プロジェクト概要 */}
        {summary ? (
          <>
            <Text style={styles.sectionTitle}>プロジェクト概要</Text>
            <Text style={styles.bodyText}>{summary}</Text>
          </>
        ) : null}

        {/* 機能別費用明細 */}
        <Text style={styles.sectionTitle}>機能別費用明細</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colNo]}>No</Text>
          <Text style={[styles.tableHeaderText, styles.colFeature]}>機能名</Text>
          <Text style={[styles.tableHeaderText, styles.colDetail]}>詳細</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>
            金額（税別）
          </Text>
        </View>
        {features.map((feature, i) => (
          <View
            key={`${feature.name}-${i}`}
            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={[styles.cellText, styles.colNo]}>{i + 1}</Text>
            <Text style={[styles.cellText, styles.colFeature]}>
              {feature.name}
            </Text>
            <Text style={[styles.cellText, styles.colDetail]}>
              {feature.detail}
            </Text>
            <Text style={[styles.cellText, styles.colAmount]}>
              {formatPrice(feature.hybridPrice)}
            </Text>
          </View>
        ))}

        {/* 概算合計 + 従来型の参考注記（セットで改ページ保護） */}
        <View wrap={false}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalRowLabel, styles.colNo]} />
            <Text style={[styles.totalRowLabel, styles.colFeature]}>
              概算合計（税別）
            </Text>
            <Text style={[styles.totalRowLabel, styles.colDetail]} />
            <Text style={[styles.totalRowAmount, styles.colAmount]}>
              {formatPrice(estimate.totalCost.hybrid)}
            </Text>
          </View>
          {referenceNote ? (
            <Text style={styles.referenceNote}>{referenceNote}</Text>
          ) : null}
        </View>

        {/* 確認事項 */}
        {discussionAgenda.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>
              詳細お見積もりに向けた確認事項
            </Text>
            {discussionAgenda.map((item, i) => (
              <View key={i} style={styles.listItem} wrap={false}>
                <Text style={styles.listBullet}>{i + 1}.</Text>
                <Text style={styles.listContent}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* 備考 */}
        <View style={styles.remarksBox} wrap={false}>
          <Text style={styles.remarksLabel}>備考</Text>
          <Text style={styles.remarksText}>{remarkLines.join("\n")}</Text>
        </View>

        {/* フッター */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            株式会社クラウドネイチャー | cloudnature.jp
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
