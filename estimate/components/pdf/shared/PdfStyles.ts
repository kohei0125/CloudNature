import { StyleSheet } from "@react-pdf/renderer";

const FONT = "NotoSansJP";
// 太字は別ファミリー（静的ラベル＋数字記号のサブセット）。動的テキストには使わない。
const FONT_BOLD = "NotoSansJPBold";

export const colors = {
  forest: "#19231B",
  sage: "#8A9668",
  sunset: "#DD9348",
  pebble: "#EDE8E5",
  cream: "#F0EEE9",
  white: "#FFFFFF",
  mist: "#F8F9FA",
  grey: "#6B7280",
  lightGrey: "#E5E7EB",
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60,
    fontFamily: FONT,
    fontSize: 10,
    color: colors.forest,
    backgroundColor: colors.white,
  },

  // ── 文書ヘッド ─────────────────────────────
  // 1段目: タイトル(左) + 発行日・番号(右)
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  docTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 26,
    color: colors.forest,
    letterSpacing: 6,
  },
  docMeta: { alignItems: "flex-end" },
  docMetaText: {
    fontFamily: FONT,
    fontSize: 8.5,
    color: colors.grey,
    marginBottom: 2,
  },

  // 2段目: 宛名
  clientNameWrap: {
    width: "66%",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.forest,
    paddingBottom: 5,
    marginBottom: 14,
  },
  clientName: { fontFamily: FONT, fontSize: 16, color: colors.forest },

  // 3段目: 挨拶+項目欄(左) / 会社情報(右)
  headRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headLeft: { width: "56%" },
  greeting: {
    fontFamily: FONT,
    fontSize: 9.5,
    color: colors.forest,
    marginBottom: 12,
  },
  fieldRow: { flexDirection: "row", marginBottom: 5 },
  fieldLabel: {
    width: 90,
    fontFamily: FONT_BOLD,
    fontSize: 9,
    color: colors.grey,
  },
  fieldValue: { flex: 1, fontFamily: FONT, fontSize: 9.5, color: colors.forest },

  headRight: { width: "40%", alignItems: "flex-end" },
  companyLogo: { width: 110, height: 28, marginBottom: 6 },
  companyName: {
    fontFamily: FONT_BOLD,
    fontSize: 10,
    color: colors.forest,
    marginBottom: 3,
  },
  companyMeta: {
    fontFamily: FONT,
    fontSize: 8,
    color: colors.grey,
    textAlign: "right",
    lineHeight: 1.4,
  },

  // ── 合計バナー ─────────────────────────────
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  bannerLabel: {
    fontFamily: FONT_BOLD,
    fontSize: 11,
    color: colors.white,
  },
  bannerAmount: {
    fontFamily: FONT_BOLD,
    fontSize: 22,
    color: colors.white,
  },

  // ── セクション ─────────────────────────────
  sectionTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 12,
    color: colors.forest,
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.sage,
  },
  bodyText: {
    fontFamily: FONT,
    fontSize: 9.5,
    lineHeight: 1.7,
    color: colors.forest,
  },

  // ── 明細表 ─────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.forest,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontFamily: FONT_BOLD,
    fontSize: 8.5,
    color: colors.white,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.mist,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  cellText: {
    fontFamily: FONT,
    fontSize: 8.5,
    color: colors.forest,
    lineHeight: 1.45,
  },
  colNo: { width: "8%", textAlign: "center" },
  colFeature: { width: "30%", paddingRight: 6 },
  colDetail: { width: "42%", paddingRight: 6 },
  colAmount: { width: "20%", textAlign: "right" },

  // 合計行（参考行とセットで改ページ保護する。ラッパは <View wrap={false}>）
  totalRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 8,
    backgroundColor: colors.cream,
    borderTopWidth: 2,
    borderTopColor: colors.forest,
  },
  totalRowLabel: {
    fontFamily: FONT_BOLD,
    fontSize: 10,
    color: colors.forest,
  },
  totalRowAmount: {
    fontFamily: FONT_BOLD,
    fontSize: 11,
    color: colors.forest,
    textAlign: "right",
  },
  referenceNote: {
    fontFamily: FONT,
    fontSize: 8,
    color: colors.grey,
    textAlign: "right",
    marginTop: 5,
    paddingRight: 8,
  },

  // ── 確認事項リスト ─────────────────────────
  listItem: { flexDirection: "row", marginBottom: 5, paddingLeft: 6 },
  listBullet: {
    width: 18,
    fontFamily: FONT_BOLD,
    fontSize: 9,
    color: colors.sage,
  },
  listContent: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 9.5,
    lineHeight: 1.55,
    color: colors.forest,
  },

  // ── 備考 ───────────────────────────────────
  remarksBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: colors.mist,
    borderWidth: 0.5,
    borderColor: colors.sage,
    borderRadius: 4,
  },
  remarksLabel: {
    fontFamily: FONT_BOLD,
    fontSize: 9,
    color: colors.forest,
    marginBottom: 5,
  },
  remarksText: {
    fontFamily: FONT,
    fontSize: 8,
    color: colors.grey,
    lineHeight: 1.6,
  },

  // ── フッター ───────────────────────────────
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGrey,
  },
  footerText: { fontFamily: FONT, fontSize: 7, color: colors.grey },
});
