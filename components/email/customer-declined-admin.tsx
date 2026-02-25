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
} from "@react-email/components";
import { Header } from "./header";

interface Props {
  name: string;
  companyName: string;
  reason?: string; // Short reason for decline
  detailedReason?: string; // Detailed explanation
  internalNotes?: string; // Admin-only notes
}

export const CustomerDeclinedAdmin = ({
  name,
  companyName,
  reason,
  detailedReason,
  internalNotes,
}: Props) => {
  const previewText = `Application Declined – Admin Notification`;

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

          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea] overflow-hidden">
            {/* Header */}
            <Header />

            {/* Body */}
            <Section className="px-6">
              <Hr className="m-0" />

              <Heading className="text-2xl my-6 text-black font-bold">
                Customer Application Declined
              </Heading>

              <Text className="text-base text-[#404040] mb-4">
                A customer account application has been declined. Details are
                below:
              </Text>

              {/* Applicant Info Card */}
              <Section className="bg-[#f9f0f0] border border-[#f7b8b8] rounded-md p-4 mb-6">
                <Text className="text-base font-semibold mb-1">
                  Applicant Name:
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

                <Text className="text-base font-semibold mb-1 text-[#b91c1c]">
                  Reason: {reason}
                </Text>

                <Text className="text-base text-[#404040] mb-2">
                  {detailedReason}
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Internal Notes:
                </Text>
                <Text className="text-base text-[#404040] mb-2">
                  {internalNotes}
                </Text>
              </Section>

              <Text className="text-sm mt-10 text-[#888888]">
                ⚠ This is an internal notification for Jimenez Produce admin
                staff only. Do not forward to customers.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerDeclinedAdmin;
