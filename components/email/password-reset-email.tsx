import {
  Body,
  Button,
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

export const PasswordResetTemplate = ({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
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
          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea]">
            {/* Header */}
            <Header />

            <Section className="px-6">
              <Hr className="m-0" />

              <Heading className="text-2xl my-6 text-black font-bold">
                Reset Your Password
              </Heading>

              <Text className="text-base mb-4">Hi {name},</Text>

              <Text className="text-base mb-4">
                We received a request to reset your password. Click the button
                below to create a new password.
              </Text>

              {/* Reset Button */}
              <Section className="text-center my-8">
                <Button
                  href={resetUrl}
                  target="_blank"
                  className="bg-[#80b83a] rounded-lg px-4 text-white uppercase text-sm font-semibold inline-flex items-center h-10 mb-4"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-base mb-4">
                If the button above does not work, copy and paste the following
                link into your browser:
              </Text>

              <Text className="text-sm break-all text-blue-600 mb-6">
                {resetUrl}
              </Text>

              <Text className="text-base mb-4">
                This link will expire in 30 minutes for security reasons.
              </Text>

              <Text className="text-base mb-6">
                If you did not request a password reset, you can safely ignore
                this email. Your password will not be changed.
              </Text>

              <Hr />

              <Text className="text-sm mt-6 text-[#888888]">
                For security reasons, please do not share this email or link
                with anyone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetTemplate;
