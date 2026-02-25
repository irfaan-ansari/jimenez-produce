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
  companyName?: string;
}

export const CustomerNewAdmin = ({ name, companyName }: Props) => {
  const previewText = `New Customer Application Submitted`;

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
              <Hr className="m-0" />

              <Heading className="text-2xl mb-6 text-black font-bold">
                New Customer Application Submitted
              </Heading>

              <Text className="text-base text-[#404040] mb-4">
                A new customer account application has been submitted:
              </Text>

              {/* Card for Applicant Info */}
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

              <Text className="text-base mt-6 text-[#404040]">
                Please review the submitted application in the admin dashboard
                and take necessary actions for approval.
              </Text>

              <Text className="text-sm mt-10 text-[#888888]">
                This is an internal notification for Jimenez Produce admin staff
                only. Do not forward to customers. Access the admin dashboard to
                review applications.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerNewAdmin;
