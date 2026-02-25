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

export const JobApplied = ({
  name,
  position,
}: {
  name: string;
  position: string;
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
                Application Received – Jimenez Produce
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name},
              </Text>

              <Text className="text-base">
                Thank you for applying for the <strong>{position}</strong>{" "}
                position with Jimenez Produce.
              </Text>

              <Text className="text-base">
                We have successfully received your application and our team will
                carefully review your qualifications and submitted documents.
              </Text>

              <Text className="text-base font-semibold">
                We appreciate your interest in joining Jimenez Produce and look
                forward to reviewing your application.
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

export default JobApplied;
