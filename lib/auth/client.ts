"use client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { SITE_URL } from "../config";

export const authClient = createAuthClient({
  baseURL: SITE_URL,
  plugins: [adminClient()],
});
