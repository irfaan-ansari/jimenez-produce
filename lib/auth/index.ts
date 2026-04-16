import { db } from "@/lib/db/index";
import { sendEmail } from "../email";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, customer } from "./permissions";
import { admin as adminPlugin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import PasswordResetTemplate from "@/components/email/password-reset-email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // advanced: {
  //   crossSubDomainCookies: {
  //     enabled: true,
  //     domain: "localhost:3000",
  //   },
  // },
  // trustedOrigins: [
  //   "http://localhost:3000",
  //   "http://app.localhost:3000",
  //   "http://order.localhost:3000",
  // ],
  emailAndPassword: {
    enabled: true,
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
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
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
  ],
});
