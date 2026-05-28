"use client";

import { auth } from "./auth";
import {
  phoneNumberClient,
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, owner, sales, manager, member, customer } from "./permissions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: SITE_URL,
  plugins: [
    organizationClient({
      teams: {
        enabled: true,
      },
      ac,
      roles: {
        owner,
        sales,
        manager,
        member,
        customer,
      },
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    phoneNumberClient(),
  ],
});
