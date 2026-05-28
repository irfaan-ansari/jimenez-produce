import React from "react";
import { resend } from ".";

interface EmailConfig {
  to: string[];
  subject: string;
  template: React.FC<any>;
  variables: Record<string, any>;
}

const FROM_EMAIL = "Jimenez Produce <no-reply@jimenezproduce.com>";

export const ADMIN_EMAILS = ["info@jimenezproduce.net"];

export async function sendEmail({
  to,
  subject,
  template,
  variables = {},
}: EmailConfig) {
  const element = React.createElement(template, variables);

  const uniqueTo = Array.from(
    new Map(to.map((email) => [email.toLowerCase(), email])).values(),
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: uniqueTo,
    subject,
    react: element,
  });

  return result;
}
