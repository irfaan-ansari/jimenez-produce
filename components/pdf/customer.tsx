import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CustomerSelectType } from "@/lib/db/schema";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  header: {
    marginBottom: 20,
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  badge: {
    fontSize: 9,
    padding: 4,
    marginTop: 4,
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 4,
  },

  row: {
    marginBottom: 4,
  },

  twoCol: {
    flexDirection: "row",
    gap: 20,
  },

  col: {
    flex: 1,
  },

  tableRow: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: "center",
    color: "#888",
  },
});

export const CustomerPDF = ({
  data,
  statusLabel,
  statusColor,
}: {
  data: CustomerSelectType;
  statusLabel: string;
  statusColor: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>{data.companyName}</Text>
        <Text>{data.companyDBA}</Text>
        <Text>{data.companyEmail}</Text>
        <Text>{data.companyPhone}</Text>

        <Text
          style={{
            ...styles.badge,
            color: statusColor,
          }}
        >
          Status: {statusLabel}
        </Text>
      </View>

      {/* Company Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.row}>EIN: {data.companyEin}</Text>
            <Text style={styles.row}>
              Address: {data.companyStreet}, {data.companyCity},{" "}
              {data.companyState} {data.companyZip}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.row}>
              Created: {data.createdAt?.toString()}
            </Text>
            <Text style={styles.row}>
              Updated: {data.updatedAt?.toString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Contact</Text>
        <Text>
          {data.officerFirst} {data.officerLast}
        </Text>
        <Text>{data.officerEmail}</Text>
        <Text>{data.officerMobile}</Text>
      </View>

      {/* Delivery */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Schedule</Text>
        {data.deliverySchedule.map((sch, i) => (
          <View key={i} style={styles.tableRow}>
            <Text>
              {sch.day} - {sch.window}
            </Text>
            <Text>{sch.receivingName}</Text>
            <Text>{sch.receivingPhone}</Text>
            <Text>{sch.instructions}</Text>
          </View>
        ))}
      </View>

      {/* Hold / Reject Section */}
      {(data.status === "on_hold" || data.status === "rejected") && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {data.status === "on_hold" ? "Hold Reason" : "Rejection Reason"}
          </Text>
          <Text>{data.statusReason}</Text>
          <Text>{data.statusDetails}</Text>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        Confidential – Generated on {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);
