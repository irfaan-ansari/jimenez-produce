import { db } from "@/lib/db/index";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "../email";
import PasswordResetTemplate from "@/components/email/password-reset-email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      sendEmail({
        to: user.email,
        subject: "Reset your password",
        template: PasswordResetTemplate,
        variables: {
          name: user.name,
          resetUrl: url,
        },
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  plugins: [admin(), nextCookies()],
});
