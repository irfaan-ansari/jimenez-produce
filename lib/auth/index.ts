import { db } from "@/lib/db/index";
import { sendEmail } from "../email";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, customer } from "./permissions";
import { customer as customerTable } from "@/lib/db/schema";
import { admin as adminPlugin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import PasswordResetTemplate from "@/components/email/password-reset-email";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

const options = {
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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }, ctx) => {
      const account = await db.query.customer.findFirst({
        where: eq(customerTable.accountId, user.id),
      });

      return {
        user: {
          ...user,
          customerId: account?.id,
          locationId: account?.locationId,
        },
        session,
      };
    }, options),
  ],
});
