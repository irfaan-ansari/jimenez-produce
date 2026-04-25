"use client";

import { SITE_URL } from "../config";
import { ac, owner, sales, manager, member, customer } from "./permissions";
import { auth } from ".";
import {
  phoneNumberClient,
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

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
