import { EmailTemplate } from "./email-template";
import { Section, Text, Button } from "@react-email/components";

interface JobAgreementProps {
  name: string;
  email: string;
  position: string;
}

export const JobAgreement = ({ name, email, position }: JobAgreementProps) => {
  return (
    <EmailTemplate
      template="customer"
      heading="Next Steps – Employment Application"
    >
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in the{" "}
          <span className="font-semibold inline-block uppercase">
            {position}
          </span>{" "}
          position with Jimenez Produce.
        </Text>

        <Text className="text-lg mt-4">
          We are pleased to move forward with your application. Please complete
          the required onboarding steps through our secure portal.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Required Onboarding Steps
          </Text>

          <Text className="text-lg mt-2">
            <strong>*</strong> Complete and sign all employment documents
            <br />
            <strong>*</strong> Review and sign company agreements (PDF required)
            <br />
            <strong>*</strong> Submit identification documents
            <br />
            <strong>*</strong> Provide consent for background screening
          </Text>

          <Button
            href={`https://jimenezproduce.com/onboarding?applicant=${email}`}
            target="_blank"
            className="bg-[#80b83a] p-4 text-white uppercase text-sm font-semibold text-center justify-center flex items-center mt-6"
          >
            Complete Onboarding
          </Button>
        </Section>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Important Notice
          </Text>

          <Text className="text-lg mt-2">
            Employment is contingent upon successful completion of:
            <br />
            <strong>*</strong> Background check
            <br />
            <strong>*</strong> Verification of eligibility to work
            <br />
            <strong>*</strong> Signed company policies and agreements
          </Text>
        </Section>

        <Text className="font-semibold text-lg mt-6">
          We look forward to welcoming you to the team.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default JobAgreement;
