import { Section, Text } from "@react-email/components";

import { EmailTemplate } from "./email-template";

interface Props {
  name: string;
  reason: string;
  reasonDetails: string;
}

export const CustomerHold = ({ name, reason, reasonDetails }: Props) => {
  return (
    <EmailTemplate template="customer" heading="Application On-Hold">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          Your application is currently on hold pending additional information.
        </Text>

        <Section className="border border-[#f4f5f6] p-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Reason: {reason}
          </Text>
          <Text className="text-lg">{reasonDetails}</Text>
        </Section>

        <Text className="text-lg">
          Once received, applications are typically processed within 24–48
          business hours.
          <br />
          If you have any questions, please contact our accounts department.
        </Text>
        <Text className="font-semibold text-lg">
          We look forward to completing your application.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default CustomerHold;
