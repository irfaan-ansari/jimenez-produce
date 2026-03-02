import { Section, Text } from "@react-email/components";

import { EmailTemplate } from "./email-template";

interface Props {
  name: string;
  company: string;
  reason: string;
  reasonDetails: string;
}

export const CustomerDeclined = ({ name, reason, reasonDetails }: Props) => {
  return (
    <EmailTemplate template="customer" heading="Application Declined">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          After reviewing your application, we regret to inform you that we are
          unable to approve the account at this time.
        </Text>

        <Section className="border border-[#f4f5f6] p-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Reason: {reason}
          </Text>
          <Text className="text-lg">{reasonDetails}</Text>
        </Section>

        <Text className="text-lg">
          If you believe additional information may assist in reconsideration,
          please reply to this email or contact our office.
        </Text>
        <Text className="font-semibold text-lg">
          We appreciate your interest and wish you continued success.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default CustomerDeclined;
