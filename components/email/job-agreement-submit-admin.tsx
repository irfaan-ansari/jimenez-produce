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

export const JobAgreementSubmitAdmin = ({
  name,
  position,
  phone,
  email,
  dateAvailable,
}: {
  name: string;
  position: string;
  phone: string;
  email: string;
  dateAvailable: string;
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
                User Onboarding Completed – Job Application
              </Heading>
              <Text className="text-base mb-4">
                Applicant <strong>[Name]</strong> has successfully completed all
                required onboarding steps for the <strong>{position}</strong>{" "}
                position at Jimenez Produce.
              </Text>

              <Text className="text-base mb-4">
                All submitted documents and application details are now
                available on the dashboard for your review.
              </Text>

              <Text className="text-base">
                Please log in to the admin panel to review the application and
                proceed with the next steps.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">
                  Name: {name}
                </Text>
                <Text className="text-base font-semibold mb-2">
                  Psition: {position}
                </Text>
                <Text className="text-base font-semibold mb-2">
                  Phone: {phone}
                </Text>
                <Text className="text-base font-semibold mb-2">
                  Email: {email}
                </Text>
                <Text className="text-base font-semibold mb-2">
                  Available Start Date: {dateAvailable}
                </Text>
              </Section>

              <Text className="text-sm mt-10 text-[#888888]">
                ⚠ This is an internal notification for Jimenez Produce admin
                staff only. Do not forward to customers. Use the admin dashboard
                to review applications.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default JobAgreementSubmitAdmin;
