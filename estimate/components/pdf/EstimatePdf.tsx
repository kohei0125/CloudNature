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

export default function EstimatePdf({
  estimate,
  clientName,
  date,
  documentNumber,
}: EstimatePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader date={date} documentNumber={documentNumber} />

        {/* Title bar */}
        <View style={styles.titleBar}>
          <Text style={styles.titleBarText}>御 見 積 書</Text>
        </View>

        {/* Client info + total amount */}
        <View style={styles.clientTotalRow}>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>{clientName} 様</Text>
            <Text style={styles.projectLabel}>件名:</Text>
            <Text style={styles.projectName}>{estimate.projectName}</Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>御見積金額（税別）</Text>
            <Text style={styles.totalAmount}>
              {formatPrice(estimate.totalCost.hybrid)}
            </Text>
            <Text style={styles.totalNote}>※消費税は別途</Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>プロジェクト概要</Text>
        <Text style={styles.bodyText}>{estimate.summary}</Text>

        {/* Feature table */}
        <Text style={styles.sectionTitle}>機能別費用明細</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colNo]}>No</Text>
          <Text style={[styles.tableHeaderText, styles.colFeature]}>
            機能名
          </Text>
          <Text style={[styles.tableHeaderText, styles.colDetail]}>詳細</Text>
          <Text style={[styles.tableHeaderText, styles.colStandard]}>
            従来型開発
          </Text>
          <Text style={[styles.tableHeaderText, styles.colHybrid]}>
            ハイブリッド開発
          </Text>
        </View>
        {estimate.features.map((feature, i) => (
          <View
            key={feature.name}
            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={[styles.cellText, styles.colNo]}>{i + 1}</Text>
            <Text style={[styles.cellText, styles.colFeature]}>
              {feature.name}
            </Text>
            <Text style={[styles.cellText, styles.colDetail]}>
              {feature.detail}
            </Text>
            <Text style={[styles.cellText, styles.colStandard]}>
              {formatPrice(feature.standardPrice)}
            </Text>
            <Text style={[styles.cellText, styles.colHybrid]}>
              {formatPrice(feature.hybridPrice)}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.totalRowText, styles.colNo]} />
          <Text style={[styles.totalRowText, styles.colFeature]}>
            概算合計（税別）
          </Text>
          <Text style={[styles.totalRowText, styles.colDetail]} />
          <Text style={[styles.totalRowText, styles.colStandard]}>
            {formatPrice(estimate.totalCost.standard)}
          </Text>
          <Text style={[styles.totalRowText, styles.colHybrid]}>
            {formatPrice(estimate.totalCost.hybrid)}
          </Text>
        </View>

        {/* Cost message */}
        {estimate.totalCost.message && (
          <View style={styles.savingsBox}>
            <Text style={styles.savingsDetail}>
              {estimate.totalCost.message}
            </Text>
          </View>
        )}

        {/* Discussion agenda */}
        <Text style={styles.sectionTitle}>
          詳細お見積もりに向けた確認事項
        </Text>
        {estimate.discussionAgenda.map((item, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listBullet}>{i + 1}.</Text>
            <Text style={styles.listContent}>{item}</Text>
          </View>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            {estimate.confidenceNote &&
              `※ 見積もり精度: ${estimate.confidenceNote}\n`}
            ※
            本見積書はAIによる概算であり、正式なお見積もり・機能要件ではありません。
            {"\n"}※ 正確な費用は、無料相談にて別途お見積もりいたします。{"\n"}※
            表示価格はすべて税別です。{"\n"}※
            本見積書の有効期限は発行日より30日間です。{"\n"}※
            お支払い条件は別途ご相談のうえ決定いたします。
          </Text>
        </View>

        {/* Footer */}
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
