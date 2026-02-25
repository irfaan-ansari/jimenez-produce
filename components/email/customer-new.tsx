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
}

export const CustomerNew = ({ name, companyName }: Props) => {
  const previewText = `Your Application to Jimenez Produce Has Been Received`;

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

          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea] border-solid">
            <Header />
            <Section className="px-6 py-6">
              <Hr className="my-0" />
              <Heading className="text-2xl mb-6 text-black font-bold">
                Application Received
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name || "Applicant"},
              </Text>

              <Text className="text-base text-[#404040] mt-2">
                Thank you for submitting your account application with{" "}
                <strong>Jimenez Produce</strong>, your trusted fresh produce
                distributor.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-1">
                  Officer Name:
                </Text>
                <Text className="text-base text-[#404040] mb-2">
                  {name || "N/A"}
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Company Name:
                </Text>
                <Text className="text-base text-[#404040]">
                  {companyName || "N/A"}
                </Text>
              </Section>

              <Text className="text-base text-[#404040] mt-2">
                Our Customer Accounts Department has received your application
                and will review it within 24–48 business hours.
              </Text>

              <Hr className="my-6" />

              <Text className="text-base font-semibold mb-2">Next Steps:</Text>

              <Text className="text-base mt-0 text-[#404040]">
                • Our team reviews your submitted documentation. <br />
                • Once approved, you will receive a confirmation email. <br />•
                After approval, you can start placing orders for fresh produce,
                dairy, beverages, dry goods, and specialty foodservice items.
              </Text>
              <Hr className="my-6" />

              <Text className="text-base mt-6 text-[#404040]">
                We distribute produce, dairy, dry goods, beverages, and
                specialty foodservice products throughout the Gulf Coast region.
                <br />
                <br />
                <strong>We look forward to reviewing your application.</strong>
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

export default CustomerNew;
