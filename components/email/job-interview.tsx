import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface JobInterviewProps {
  name: string;
  position: string;
  details: string;
}

export const JobInterview = ({
  name,
  position,
  details,
}: JobInterviewProps) => {
  return (
    <EmailTemplate template="customer" heading="Interview Invitation">
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
          We are pleased to inform you that you have been selected to advance to
          the interview stage of our hiring process.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Additional Details:
          </Text>

          <Text className="text-lg mt-2">{details}</Text>
        </Section>

        <Text className="text-lg mt-6">
          Please review the above details carefully. If you have any questions
          or require clarification, do not hesitate to contact our Human
          Resources department.
        </Text>

        <Text className="font-semibold text-lg mt-6">
          We look forward to speaking with you and learning more about your
          experience.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default JobInterview;
