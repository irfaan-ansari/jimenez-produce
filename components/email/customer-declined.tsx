import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";
import { Header } from "./header";

interface CustomerApplicationDeclinedProps {
  name: string;
  companyName: string;
  reason: string; // Short reason for decline
  detailedReason: string; // Detailed explanation
}

export const CustomerApplicationDeclined = ({
  name,
  companyName,
  reason,
  detailedReason,
}: CustomerApplicationDeclinedProps) => {
  const previewText = `Application Declined – Jimenez Produce`;

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
                Application Declined
              </Heading>

              <Text className="text-base text-black font-semibold mb-2">
                Hello {name || "Valued Customer"},
              </Text>

              <Text className="text-base text-[#404040]">
                Thank you for your interest in opening an account with Jimenez
                Produce.
              </Text>

              <Text className="text-base text-[#404040]">
                After reviewing your application, we regret to inform you that
                we are unable to approve your account for{" "}
                <strong>{companyName}</strong> at this time.
              </Text>

              {/* Reason & Detailed Reason Card */}
              <Section className="bg-[#f9f0f0] border border-[#f7b8b8] rounded-md p-4 mb-6">
                {reason && (
                  <Text className="text-base font-semibold mb-2 text-[#b91c1c]">
                    Reason: {reason}
                  </Text>
                )}
                {detailedReason && (
                  <Text className="text-base text-[#404040]">
                    {detailedReason}
                  </Text>
                )}
              </Section>

              {/* Original content */}
              <Text className="text-base text-[#404040] mb-4">
                If you believe additional information may assist in
                reconsideration, please reply to this email or contact our
                office.
                <br />
                <br />
                We appreciate your interest and wish you continued success.
              </Text>

              <Text className="text-base mt-10 text-[#404040]">
                Respectfully,
                <br />
                <strong className="text-black">Jimenez Produce</strong>
                <br />
                Accounts Department
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerApplicationDeclined;
