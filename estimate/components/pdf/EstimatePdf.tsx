import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { GeneratedEstimate } from "@/types/estimate";
import PdfHeader from "./shared/PdfHeader";
import { styles, colors } from "./shared/PdfStyles";

interface EstimatePdfProps {
  estimate: GeneratedEstimate;
  clientName: string;
  date: string;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

export default function EstimatePdf({
  estimate,
  clientName,
  date,
}: EstimatePdfProps) {
  const savings = estimate.totalCost.standard - estimate.totalCost.hybrid;
  const savingsPercent = Math.round(
    (savings / estimate.totalCost.standard) * 100
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader date={date} />

        {/* Title */}
        <Text style={styles.title}>概算お見積書</Text>
        <Text style={styles.subtitle}>
          {clientName} 様 - {estimate.projectName}
        </Text>

        {/* Summary */}
        <Text style={styles.sectionTitle}>プロジェクト概要</Text>
        <Text style={styles.bodyText}>{estimate.summary}</Text>

        {/* Development model */}
        <Text style={styles.sectionTitle}>開発モデルについて</Text>
        <Text style={styles.bodyText}>
          {estimate.developmentModelExplanation}
        </Text>

        {/* Feature table */}
        <Text style={styles.sectionTitle}>機能別費用明細</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.colFeature}>機能名</Text>
          <Text style={styles.colDetail}>詳細</Text>
          <Text style={styles.colStandard}>従来型開発</Text>
          <Text style={styles.colHybrid}>ハイブリッド開発</Text>
        </View>
        {estimate.features.map((feature, i) => (
          <View
            key={feature.name}
            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={styles.colFeature}>{feature.name}</Text>
            <Text style={styles.colDetail}>{feature.detail}</Text>
            <Text style={styles.colStandard}>
              {formatPrice(feature.standardPrice)}
            </Text>
            <Text style={styles.colHybrid}>
              {formatPrice(feature.hybridPrice)}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.colFeature}>概算合計（税別）</Text>
          <Text style={styles.colDetail}></Text>
          <Text style={styles.colStandard}>
            {formatPrice(estimate.totalCost.standard)}
          </Text>
          <Text style={styles.colHybrid}>
            {formatPrice(estimate.totalCost.hybrid)}
          </Text>
        </View>

        {/* Savings callout */}
        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: "#FEF3E2",
            borderRadius: 4,
            borderLeftWidth: 3,
            borderLeftColor: colors.sunset,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Helvetica-Bold",
              color: colors.sunset,
              marginBottom: 4,
            }}
          >
            AIハイブリッド開発で約{savingsPercent}%のコスト削減
          </Text>
          <Text style={{ fontSize: 9, color: colors.forest, lineHeight: 1.5 }}>
            削減額: {formatPrice(savings)} | {estimate.totalCost.message}
          </Text>
        </View>

        {/* Discussion agenda */}
        <Text style={styles.sectionTitle}>ヒアリングアジェンダ</Text>
        {estimate.discussionAgenda.map((item, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listBullet}>{i + 1}.</Text>
            <Text style={styles.listContent}>{item}</Text>
          </View>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            ※ 本見積書はAIによる概算であり、正式なお見積もりではありません。{"\n"}
            ※ 正確な費用は、ヒアリング後に別途お見積もりいたします。{"\n"}
            ※ 表示価格はすべて税別です。{"\n"}
            ※ 本見積書の有効期限は発行日より30日間です。
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
