import { db } from "@/lib/db/index";
import { sendEmail } from "../email";
import { APIError, betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { owner, ac, sales, manager, member, customer } from "./permissions";
import { getActiveUser, getActiveTeam } from "@/server/auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, phoneNumber } from "better-auth/plugins";
import PasswordResetTemplate from "@/components/email/password-reset-email";
import { twilioSendOTP, twilioVerifyOTP } from "../twilio";
import { waitUntil } from "@vercel/functions";

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
            getActiveUser(session.userId),
            getActiveTeam(session.userId),
          ]);

          if (!activeUser?.organizationId) {
            throw new APIError("BAD_REQUEST", {
              message: "Access denied. Please contact your administrator.",
            });
          }
          return {
            data: {
              ...session,
              activeOrganizationId: activeUser?.organizationId,
              activeTeamId: activeTeam?.id,
              role: activeUser?.role,
            },
          };
        },
      },
    },
  },
});
