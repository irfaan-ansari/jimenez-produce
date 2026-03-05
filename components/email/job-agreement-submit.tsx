import { EmailTemplate } from "./email-template";
import { Section, Text, Hr, Button } from "@react-email/components";

interface InternalAgreementNotificationProps {
  name: string;
  email: string;
  position: string;
  facility: string;
  submittedAt: string;
  agreementUrl: string;
}

export const InternalAgreementNotification = ({
  name,
  email,
  position,
  facility,
  submittedAt,
  agreementUrl,
}: InternalAgreementNotificationProps) => {
  return (
    <EmailTemplate template="admin" heading="Agreement Submitted">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Attention HR / Management,
        </Text>

        <Text className="text-lg">
          A new **Employment Agreement & Policy Acknowledgment** has been
          electronically signed and submitted.
        </Text>

        {/* SUMMARY CARD */}
        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="uppercase font-bold text-[#80b83a] mb-4">
            Submission Details
          </Text>

          <Text className="text-base mb-1">
            <strong>Employee Name:</strong> {name}
          </Text>
          <Text className="text-base mb-1">
            <strong>Position:</strong>{" "}
            <span className="uppercase">{position}</span>
          </Text>
          <Text className="text-base mb-1">
            <strong>Facility:</strong> {facility}
          </Text>
          <Text className="text-base mb-1">
            <strong>Email:</strong> {email}
          </Text>
          <Text className="text-base mb-1">
            <strong>Date Signed:</strong> {submittedAt}
          </Text>

          <Hr className="border-[#e2e8f0] my-4" />

          <Text className="text-sm text-[#64748b] mb-4">
            The signed PDF has been generated and is now available in the admin
            dashboard for review.
          </Text>
        </Section>

        <Button
          href={agreementUrl}
          target="_blank"
          className="bg-[#80b83a] mt-6 p-4 text-white uppercase text-sm font-semibold text-center"
        >
          View Agreement
        </Button>

        <Section className="mt-8 p-4 bg-[#fff7ed] border-l-4 border-[#f97316]">
          <Text className="text-sm">
            <strong>Action Required:</strong> Please verify the signature and
            ensure all identification documents provided match the legal name on
            the agreement before finalizing the onboarding.
          </Text>
        </Section>

        <Text className="text-xs text-[#94a3b8] mt-10">
          This is an automated internal notification from the Jimenez Produce
          Onboarding System.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default InternalAgreementNotification;
