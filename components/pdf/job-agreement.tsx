import { createTw } from "react-pdf-tailwind";
import { Document, Page, Text, View } from "@react-pdf/renderer";

export const JobAgreementPDF = ({ name }: { name: string }) => {
  const tw = createTw({
    theme: {
      fontFamily: {
        sans: "Helvetica",
      },
    },
  });

  return (
    <Document
      title="Employee Onboarding Packet"
      author="Jimenez Produce LLC"
      creator="Jimenez Produce LLC"
      producer="Jimenez Produce LLC"
    >
      <Page size="A4" style={tw("p-10 text-[11px] font-sans leading-relaxed")}>
        {/* Header */}
        <View style={tw("mb-6 text-center")}>
          <Text style={tw("text-xl font-bold")}>JIMENEZ PRODUCE LLC</Text>
          <Text style={tw("text-base font-semibold mt-1")}>
            Employee Onboarding & Policy Acknowledgment Packet
          </Text>
        </View>

        <Text style={tw("mb-4")}>
          This document outlines employment terms, safety requirements,
          compliance obligations, equipment accountability standards, and
          workplace expectations for all employees of Jimenez Produce LLC.
        </Text>

        {/* SECTION 1 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 1 – Employment Relationship
        </Text>
        <Text style={tw("mb-3")}>
          Employment with Jimenez Produce LLC is at-will. Either the employee or
          the company may terminate employment at any time, with or without
          cause or notice, subject to applicable law. Nothing in this document
          creates a contract of employment.
        </Text>
        <Text style={tw("mb-3")}>
          All employees are subject to a 90-day introductory period during which
          performance, reliability, and adherence to company policies will be
          evaluated.
        </Text>

        {/* SECTION 2 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 2 – Drug, Alcohol & Screening Authorization
        </Text>
        <Text style={tw("mb-3")}>
          Employees consent to pre-employment, post-accident, reasonable
          suspicion, and when applicable, random drug and alcohol testing.
        </Text>
        <Text style={tw("mb-3")}>
          By signing this document, you authorize Jimenez Produce LLC to conduct
          criminal background checks, obtain Motor Vehicle Reports (MVR), verify
          employment history, conduct drug testing, and perform FMCSA Drug &
          Alcohol Clearinghouse queries as required by law.
        </Text>

        {/* SECTION 3 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 3 – FMCSA Clearinghouse (CDL Drivers)
        </Text>
        <Text style={tw("mb-3")}>
          CDL drivers authorize annual limited queries of the FMCSA Drug &
          Alcohol Clearinghouse. If a record exists, the driver must provide
          electronic consent for a full query within 24 hours in accordance with
          49 CFR §382.703(c). Failure to comply will result in removal from
          safety-sensitive duties.
        </Text>

        {/* SECTION 4 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 4 – Equipment Responsibility & Big Joe Policy
        </Text>
        <Text style={tw("mb-3")}>
          Employees are responsible for the proper care and protection of all
          assigned company equipment, including but not limited to pallet jacks,
          ramps, hand trucks, trucks, liftgates, and accessories.
        </Text>
        <Text style={tw("mb-3")}>
          Big Joe electric pallet jacks are restricted to truck use only and may
          not be used inside the warehouse. Drivers must charge and secure
          equipment daily. Warehouse personnel must ensure units remain plugged
          in when closing the facility.
        </Text>
        <Text style={tw("mb-3")}>
          Any payroll deductions related to equipment damage will comply with
          federal and state wage laws and require proper written authorization.
        </Text>

        {/* SECTION 5 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 5 – GPS & Vehicle Monitoring Consent
        </Text>
        <Text style={tw("mb-3")}>
          All company vehicles are subject to GPS tracking, telematics systems,
          safety monitoring, and route oversight. Employees acknowledge there is
          no expectation of privacy while operating company vehicles.
        </Text>

        {/* SECTION 6 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 6 – Safety & Cell Phone Policy
        </Text>
        <Text style={tw("mb-3")}>
          Cell phone use is strictly prohibited while operating a company
          vehicle. This includes calls, texting, social media, or any handheld
          device usage.
        </Text>
        <Text style={tw("mb-3")}>
          Cell phone use is not permitted while working inside the warehouse
          except during designated break periods.
        </Text>

        {/* SECTION 7 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 7 – Training & Uniform Repayment Agreement
        </Text>
        <Text style={tw("mb-3")}>
          If Jimenez Produce pays for CDL training, CDL testing fees, or DOT
          Medical Card costs, the employee agrees to remain employed for at
          least one (1) year from the date the CDL is obtained and training is
          completed. If employment ends before one year, the full amount paid
          may be deducted from the final paycheck, as permitted by law.
        </Text>
        <Text style={tw("mb-3")}>
          If uniforms are provided at no cost, the employee agrees to remain
          employed for at least six (6) months from the employee’s start date.
          If employment ends before six months, the cost of uniforms may be
          deducted from the final paycheck, as permitted by law.
        </Text>

        {/* SECTION 8 */}
        <Text style={tw("font-bold mt-4 mb-2")}>
          SECTION 8 – Confidentiality & Non-Solicitation
        </Text>
        <Text style={tw("mb-6")}>
          Employees may not disclose pricing information, customer lists,
          internal systems, alarm codes, lockbox codes, or other confidential
          company information. Sales employees agree not to solicit company
          customers or employees for twelve (12) months following separation
          from employment.
        </Text>

        {/* Acknowledgment */}
        <Text style={tw("font-bold mt-6 mb-4 text-center")}>
          EMPLOYEE ACKNOWLEDGMENT & CONSENT
        </Text>

        <Text style={tw("mb-4")}>
          Employee Full Legal Name: {name}
          __________________________________________
        </Text>

        <Text style={tw("mb-4")}>
          Position: ___________________________________________________________
        </Text>

        <Text style={tw("mb-4")}>
          Facility (circle one): Robertsdale, AL / Lafayette, LA
        </Text>

        <Text style={tw("mb-4")}>
          Signature: __________________________________________________________
        </Text>

        <Text>
          Date: ______________________________________________________________
        </Text>
      </Page>
    </Document>
  );
};
