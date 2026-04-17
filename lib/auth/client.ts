"use client";

import { SITE_URL } from "../config";
import type { auth } from "@/lib/auth";
import { ac, admin, customer } from "./permissions";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { customSessionClient } from "better-auth/client/plugins";

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
    customSessionClient<typeof auth>(),
  ],
});
