import { waitUntil } from "@vercel/functions";
import { nextCookies } from "better-auth/next-js";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, phoneNumber } from "better-auth/plugins";

import { db } from "@/services/db";
import { sendEmail } from "@/services/email";
import { twilioSendOTP, twilioVerifyOTP } from "@/services/twilio";

import { PasswordResetTemplate } from "@/services/email";
import { owner, ac, sales, manager, member, customer } from "./permissions";
import { getUserOrganization, getUserTeam } from "./session";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    sendResetPassword: async ({ user, url, token }) => {
      console.log("sending reset password email", url);
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
    autoSignIn: false,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      isSuperAdmin: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },
      accountType: {
        type: "string",
        required: true,
        defaultValue: "admin",
        input: true,
      },
    },
  },
  session: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: async (user) => {
        return user.isSuperAdmin;
      },
      ac,
      roles: {
        owner,
        member,
        sales,
        manager,
        customer,
      },
      teams: {
        enabled: true,
      },
      schema: {
        organization: {
          additionalFields: {
            phone: {
              type: "string",
              required: true,
              input: true,
            },
            email: {
              type: "string",
              required: true,
              input: true,
            },
          },
        },
        team: {
          additionalFields: {
            managerName: {
              type: "string",
              required: true,
              input: true,
            },
            phone: {
              type: "string",
              required: true,
              input: true,
            },
            email: {
              type: "string",
              required: true,
              input: true,
            },
            logo: {
              type: "string",
              required: false,
              input: true,
            },
            priceLevelId: {
              type: "number",
              required: false,
              input: true,
            },
            taxRuleId: {
              type: "number",
              required: false,
              input: true,
            },
          },
        },
      },
    }),
    phoneNumber({
      allowedAttempts: 3,
      sendOTP: ({ phoneNumber, code }, ctx) => {
        waitUntil(twilioSendOTP({ phoneNumber }));
      },
      verifyOTP: async ({ phoneNumber, code }, ctx) => {
        const isValid = await twilioVerifyOTP({ phoneNumber, code });
        return isValid.status === "approved";
      },
    }),
    nextCookies(),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [activeUser, activeTeam] = await Promise.all([
            getUserOrganization(session.userId),
            getUserTeam(session.userId),
          ]);

          const { memberUser, user } = activeUser || {};

          if (!memberUser?.organizationId) {
            console.warn("No organization found for user", session.userId);
            throw new APIError("BAD_REQUEST", {
              message: "Access denied. Please contact your administrator.",
            });
          }

          if (
            (memberUser?.role === "customer" ||
              user?.accountType === "customer") &&
            !activeTeam?.id
          ) {
            console.warn("No team found for customer user", session.userId);
            throw new APIError("BAD_REQUEST", {
              message: "You dont have access to any account.",
            });
          }

          return {
            data: {
              ...session,
              activeOrganizationId: memberUser?.organizationId,
              activeTeamId: activeTeam?.id,
              role: memberUser?.role,
            },
          };
        },
      },
    },
  },
});
