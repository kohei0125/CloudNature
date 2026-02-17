import { View, Text } from "@react-pdf/renderer";
import { styles } from "./PdfStyles";

interface PdfHeaderProps {
  date: string;
}

export default function PdfHeader({ date }: PdfHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.brandName}>CloudNature</Text>
        <Text style={styles.brandSub}>
          株式会社クラウドネイチャー
        </Text>
      </View>
      <View>
        <Text style={styles.dateText}>発行日: {date}</Text>
        <Text style={styles.dateText}>有効期限: 発行日より30日</Text>
      </View>
    </View>
  );
}
