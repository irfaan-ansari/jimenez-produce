import { CONTACT_SECTIONS } from "@/lib/constants/web";
import { JobApplicationSelectType } from "@/lib/db/schema";
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
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: COLORS.main,
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: "auto",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  docTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
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
    fontSize: 10,
    lineHeight: 1,
    fontWeight: "bold",
    backgroundColor: "#f1f5f9",
    padding: 10,
    marginTop: 15,
    marginBottom: 5,
    color: COLORS.main,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  fieldGroup: {
    flex: 1,
    marginTop: 10,
  },
  label: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  value: {
    fontSize: 12,
    color: "#0f172a",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 4,
    marginTop: 5,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  signatureBlock: {
    marginTop: 30,
    flexDirection: "row",
    gap: 40,
  },
  signatureImage: {
    width: 150,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#94a3b8",
  },
});

export const JobApplicationPDF = ({
  data,
}: {
  data: JobApplicationSelectType;
}) => (
  <Document>
    {/* PAGE 1: Personal & Driving Info */}
    <Page size="A4" style={styles.page}>
      {/* header */}
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
            <Text style={styles.tagline}>
              {data.position + " - " + data.location}
            </Text>
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

      {/* body */}
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>
            {data.firstName + " " + data.lastName}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{data.phone + " | " + data.email}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>DOB</Text>
          <Text style={styles.value}>{data.dob}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Availability</Text>
          <Text style={styles.value}>{data.availableStartDate}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>SSN</Text>
          <Text style={styles.value}>{data.socialSecurity}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Eligible to Work in the U.S.</Text>
          <Text style={[styles.value, { textTransform: "uppercase" }]}>
            {data.hasLegalRights}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Address History</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Address ({data.currentAddress.yearsAtAddress} yrs)
          </Text>
          <Text style={styles.value}>
            {data.currentAddress.street}, {data.currentAddress.city},{" "}
            {data.currentAddress.state} {data.currentAddress.zip}
          </Text>
        </View>
      </View>
      {data.addresses?.map((addr, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Prev Address ({addr.yearsAtAddress} yrs)
            </Text>
            <Text style={styles.value}>
              {addr.street}, {addr.city}, {addr.state} {addr.zip}
            </Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>License & Driving Experience</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>License Number</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseNumber}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseType}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Expiry</Text>
          <Text style={styles.value}>{data.currentLicense?.expiryDate}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={{ width: "25%", ...styles.tableHeaderText }}>
          Category
        </Text>
        <Text style={{ width: "25%", ...styles.tableHeaderText }}>Type</Text>
        <Text style={{ width: "30%", ...styles.tableHeaderText }}>Dates</Text>
        <Text style={{ width: "20%", ...styles.tableHeaderText }}>Miles</Text>
      </View>
      {data.drivingExperiences &&
        data.drivingExperiences.map((exp, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: "25%", ...styles.value, fontSize: 9 }}>
              {exp.category}
            </Text>
            <Text style={{ width: "25%", ...styles.value, fontSize: 9 }}>
              {exp.type}
            </Text>
            <Text style={{ width: "30%", ...styles.value, fontSize: 9 }}>
              {exp.fromDate} - {exp.toDate}
            </Text>
            <Text style={{ width: "20%", ...styles.value, fontSize: 9 }}>
              {exp.approxMilesTotal}
            </Text>
          </View>
        ))}

      <View fixed style={styles.footer}>
        <Text>
          IP: {data.ipAddress} | {data.applicantName}
        </Text>
        <Text>Page 1</Text>
      </View>
    </Page>

    {/* PAGE 2: Safety & Employment */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Accident & Violation History</Text>
      <View style={styles.tableHeader}>
        <Text style={{ width: "20%", ...styles.tableHeaderText }}>Date</Text>
        <Text style={{ width: "50%", ...styles.tableHeaderText }}>
          Nature/Violation
        </Text>
        <Text style={{ width: "15%", ...styles.tableHeaderText }}>
          Fatalities
        </Text>
        <Text style={{ width: "15%", ...styles.tableHeaderText }}>Hazmat</Text>
      </View>
      {data.accidentHistory &&
        data.accidentHistory.map((acc, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: "20%", ...styles.value, fontSize: 9 }}>
              {acc.accidentDate}
            </Text>
            <Text style={{ width: "50%", ...styles.value, fontSize: 9 }}>
              {acc.accidentNature}
            </Text>
            <Text style={{ width: "15%", ...styles.value, fontSize: 9 }}>
              {acc.fatalitiesCount}
            </Text>
            <Text style={{ width: "15%", ...styles.value, fontSize: 9 }}>
              {acc.chemicalSpill}
            </Text>
          </View>
        ))}

      <Text style={styles.sectionTitle}>Employment History</Text>
      {data.experience &&
        data.experience.map((job, i) => (
          <View
            key={i}
            style={{
              marginBottom: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#f1f5f9",
              paddingBottom: 5,
            }}
          >
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer</Text>
                <Text style={styles.value}>{job.employerName}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Dates</Text>
                <Text style={styles.value}>
                  {job.fromDate} - {job.toDate}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FMCSR Subject</Text>
                <Text style={styles.value}>{job.subjectToFmcsa}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Gap Explanation</Text>
                <Text style={styles.value}>{job.gap || "None"}</Text>
              </View>
            </View>
          </View>
        ))}

      <Text style={styles.sectionTitle}>Education</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>High School</Text>
          <Text style={styles.value}>
            {data.highSchool?.institutionName} ({data.highSchool?.yearCompleted}
            )
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>College</Text>
          <Text style={styles.value}>
            {data.collage?.institutionName || "N/A"}
          </Text>
        </View>
      </View>

      <View wrap={false}>
        <Text style={styles.sectionTitle}>Declaration & Signature</Text>
        <Text style={{ fontSize: 8, color: "#64748b", marginBottom: 10 }}>
          I certify that this application was completed by me, and that all
          entries on it are true and complete...
        </Text>
        <View style={styles.signatureBlock}>
          <View>
            <Text style={styles.label}>Applicant Signature</Text>
            {data.signatureUrl ? (
              <Image src={data.signatureUrl} style={styles.signatureImage} />
            ) : (
              <View
                style={[styles.signatureImage, { backgroundColor: "#f8fafc" }]}
              />
            )}
            <Text style={[styles.value, { marginTop: 5 }]}>
              {data.applicantName}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Date Signed</Text>
            <Text style={[styles.value, { marginTop: 40 }]}>
              {data.agreementDate || format(new Date(), "PPP")}
            </Text>
          </View>
        </View>
      </View>

      <View fixed style={styles.footer}>
        <Text>
          System ID: {data.id} | Generated: {format(new Date(), "PPpp")}
        </Text>
        <Text>Page 2</Text>
      </View>
    </Page>
  </Document>
);
