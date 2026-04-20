"use server";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { customer, UserInsertType } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { handleAction } from "@/lib/helper/error-handler";

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
 * signup customer
 * @param data
 * @returns
 */
export const signUp = handleAction(async (data: SignupProps) => {
  const email = data.email.toLowerCase().trim();

  const customerRes = await db.query.customer.findFirst({
    where: or(
      eq(customer.companyEmail, email),
      eq(customer.officerEmail, email),
    ),
  });

  const createdUser = await auth.api.createUser({
    body: {
      ...data,
      email,
      data: {
        image: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
          data.name,
        )}`,
        role: "customer",
      },
    },
  });

  return createdUser;
});

/**
 * get users
 * @returns
 */
export const getUsers = async (query?: string) => {
  return await auth.api.listUsers({
    query: {
      searchValue: query,
      searchField: "email",
      searchOperator: "contains",
    },
    headers: await headers(),
  });
};

export const createUser = async (
  data: UserInsertType & { password: string },
) => {
  return await auth.api.createUser({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as "admin" | "customer",
    },
  });
};
