import { db } from "@/lib/db/index";
import { sendEmail } from "../email";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, customer } from "./permissions";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, phoneNumber } from "better-auth/plugins";
import PasswordResetTemplate from "@/components/email/password-reset-email";

const options = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    sendResetPassword: async ({ user, url, token }) => {
      sendEmail({
        to: [user.email],
        subject: "Reset your password",
        template: PasswordResetTemplate,
        variables: {
          name: user.name,
          resetUrl: url,
        },
      });
    },
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      locationId: {
        type: "number",
        required: false,
        input: true,
      },
      managerName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        customer,
      },
    }),
    nextCookies(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
        console.log("sending", phoneNumber, code);
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [...options.plugins],
});
