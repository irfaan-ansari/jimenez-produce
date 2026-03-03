import { statusMap } from "@/lib/constants/customer";
import { CONTACT_SECTIONS } from "@/lib/constants/web";
import { CustomerSelectType } from "@/lib/db/schema";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const COLORS = {
  primary: "#80b83a",
  main: "#141414",
  secondary: "#64748b",
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 8,
    color: COLORS.secondary,
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: COLORS.bgSubtle,
    padding: "6 10",
    marginTop: 15,
    marginBottom: 10,
    color: COLORS.secondary,
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
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 4",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  // --- FIXED SIGNATURE AREA ---
  signatureSection: {
    marginTop: "auto",
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },
  signatureBlock: {
    width: "45%",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 5,
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#94a3b8",
  },
});

export const CustomerPDF = ({ data }: { data: CustomerSelectType }) => {
  const map = statusMap[data.status as keyof typeof statusMap];

  return (
    <Document title={`Customer Application - ${data.companyName}`}>
      <Page size="A4" style={styles.page}>
        {/* 1. HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              src={process.env.BETTER_AUTH_URL + "/logo.png"}
              style={styles.logo}
            />
            <View>
              <Text style={[styles.docTitle, { marginBottom: 16 }]}>
                Jiminez Produce
              </Text>
              <Text style={styles.tagline}>Customer application</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {CONTACT_SECTIONS.locations.map((loc, i) => (
              <View key={i} style={styles.headerContactText}>
                <Text>{loc.street}</Text>
                <Text>
                  {loc.phone} | {loc.email}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 2. BUSINESS IDENTITY */}
        <Text style={styles.sectionTitle}>Business Identity</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Legal Company Name</Text>
            <Text style={[styles.value, { fontSize: 12 }]}>
              {data.companyName}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Application Status</Text>
            <Text
              style={[styles.value, { color: map.color || COLORS.primary }]}
            >
              {map.label}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Doing Business As (DBA)</Text>
            <Text style={styles.value}>{data.companyDBA || "N/A"}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Company Type</Text>
            <Text style={styles.value}>{data.companyType}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EIN / Tax ID</Text>
            <Text style={styles.value}>{data.companyEin}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {data.companyStreet}, {data.companyCity}, {data.companyState}{" "}
              {data.companyZip}
            </Text>
          </View>
        </View>

        {/* 3. AUTHORIZED OFFICER */}
        <Text style={styles.sectionTitle}>Authorized Officer</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>
              {data.officerFirst} {data.officerLast}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Details</Text>
            <Text style={styles.value}>
              {data.officerEmail} | {data.officerMobile}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{data.officerRole}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {data.officerStreet}, {data.officerCity}, {data.officerState}{" "}
              {data.officerZip}
            </Text>
          </View>
        </View>
        {/* 4. BILLING & OPERATIONS */}
        <Text style={styles.sectionTitle}>Operations & Billing</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Accounts Payable Email</Text>
            <Text style={styles.value}>
              {data.accountPayableEmail || "Not Provided"}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ordering Contact</Text>
            <Text style={styles.value}>
              {data.orderingName} ({data.orderingPhone})
            </Text>
          </View>
        </View>
        {/* 4. DELIVERY SCHEDULE */}
        <Text style={styles.sectionTitle}>Delivery Requirements</Text>
        <Text
          style={[
            styles.label,
            { textTransform: "uppercase", marginBottom: 10 },
          ]}
        >
          Lockbox: {data.lockboxPermission}
        </Text>
        <View style={styles.tableHeader}>
          <Text
            style={{
              width: "25%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Day/Window
          </Text>
          <Text
            style={{
              width: "30%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Receiver
          </Text>
          <Text
            style={{
              width: "45%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Instructions
          </Text>
        </View>

        {data.deliverySchedule.map((sch, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: "25%", fontSize: 8 }}>
              {sch.day} ({sch.window})
            </Text>
            <Text style={{ width: "30%", fontSize: 8 }}>
              {sch.receivingName}
            </Text>
            <Text
              style={{ width: "45%", fontSize: 8, color: COLORS.secondary }}
            >
              {sch.instructions || "Standard"}
            </Text>
          </View>
        ))}

        {/* 5. SIGNATURE SECTION (ANCHORED TO BOTTOM) */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Acknowledgement</Text>
          <Text
            style={{
              fontSize: 8,
              color: COLORS.secondary,
              marginBottom: 10,
              fontStyle: "italic",
            }}
          >
            I, {data.signatureName}, hereby certify that the information
            provided is accurate and authorize account establishment.
          </Text>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureBlock}>
              {data.signatureUrl && (
                <Image src={data.signatureUrl} style={styles.signatureImage} />
              )}
              <Text style={styles.label}>Authorized Signature</Text>
              <Text style={styles.value}>{data.signatureName}</Text>
            </View>

            <View
              style={[
                styles.signatureBlock,
                { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
              ]}
            >
              <View
                style={{
                  height: 40,
                  justifyContent: "flex-end",
                  marginBottom: 5,
                }}
              >
                <Text style={styles.value}>
                  {data.createdAt
                    ? format(new Date(data.createdAt), "MMMM dd, yyyy")
                    : "N/A"}
                </Text>
              </View>
              <Text style={styles.label}>Date Signed</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
