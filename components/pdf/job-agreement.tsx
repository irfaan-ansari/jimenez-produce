import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { COLORS, styles } from "./styles";

export const JobAgreementPDF = ({ data }: { data: any }) => {
  return (
    <Document title={`Employment Agreement - ${data.name}`}>
      <Page size="A4" style={styles.page}>
        {/* header */}
        <View style={[styles.header]}>
          <View style={styles.headerLeft}>
            <Image
              src={process.env.BETTER_AUTH_URL + "/logo.png"}
              style={styles.logo}
            />
            <View>
              <Text style={[styles.docTitle, { marginBottom: 16 }]}>
                Jimenez Produce LLC
              </Text>
              <Text style={styles.tagline}>
                Employment Agreement & Policy Acknowledgment
              </Text>
            </View>
          </View>
        </View>

        {/* 2. MAIN CONTENT CARD (Will flow across 4-5 pages) */}

        <Text style={styles.sectionTitle}>
          Employee Onboarding & Policy Acknowledgment Packet
        </Text>
        <Text style={styles.contentText}>
          This document outlines employment terms, safety requirements,
          compliance obligations, equipment accountability standards, and
          workplace expectations for all employees of Jimenez Produce LLC.
        </Text>
        <Text style={styles.sectionTitle}>1. Employment Relationship</Text>
        <Text style={styles.contentText}>
          Employment with Jimenez Produce LLC is at-will. Either the employee or
          the company may terminate employment at any time, with or without
          cause or notice, subject to applicable law. Nothing in this document
          creates a contract of employment. All employees are subject to a
          90-day introductory period during which performance, reliability, and
          adherence to company policies will be evaluated.
        </Text>

        <Text style={styles.sectionTitle}>
          2. Drug, Alcohol & Screening Authorization
        </Text>
        <Text style={styles.contentText}>
          Employees consent to pre-employment, post-accident, reasonable
          suspicion, and when applicable, random drug and alcohol testing. By
          signing this document, you authorize Jimenez Produce LLC to conduct
          criminal background checks, obtain Motor Vehicle Reports (MVR), verify
          employment history, conduct drug testing, and perform FMCSA Drug &
          Alcohol Clearinghouse queries as required by law.
        </Text>

        <Text style={styles.sectionTitle}>
          3. FMCSA Clearinghouse (CDL Drivers)
        </Text>
        <Text style={styles.contentText}>
          CDL drivers authorize annual limited queries of the FMCSA Drug &
          Alcohol Clearinghouse. If a record exists, the driver must provide
          electronic consent for a full query within 24 hours in accordance with
          49 CFR §382.703(c). Failure to comply will result in removal from
          safety-sensitive duties.
        </Text>

        <View wrap={false}>
          <Text style={styles.sectionTitle}>
            4. Equipment Responsibility & Big Joe Policy
          </Text>
          <Text style={styles.contentText}>
            Employees are responsible for the proper care and protection of all
            assigned company equipment, including but not limited to pallet
            jacks, ramps, hand trucks, trucks, liftgates, and accessories. Big
            Joe electric pallet jacks are restricted to truck use only and may
            not be used inside the warehouse. Drivers must charge and secure
            equipment daily. Warehouse personnel must ensure units remain
            plugged in when closing the facility. Any payroll deductions related
            to equipment damage will comply with federal and state wage laws and
            require proper written authorization.
          </Text>
        </View>
        <View wrap={false}>
          <Text style={styles.sectionTitle}>
            5. GPS & Vehicle Monitoring Consent
          </Text>
          <Text style={styles.contentText}>
            All company vehicles are subject to GPS tracking, telematics
            systems, safety monitoring, and route oversight. Employees
            acknowledge there is no expectation of privacy while operating
            company vehicles.
          </Text>
        </View>

        <View wrap={false}>
          <Text style={styles.sectionTitle}>6. Safety & Cell Phone Policy</Text>
          <Text style={styles.contentText}>
            Cell phone use is strictly prohibited while operating a company
            vehicle. This includes calls, texting, social media, or any handheld
            device usage. Cell phone use is not permitted while working inside
            the warehouse except during designated break periods.
          </Text>
        </View>
        <View wrap={false}>
          <Text style={styles.sectionTitle}>
            7. Training & Uniform Repayment Agreement
          </Text>
          <Text style={styles.contentText}>
            If Jimenez Produce pays for CDL training, CDL testing fees, or DOT
            Medical Card costs, the employee agrees to remain employed for at
            least one (1) year from the date the CDL is obtained and training is
            completed. If employment ends before one year, the full amount paid
            may be deducted from the final paycheck, as permitted by law. If
            uniforms are provided at no cost, the employee agrees to remain
            employed for at least six (6) months from the employee’s start date.
            If employment ends before six months, the cost of uniforms may be
            deducted from the final paycheck, as permitted by law.
          </Text>
        </View>
        <View wrap={false}>
          <Text style={styles.sectionTitle}>
            8. Confidentiality & Non-Solicitation
          </Text>
          <Text style={styles.contentText}>
            Employees may not disclose pricing information, customer lists,
            internal systems, alarm codes, lockbox codes, or other confidential
            company information. Sales employees agree not to solicit company
            customers or employees for twelve (12) months following separation
            from employment.
          </Text>
        </View>

        <View wrap={false}>
          <Text style={[styles.sectionTitle, { color: COLORS.main }]}>
            EMPLOYEE ACKNOWLEDGMENT & CONSENT
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Employee Full Legal Name</Text>
            <Text style={styles.value}>{data.applicantName}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Position</Text>
            <Text style={styles.value}>{data.position}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Facility</Text>
            <Text style={styles.value}>{data.location}</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Date Signed</Text>
            <Text style={styles.value}>
              {format(data.agreementDate, "MMMM dd, yyyy")}
            </Text>
          </View>
          <View>
            {data.signatureUrl && (
              <Image src={data.signatureUrl} style={styles.signatureImage} />
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
