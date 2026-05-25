import { View, Text, Image } from "@react-pdf/renderer";
import path from "node:path";
import { styles } from "./PdfStyles";

interface PdfHeaderProps {
  clientName: string;
  projectName: string;
  date: string;
  documentNumber: string;
  /** お見積もり精度（例: ±20%）。無い場合は精度欄を出さない。 */
  confidenceLabel?: string;
}

const logoPath = path.join(process.cwd(), "public/images/cloudnature.png");

const VALIDITY = "発行日より30日";

export default function PdfHeader({
  clientName,
  projectName,
  date,
  documentNumber,
  confidenceLabel,
}: PdfHeaderProps) {
  return (
    <View>
      {/* 1段目: タイトル + 発行日・番号 */}
      <View style={styles.topRow}>
        <Text style={styles.docTitle}>御見積書</Text>
        <View style={styles.docMeta}>
          <Text style={styles.docMetaText}>見積書番号: {documentNumber}</Text>
          <Text style={styles.docMetaText}>発行日: {date}</Text>
        </View>
      </View>

      {/* 2段目: 宛名 */}
      <View style={styles.clientNameWrap}>
        <Text style={styles.clientName}>{clientName}　様</Text>
      </View>

      {/* 3段目: 挨拶+項目欄(左) / 会社情報(右) */}
      <View style={styles.headRow}>
        <View style={styles.headLeft}>
          <Text style={styles.greeting}>
            下記のとおり御見積申し上げます。
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>件名</Text>
            <Text style={styles.fieldValue}>{projectName}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>有効期限</Text>
            <Text style={styles.fieldValue}>{VALIDITY}</Text>
          </View>
          {confidenceLabel ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>お見積もり精度</Text>
              <Text style={styles.fieldValue}>{confidenceLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.headRight}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image has no alt prop */}
          <Image style={styles.companyLogo} src={logoPath} />
          <Text style={styles.companyName}>株式会社クラウドネイチャー</Text>
          <Text style={styles.companyMeta}>
            〒951-8068{"\n"}新潟県新潟市中央区上大川前通七番町1230番地7
            {"\n"}ストークビル鏡橋 7F{"\n"}cloudnature.jp
          </Text>
        </View>
      </View>
    </View>
  );
}
