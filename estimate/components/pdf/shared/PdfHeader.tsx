import { View, Text, Image } from "@react-pdf/renderer";
import path from "node:path";
import { styles } from "./PdfStyles";

interface PdfHeaderProps {
  date: string;
  documentNumber: string;
}

const logoPath = path.join(process.cwd(), "public/images/header_logo.png");

export default function PdfHeader({ date, documentNumber }: PdfHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image has no alt prop */}
        <Image style={styles.headerLogo} src={logoPath} />
        <View>
          <Text style={styles.brandSub}>株式会社クラウドネイチャー</Text>
          <Text style={styles.brandSub}>新潟県新潟市中央区</Text>
          <Text style={styles.brandSub}>cloudnature.jp</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.docNumber}>見積書番号: {documentNumber}</Text>
        <Text style={styles.dateText}>発行日: {date}</Text>
        <Text style={styles.dateText}>有効期限: 発行日より30日</Text>
      </View>
    </View>
  );
}
