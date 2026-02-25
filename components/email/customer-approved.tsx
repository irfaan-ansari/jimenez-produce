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

interface CustomerApprovedProps {
  name: string;
  companyName: string;
}

export const CustomerApproved = ({
  name,
  companyName,
}: CustomerApprovedProps) => {
  const previewText = `We are pleased to inform you that your account application has been approved`;

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
                Application Approved
              </Heading>

              <Text className="text-base text-black font-semibold mb-2">
                Hello {name || "Valued Customer"},
              </Text>

              <Text className="text-base text-[#404040] mb-4">
                We are pleased to inform you that your account application for{" "}
                <strong>{companyName}</strong> has been approved.
              </Text>

              <Text className="text-base font-semibold my-4">
                Your account is now active in our system.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2 mt-6">
                  Ordering Information:
                </Text>
                <Text className="text-base text-[#404040] mb-4">
                  <strong>*</strong> Orders must be placed the day before
                  delivery
                  <br />
                  <strong>*</strong> Daily cutoff time: 3:00 PM
                  <br />
                  <strong>*</strong> Deliveries are made the following scheduled
                  delivery day
                  <br />
                  <strong>*</strong> Orders placed after 3:00 PM will move to
                  the next available delivery date
                </Text>
              </Section>
              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">
                  You may now begin placing orders through:
                </Text>
                <Text className="text-base text-[#404040] mb-4">
                  * Your assigned sales representative
                  <br />* Our online ordering portal
                </Text>

                <Button
                  href="https://order.jimenezproduce.com"
                  target="_blank"
                  className="bg-[#80b83a] rounded-lg px-4 text-white uppercase text-sm font-semibold inline-flex items-center h-10 mb-4"
                >
                  Place Your Order
                </Button>
              </Section>
              <Text className="text-base text-[#404040] mb-4">
                If you have any questions regarding pricing, delivery schedule,
                or product availability, please contact our team.
                <br />
                <br />
                <strong>We look forward to serving your business.</strong>
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

export default CustomerApproved;
