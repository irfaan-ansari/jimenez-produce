import { StyleSheet } from "@react-pdf/renderer";

const COLORS = {
  primary: "#80b83a",
  main: "#141414",
  secondary: "#676767",
  divider: "#e2e8f0",
  bgSubtle: "#f8fafc",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.main,
    lineHeight: 1.4,
    position: "relative",
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  logo: {
    width: 65,
    height: "auto",
  },
  docTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.main,
  },
  tagline: {
    fontSize: 10,
    color: COLORS.secondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  headerRight: {
    textAlign: "right",
    width: "40%",
  },
  headerContactText: {
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: COLORS.bgSubtle,
    padding: "6 10",
    marginTop: 15,
    marginBottom: 10,
    color: COLORS.main,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 20,
  },
  fieldGroup: {
    flex: 1,
  },
  label: {
    fontSize: 7,
    color: COLORS.secondary,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
    lineHeight: 1,
  },
  value: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSubtle,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    padding: 6,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.secondary,
    textTransform: "uppercase",
    padding: "4 6",
  },
  tableRow: {
    flexDirection: "row",
    padding: "0 0",
    alignItems: "stretch",
  },
  signatureBlock: {
    width: "50%",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 5,
  },
  signatureImage: {
    width: 200,
    height: 80,
    marginBottom: 16,
    objectFit: "contain",
    objectPosition: "left",
  },
  contentText: {
    fontSize: 10,
    color: "#334155",
    textAlign: "justify",
    marginBottom: 8,
    marginTop: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tableColHeader: {
    width: "100%",
    borderRightWidth: 1,
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    minHeight: 24,
    height: "auto",
    width: "100%",
    borderRightWidth: 1,
    padding: 6,
    fontSize: 9,
    lineHeight: 1,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

export { styles, COLORS };
