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

interface Props {
  name: string;
  companyName: string;
}

export const CustomerApprovedAdmin = ({ name, companyName }: Props) => {
  const previewText = `Customer Application Approved`;

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
              <Text className="text-base text-[#404040] mb-4">
                A customer account application has been approved. Details are
                below:
              </Text>

              <Section className="shadow-sm p-6">
                <Text className="text-lg mt-0 uppercase font-semibold text-[#80b83a]">
                  Account Summary
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Applicant Name:
                </Text>
                <Text className="text-lg font-semibold mb-2">
                  {name || "N/A"}
                </Text>

                <Text className="text-base font-semibold mb-1">
                  Company Name:
                </Text>
                <Text className="text-lg font-semibold mb-2">
                  {companyName || "N/A"}
                </Text>

                <Text className="text-lg font-semibold">
                  Phone: {companyName || "Company Name"}
                </Text>
                <Text className="text-lg font-semibold">
                  Email: {companyName || "Company Name"}
                </Text>
                <Text className="text-lg font-semibold">
                  Address: {companyName || "Company Name"}
                </Text>

                <Text className="text-lg font-semibold">
                  Primary Contact: {companyName || "Company Name"}
                </Text>
                <Text className="text-lg font-semibold">
                  Primary Contact: {companyName || "Company Name"}
                </Text>
              </Section>

              <Text className="text-sm mt-10 text-[#888888]">
                This is an internal notification for Jimenez Produce admin staff
                only. Do not forward to customers.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerApprovedAdmin;
