import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface JobAppliedProps {
  name: string;
  position: string;
}

export const JobApplied = ({ name, position }: JobAppliedProps) => {
  return (
    <EmailTemplate template="customer" heading="Application Received">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-lg">
          Thank you for applying for the{" "}
          <span className="font-semibold inline-block uppercase">
            {position}
          </span>{" "}
          position with Jimenez Produce.
        </Text>

        <Text className="text-lg mt-4">
          We have successfully received your application, and our team will
          carefully review your qualifications and submitted documents.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            What Happens Next
          </Text>

          <Text className="text-lg">
            <strong>*</strong> Our Human Resources team will evaluate your
            experience and credentials
            <br />
            <strong>*</strong> Qualified candidates will be contacted for the
            next step in the hiring process
            <br />
            <strong>*</strong> Please ensure your contact information remains up
            to date
          </Text>
        </Section>

        <Text className="text-lg mt-6">
          We sincerely appreciate your interest in joining our team and look
          forward to reviewing your application.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default JobApplied;
