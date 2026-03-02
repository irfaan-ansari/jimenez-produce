import { Button, Hr, Text } from "@react-email/components";
import { EmailTemplate } from "./email-template";

export const PasswordResetTemplate = ({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) => {
  return (
    <EmailTemplate template="customer" heading="Password Your Reset">
      <Text className="text-xl">Hi {name},</Text>

      <Text className="text-lg">
        We received a request to reset your password. Click the button below to
        create a new password.
      </Text>

      <Button
        href={resetUrl}
        target="_blank"
        className="bg-[#80b83a] rounded-lg p-4 text-white uppercase text-sm font-semibold inline-flex items-center"
      >
        Reset Password
      </Button>

      <Text className="text-lg">
        If the button above does not work, copy and paste the following link
        into your browser:
      </Text>

      <Text className="text-base break-all text-blue-600">{resetUrl}</Text>

      <Text className="text-base mb-4">
        This link will expire in 30 minutes for security reasons.
      </Text>

      <Text className="text-base mb-6">
        If you did not request a password reset, you can safely ignore this
        email. Your password will not be changed.
      </Text>

      <Hr />

      <Text className="text-sm mt-6 text-[#888888]">
        For security reasons, please do not share this email or link with
        anyone.
      </Text>
    </EmailTemplate>
  );
};

export default PasswordResetTemplate;
