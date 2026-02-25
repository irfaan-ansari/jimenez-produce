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

interface CustomerApprovedProps {
  name: string;
  position: string;
  details: string;
}

export const JobInterview = ({
  name,
  position,
  details,
}: CustomerApprovedProps) => {
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
                Interview Schedule
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name},
              </Text>
              <Text className="text-base">
                Thank you for your interest in the {position} position with
                Jimenez Produce.
              </Text>
              <Text className="text-base">
                We are pleased to inform you that you have been selected to move
                forward to the interview stage of our hiring process.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">
                  Interview Details:
                </Text>
                <Text className="text-base mt-0">{details}</Text>
              </Section>

              <Text className="text-base font-semibold">
                We look forward to speaking with you and learning more about
                your experience.
              </Text>
              <Text className="text-base mt-10 text-[#404040]">
                Sincerely,
                <br />
                <strong className="text-black"> Jimenez Produce</strong>
                <br />
                HR Department
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default JobInterview;
