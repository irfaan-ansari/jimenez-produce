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

interface CustomerHoldProps {
  name: string;
  companyName: string;
  reason: string;
  detailedReason: string;
}

export const CustomerHold = ({
  name,
  companyName,
  reason,
  detailedReason,
}: CustomerHoldProps) => {
  const previewText = `Application on Hold – Jimenez Produce`;

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
          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea] border-solid overflow-hidden">
            {/* Header */}
            <Header />

            {/* Body */}
            <Section className="px-6 py-6">
              <Hr className="m-0" />

              <Heading className="text-2xl my-6 text-black font-bold">
                Application on Hold
              </Heading>

              <Text className="text-base text-black font-semibold mb-2">
                Hello {name || "Applicant"},
              </Text>

              <Text className="text-base text-[#404040] mb-4">
                Thank you for submitting your application for{" "}
                <strong>{companyName}</strong>.
                <br />
                <br />
                Your application is currently{" "}
                <span className="text-[#ffa500] uppercase font-semibold">
                  on hold
                </span>{" "}
                due to the following reason:
              </Text>

              {/* Hold Reason Card */}
              <Section className="bg-[#fff4e5] border border-[#f3d192] rounded-md p-4 mb-6">
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

              <Text className="text-base text-[#404040] mb-4">
                Once we receive the requested information, your application will
                be reviewed and processed within 24–48 business hours.
              </Text>

              <Text className="text-base text-[#404040] mb-4">
                If you have any questions, please contact our Customer Accounts
                Department for assistance.
              </Text>

              <Text className="text-base mt-10 text-[#404040]">
                Best regards,
                <br />
                <strong className="text-black">Jimenez Produce</strong>
                <br />
                Customer Accounts Department
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerHold;
