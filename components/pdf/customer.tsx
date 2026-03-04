import { statusMap } from "@/lib/constants/customer";
import { CONTACT_SECTIONS } from "@/lib/constants/web";
import { CustomerSelectType } from "@/lib/db/schema";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { COLORS, styles } from "./styles";

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
                Jimenez Produce
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
            <Text style={styles.label}>Guarantor</Text>
            <Text style={styles.value}>
              {data.guarantorName || "Not Provided"}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Guarantor Title</Text>
            <Text style={styles.value}>
              {data.guarantorRole || "Not Provided"}
            </Text>
          </View>
        </View>
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
        <View wrap={false}>
          <Text style={styles.sectionTitle}>Acknowledgement</Text>
          <Text
            style={{
              fontSize: 8,
              color: COLORS.secondary,
              marginBottom: 10,
              fontStyle: "italic",
            }}
          >
            I, {data.signatureName}, acknowledge that I have read, understand,
            and agree to the Personal Guarantee Agreement above. I agree that
            this electronic submission serves as my legally binding signature.
          </Text>

          <View style={[styles.row, { marginTop: 50 }]}>
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
