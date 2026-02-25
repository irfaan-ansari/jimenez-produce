import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Header } from "./header";

export const JobRejected = ({
  name,
  position,
  reason,
  detailedReason,
}: {
  name: string;
  position: string;
  reason: string;
  detailedReason: string;
}) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto px-4 font-sans bg-white">
          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea] border-solid">
            {/* header */}
            <Header />

            {/* body */}
            <Section className="px-6">
              <Hr className="m-0" />
              <Heading className="text-2xl my-6 text-black font-bold">
                Application Status – Jimenez Produce
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name},
              </Text>
              <Text className="text-base">
                Thank you for your interest in the {position} position with
                Jimenez Produce.
              </Text>
              <Text className="text-base">
                After careful consideration, we have decided to move forward
                with other candidates at this time.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">Reason:</Text>
                <Text className="text-base mt-0">{reason}</Text>
                <Text className="text-base font-semibold mb-2">Details:</Text>
                <Text className="text-base mt-0">{detailedReason}</Text>
              </Section>

              <Text className="text-base">
                We appreciate the time you invested in applying and encourage
                you to apply for future openings that match your qualifications.
              </Text>
              <Text className="text-base font-semibold">
                We wish you the best in your continued career pursuits.
              </Text>
              <Text className="text-base mt-10 text-[#404040]">
                Respectfully,
                <br />
                <strong className="text-black"> Jimenez Produce</strong>
                <br />
                Human Resources
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default JobRejected;
