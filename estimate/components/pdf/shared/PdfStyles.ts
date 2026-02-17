import { StyleSheet } from "@react-pdf/renderer";

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
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.forest,
    backgroundColor: colors.white,
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.sage,
  },
  brandName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.forest,
  },
  brandSub: {
    fontSize: 8,
    color: colors.grey,
    marginTop: 2,
  },
  dateText: {
    fontSize: 9,
    color: colors.grey,
    textAlign: "right",
  },
  // Title
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.forest,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: colors.grey,
    marginBottom: 24,
    textAlign: "center",
  },
  // Section
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.forest,
    marginBottom: 8,
    marginTop: 20,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.sage,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.forest,
    color: colors.white,
    padding: 8,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    fontSize: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 8,
    fontSize: 9,
    backgroundColor: colors.mist,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  colFeature: { width: "35%" },
  colDetail: { width: "30%" },
  colStandard: { width: "17.5%", textAlign: "right" },
  colHybrid: { width: "17.5%", textAlign: "right" },
  // Total
  totalRow: {
    flexDirection: "row",
    padding: 10,
    marginTop: 4,
    backgroundColor: colors.cream,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  hybridBadge: {
    backgroundColor: colors.sunset,
    color: colors.white,
    padding: "2 6",
    borderRadius: 3,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  // Body text
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.forest,
    marginBottom: 6,
  },
  // List
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 8,
  },
  listBullet: {
    width: 12,
    fontSize: 10,
    color: colors.sage,
  },
  listContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Footer
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
  footerText: {
    fontSize: 7,
    color: colors.grey,
  },
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: colors.mist,
    borderRadius: 4,
    fontSize: 8,
    color: colors.grey,
    lineHeight: 1.5,
  },
});
