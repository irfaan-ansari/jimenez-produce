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
  Button,
} from "@react-email/components";
import { Header } from "./header";

interface CustomerApprovedProps {
  name?: string;
  email: string;
  position?: string;
}

export const JobAgreement = ({
  name,
  email,
  position,
}: CustomerApprovedProps) => {
  const previewText = ` Next Steps – Employment Application`;

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
            {/* header */}
            <Header />

            {/* body */}
            <Section className="px-6">
              <Hr className="m-0" />
              <Heading className="text-2xl my-6 text-black font-bold">
                Next Steps – Employment Application
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name},
              </Text>
              <Text className="text-base text-[#404040]">
                Thank you for your interest in the {position} position with
                Jimenez Produce.
                <br />
                We would like to move forward with your application.
                <br />
              </Text>

              <Text className="text-base text-[#404040]">
                Please complete the onboarding steps through the portal:
              </Text>

              <Button
                href={`https://jimenezproduce.com/onboarding?applicant=${email}`}
                target="_blank"
                className="bg-[#80b83a] rounded-lg px-4 text-white uppercase text-sm font-semibold inline-flex items-center h-10 mb-4"
              >
                Completed onboarding
              </Button>

              <Text className="text-base font-semibold mb-2">
                Required Steps:
              </Text>
              <Text className="text-base mt-0">
                * Complete and sign all employment documents
                <br />
                * Review and sign company agreements (PDF required)
                <br />
                * Submit identification documents <br />* Consent to background
                screening
              </Text>

              <Text className="text-base">
                <strong>Please note:</strong> Employment is contingent upon
                successful completion
              </Text>
              <Text className="text-base mt-0">
                * Background check
                <br />
                * Verification of eligibility to work
                <br />* Signed company policies and agreements delivery day
              </Text>
              <Text className="text-base font-semibold">
                We look forward to welcoming you to the team.
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

export default JobAgreement;
