import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";
import { Header } from "./header";

interface Props {
  name: string;
  companyName: string;
  reason: string; // Short reason for hold
  detailedReason: string; // Detailed explanation
  internalNotes?: string; // Notes for internal use
  reviewLink?: string; // Link to admin dashboard to review
}

export const CustomerHoldAdmin = ({
  name,
  companyName,
  reason,
  detailedReason,
  internalNotes,
}: Props) => {
  const previewText = `Application on Hold – ${
    companyName || "Unknown Company"
  }`;

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto px-4 font-sans bg-white">
          <Preview>{previewText}</Preview>

          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea]  overflow-hidden">
            {/* Header */}
            <Header />

            <Section className="px-6 py-6">
              <Hr className="m-0" />

              <Heading className="text-2xl my-6 text-black font-bold">
                Customer Application on Hold
              </Heading>

              <Text className="text-base text-[#404040] mb-4">
                A customer account application has been placed on hold. Below
                are the details:
              </Text>

              {/* Applicant Info Card */}
              <Section className="bg-[#fff4e5] border border-[#f3d192] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-1">
                  Officer Name:
                </Text>
                <Text className="text-base text-[#404040] mb-2">
                  {name || "N/A"}
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Company Name:
                </Text>
                <Text className="text-base text-[#404040] mb-2">
                  {companyName || "N/A"}
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Reason for Hold:
                </Text>
                <Text className="text-base text-[#404040] mb-2">{reason}</Text>

                <Text className="text-base font-semibold mb-1">
                  Detailed Explanation:
                </Text>
                <Text className="text-base text-[#404040]">
                  {detailedReason}
                </Text>
              </Section>

              {/* Internal Notes Card */}
              {internalNotes && (
                <Section className="bg-[#e8f0fe] border border-[#4285f4] rounded-lg p-4 mb-6">
                  <Text className="text-base font-semibold mb-1 text-[#1a73e8]">
                    Internal Notes:
                  </Text>
                  <Text className="text-base text-[#333333]">
                    {internalNotes}
                  </Text>
                </Section>
              )}

              <Text className="text-base text-[#404040] mt-6">
                Please review the application in the admin dashboard and take
                necessary action. Ensure that all required information is
                collected from the applicant before approval.
              </Text>

              <Text className="text-sm mt-10 text-[#888888]">
                ⚠ This is an internal notification for Jimenez Produce admin
                staff only. Do not forward to customers. Use the admin dashboard
                to review applications.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerHoldAdmin;
