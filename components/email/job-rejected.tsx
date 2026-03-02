import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface JobRejectedProps {
  name: string;
  position: string;
  reason: string;
  detailedReason: string;
}

export const JobRejected = ({
  name,
  position,
  reason,
  detailedReason,
}: JobRejectedProps) => {
  return (
    <EmailTemplate template="customer" heading="Application Status Update">
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
          After careful consideration, we regret to inform you that we will not
          be moving forward with your application at this time.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Application Review Summary
          </Text>

          <Text className="text-lg mt-2 font-semibold">Reason:</Text>
          <Text className="text-lg mt-1">{reason}</Text>

          {detailedReason && (
            <Text className="text-lg mt-1">{detailedReason}</Text>
          )}
        </Section>

        <Text className="text-lg mt-6">
          We sincerely appreciate the time and effort you invested in your
          application. We encourage you to apply for future opportunities that
          align with your qualifications and experience.
        </Text>

        <Text className="font-semibold text-lg mt-6">
          We wish you continued success in your professional endeavors.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default JobRejected;
