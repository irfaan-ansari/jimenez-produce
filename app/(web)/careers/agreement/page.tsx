import Image from "next/image";
import { getJobApplication } from "@/server/job";
import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { JobAgreementButton } from "@/components/job-forms/job-agreement-button";
import { format } from "date-fns";

const Agreement = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const { token } = await searchParams;
  const { data, success, error } = await getJobApplication(token);
  if (!success) throw new Error(error.message);
  const { name, position, facility, signatureUrl } = data;
  return (
    <>
      {/* page title*/}
      <section className="py-16 bg-highlight text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Employee Onboarding & Policy Acknowledgment Packet
              </h2>
              <p className="text-lg">
                This document outlines employment terms, safety requirements,
                compliance obligations, equipment accountability standards, and
                workplace expectations for all employees of Jimenez Produce LLC.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section className="my-16">
        <Container className="max-w-4xl">
          <Card className="shadow-sm text-base">
            <CardContent>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                1. Employment Relationship
              </h4>
              <p className="my-4">
                Employment with Jimenez Produce LLC is at-will. Either the
                employee or the company may terminate employment at any time,
                with or without cause or notice, subject to applicable law.
                Nothing in this document creates a contract of employment. All
                employees are subject to a 90-day introductory period during
                which performance, reliability, and adherence to company
                policies will be evaluated.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                2. Drug, Alcohol & Screening Authorization
              </h4>
              <p className="my-4">
                Employees consent to pre-employment, post-accident, reasonable
                suspicion, and when applicable, random drug and alcohol testing.
                By signing this document, you authorize Jimenez Produce LLC to
                conduct criminal background checks, obtain Motor Vehicle Reports
                (MVR), verify employment history, conduct drug testing, and
                perform FMCSA Drug & Alcohol Clearinghouse queries as required
                by law.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                3. FMCSA Clearinghouse (CDL Drivers)
              </h4>
              <p className="my-4">
                CDL drivers authorize annual limited queries of the FMCSA Drug &
                Alcohol Clearinghouse. If a record exists, the driver must
                provide electronic consent for a full query within 24 hours in
                accordance with 49 CFR §382.703(c). Failure to comply will
                result in removal from safety-sensitive duties.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                4. Equipment Responsibility & Big Joe Policy
              </h4>
              <p className="my-4">
                Employees are responsible for the proper care and protection of
                all assigned company equipment, including but not limited to
                pallet jacks, ramps, hand trucks, trucks, liftgates, and
                accessories. Big Joe electric pallet jacks are restricted to
                truck use only and may not be used inside the warehouse. Drivers
                must charge and secure equipment daily. Warehouse personnel must
                ensure units remain plugged in when closing the facility. Any
                payroll deductions related to equipment damage will comply with
                federal and state wage laws and require proper written
                authorization.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                5. GPS & Vehicle Monitoring Consent
              </h4>
              <p className="my-4">
                All company vehicles are subject to GPS tracking, telematics
                systems, safety monitoring, and route oversight. Employees
                acknowledge there is no expectation of privacy while operating
                company vehicles.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                6. Safety & Cell Phone Policy
              </h4>
              <p className="my-4">
                Cell phone use is strictly prohibited while operating a company
                vehicle. This includes calls, texting, social media, or any
                handheld device usage. Cell phone use is not permitted while
                working inside the warehouse except during designated break
                periods.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                7. Training & Uniform Repayment Agreement
              </h4>
              <p className="my-4">
                If Jimenez Produce pays for CDL training, CDL testing fees, or
                DOT Medical Card costs, the employee agrees to remain employed
                for at least one (1) year from the date the CDL is obtained and
                training is completed. If employment ends before one year, the
                full amount paid may be deducted from the final paycheck, as
                permitted by law. If uniforms are provided at no cost, the
                employee agrees to remain employed for at least six (6) months
                from the employee’s start date. If employment ends before six
                months, the cost of uniforms may be deducted from the final
                paycheck, as permitted by law.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                8. Confidentiality & Non-Solicitation
              </h4>
              <p className="my-4">
                Employees may not disclose pricing information, customer lists,
                internal systems, alarm codes, lockbox codes, or other
                confidential company information. Sales employees agree not to
                solicit company customers or employees for twelve (12) months
                following separation from employment.
              </p>
              <h4 className="text-4xl font-semibold font-heading uppercase mt-4">
                EMPLOYEE ACKNOWLEDGMENT & CONSENT
              </h4>
              <div className="my-6 space-y-2 relative">
                <p>Employee Full Legal Name: {name}</p>
                <p>Position: {position}</p>
                <p>Facility: {facility}</p>

                <p>Date: {format(new Date(), "MMMM dd, yyyy")}</p>

                <p>Signature:</p>
                <Image
                  width={200}
                  height={200}
                  src={signatureUrl}
                  className="w-52 h-auto object-contain object-left absolute right-0 bottom-0"
                  alt="Signature"
                />
              </div>
              <JobAgreementButton token={token} />
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Agreement;
