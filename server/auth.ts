"use server";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserInsertType } from "@/lib/db/schema";

type LoginProps = {
  email: string;
  password: string;
};

type SignupProps = {
  name: string;
  email: string;
  password: string;
};

/**
 * get session
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * signup
 * @param data
 * @returns
 */
export const signUp = async (data: SignupProps) => {
  return auth.api.createUser({
    body: {
      ...data,
      data: {
        image: `https://api.dicebear.com/9.x/identicon/svg?seed=${data.name}`,
      },
    },
  });
};

/**
 * signin
 */
export const signIn = async (data: LoginProps) => {
  return await auth.api.signInEmail({
    body: { ...data },
  });
};

/**
 * signout
 * @returns
 */
export const signOut = async () => {
  return await auth.api.signOut({
    headers: await headers(),
  });
};

/**
 * get users
 * @returns
 */
export const getUsers = async (query?: string) => {
  return await auth.api.listUsers({
    query: {},
    headers: await headers(),
  });
};

export const createUser = async (
  data: UserInsertType & { password: string }
) => {
  return await auth.api.createUser({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as "user" | "admin",
    },
  });
};
