import { CONTACT_SECTIONS } from "@/lib/constants/web";
import { JobApplicationSelectType } from "@/lib/db/schema";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { COLORS, styles } from "./styles";

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
          <Text style={styles.value}>{data.applicantName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>DOB</Text>
          <Text style={styles.value}>{format(data.dob, "MMMM dd, yyyy")}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Available Date</Text>
          <Text style={styles.value}>
            {format(data.availableStartDate, "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Social Security #</Text>
          <Text style={styles.value}>{data.socialSecurity}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Work authorization</Text>
          <Text style={[styles.value, { textTransform: "capitalize" }]}>
            {data.hasLegalRights}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{data.phone}</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Address</Text>
          <Text style={styles.value}>
            {data.currentAddress?.street +
              " " +
              data.currentAddress?.city +
              " " +
              data.currentAddress?.state +
              " " +
              data.currentAddress?.zip}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Previous Address</Text>
          <Text style={styles.value}>
            {data.mailingAddress?.street +
              " " +
              data.mailingAddress?.city +
              " " +
              data.mailingAddress?.state +
              " " +
              data.mailingAddress?.zip}
          </Text>
        </View>
      </View>

      {/* education */}
      <Text style={styles.sectionTitle}>Education - School</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{data.highSchool?.institutionName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>School</Text>
          <Text style={styles.value}>{data.highSchool?.fieldOfStudy}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{data.highSchool?.location}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Year Completed</Text>
          <Text style={styles.value}>{data.highSchool?.yearCompleted}</Text>
        </View>
      </View>
      {data.highSchool?.details && (
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>{data.highSchool?.details}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Education - College</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Institution Name</Text>
          <Text style={styles.value}>{data.collage?.institutionName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Field of Study</Text>
          <Text style={styles.value}>{data.collage?.fieldOfStudy}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{data.collage?.location}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Year Completed</Text>
          <Text style={styles.value}>{data.collage?.yearCompleted}</Text>
        </View>
      </View>
      {data.collage?.details && (
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>{data.collage?.details}</Text>
          </View>
        </View>
      )}
      {data.otherEducations && data.otherEducations?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Education - Other</Text>

          {data.otherEducations.map((edu, i) => (
            <View key={i}>
              <View style={styles.row}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Institution Name</Text>
                  <Text style={styles.value}>{edu.institutionName}</Text>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Field of Study</Text>
                  <Text style={styles.value}>{edu.fieldOfStudy}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Location</Text>
                  <Text style={styles.value}>{edu.location}</Text>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Year Completed</Text>
                  <Text style={styles.value}>{edu.yearCompleted}</Text>
                </View>
              </View>
              {edu.details && (
                <View style={styles.row}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Details</Text>
                    <Text style={styles.value}>{edu.details}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </>
      )}

      {/* employeement */}
      <Text style={styles.sectionTitle}>Employement History</Text>

      {data.experience &&
        data.experience.length > 0 &&
        data.experience.map((exp, i) => (
          <View key={i}>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Name</Text>
                <Text style={styles.value}>{exp.employerName}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Phone</Text>
                <Text style={styles.value}>{exp.phone}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Address</Text>
                <Text style={styles.value}>{exp.address}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Position</Text>
                <Text style={styles.value}>{exp.position}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>
                  {format(exp.fromDate, "MMMM dd, yyyy") +
                    " " +
                    format(exp.toDate, "MMMM dd, yyyy")}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Salary</Text>
                <Text style={styles.value}>{exp.salary}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FMCSR Applied</Text>
                <Text style={[styles.value, { textTransform: "capitalize" }]}>
                  {exp.subjectToFmcsa}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Safety-Sensitive (DOT)</Text>
                <Text style={[styles.value, { textTransform: "capitalize" }]}>
                  {exp.safetySensitive}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Reason for Leaving</Text>
                <Text style={styles.value}>{exp.reasonForLeaving}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Explain eny Gaps</Text>
                <Text style={styles.value}>{exp.gap}</Text>
              </View>
            </View>
          </View>
        ))}

      {/* license */}
      <Text style={styles.sectionTitle}>License</Text>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>License #</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseNumber}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type/Class</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseType}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <Text style={styles.value}>
            {format(data.currentLicense?.expiryDate!, "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Endorsements</Text>
          <Text style={styles.value}>{data.currentLicense?.endorsements}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Issuing State</Text>
          <Text style={styles.value}>{data.currentLicense?.state}</Text>
        </View>
      </View>

      {/* Driving Experience */}
      <Text style={styles.sectionTitle}>Driving Experience</Text>
      {data.drivingExperiences &&
        data.drivingExperiences.map((exp, i) => (
          <View key={i}>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{exp.category}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{exp.type}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>
                  {format(exp.fromDate, "MMMM dd, yyyy") +
                    " - " +
                    format(exp.toDate, "MMMM dd, yyyy")}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Approx Miles Total</Text>
                <Text style={styles.value}>{exp.approxMilesTotal}</Text>
              </View>
            </View>
          </View>
        ))}

      <Text style={styles.sectionTitle}>Address History</Text>

      <Text style={styles.sectionTitle}>Acknowledgement </Text>
      <Text
        style={{
          fontSize: 8,
          color: COLORS.secondary,
          marginBottom: 10,
          fontStyle: "italic",
        }}
      >
        <Text style={{ marginBottom: 8 }}>
          I, {data.applicantName},authorize you to make investigations
          (including contacting current and prior employers) into my personal,
          employment, financial, medical history, and other related matters as
          may be necessary in arriving at an employment decision. I hereby
          release employers, schools, health care providers, and other persons
          from all liability in responding to inquiries and releasing
          information in connection with my application.
        </Text>
        <Text style={{ marginBottom: 8 }}>
          In the event of employment, I understand that false or misleading
          information given in my application or interview(s) may result in
          discharge. I also understand that I am required to abide by all rules
          and regulations of the Company.
        </Text>
        <Text style={{ marginBottom: 8 }}>
          I understand that the information I provide regarding my current
          and/or prior employers may be used, and those employer(s) will be
          contacted for the purpose of investigating my safety performance
          history as required by 49 CFR 391.23. I understand that I have the
          right to review information, have errors corrected, and attach a
          rebuttal statement where applicable.
        </Text>
        <Text>
          This certifies that I completed this application, and that all entries
          on it and information in it are true and complete to the best of my
          knowledge. Note: A motor carrier may require an applicant to provide
          more information than that required by the Federal Motor Carrier
          Safety Regulations.
        </Text>
      </Text>
      <View wrap={false}>
        <Text style={styles.sectionTitle}>Declaration</Text>
        <Text
          style={{
            fontSize: 8,
            color: COLORS.secondary,
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          I {data.applicantName} confirm the information provided is accurate
          and the documents uploaded belong to me and are clear, complete, and
          unedited.
        </Text>

        <View style={[styles.row, { marginTop: 50 }]}>
          <View style={styles.signatureBlock}>
            {data.signatureUrl && (
              <Image src={data.signatureUrl} style={styles.signatureImage} />
            )}
            <Text style={styles.label}>Authorized Signature</Text>
            <Text style={styles.value}>{data.applicantName}</Text>
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
