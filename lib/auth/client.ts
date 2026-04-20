"use client";

import { SITE_URL } from "../config";
import { ac, admin, customer } from "./permissions";
import { createAuthClient } from "better-auth/react";
import { adminClient, phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: SITE_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        customer,
      },
    }),
    phoneNumberClient(),
  ],
});
