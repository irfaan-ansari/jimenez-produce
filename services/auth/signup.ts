"use server";

import { getInitialsAvatar } from "@/lib/utils";
import { auth } from "./auth";
import { Role, SignupProps } from "./types";
import { handleAction } from "@/lib/helper/error-handler";
import { getSession } from "./session";
import { db, user } from "@/services/db";
import { eq } from "drizzle-orm";

/**
 * signup user
 * @param data
 * @returns
 */
export const signUpUser = async (data: SignupProps) => {
  const { name, email, phoneNumber, password, accountType = "admin" } = data;

  return await auth.api.signUpEmail({
    body: {
      name,
      email,
      phoneNumber,
      password,
      image: getInitialsAvatar(name),
      accountType,
    },
  });
};

/**
 *
 */
export const signupWithOrganization = handleAction(
  async ({
    name,
    email,
    phoneNumber,
    role,
    accountType,
  }: Omit<SignupProps, "password"> & { role?: Role }) => {
    const session = await getSession();

    if (!session) {
      throw new Error("No session found");
    }

    if (!session.session.activeOrganizationId) {
      throw new Error("No active organization found");
    }
    const password = crypto.randomUUID().slice(0, 16);
    const { user: createdUser } = await signUpUser({
      name,
      email,
      password,
      phoneNumber,
      accountType,
    });

    // add user to current organization
    await addUserToOrganization({
      userId: createdUser.id,
      role: role || "member",
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phoneNumber: createdUser.phoneNumber,
    };
  },
);

/**
 * add user to organization
 * using this function because better auth provides only server api for this endpoint
 */
export const addUserToOrganization = handleAction(
  async ({ userId, role }: { userId: string; role: Role }) => {
    const session = await getSession();

    if (!session) {
      throw new Error("No session found");
    }

    if (!session.session.activeOrganizationId) {
      throw new Error("No active organization found");
    }

    const data = await auth.api.addMember({
      body: {
        userId,
        role: role || "member",
        organizationId: session.session.activeOrganizationId,
      },
    });

    return data;
  },
);

/**
 * delete user
 * @param userId
 * @returns deleted user
 */
export const deleteUser = handleAction(async (userId: string) => {
  const session = await getSession();

  if (!session || !session.session.activeOrganizationId) {
    throw new Error("Authentication required");
  }

  const userExist = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!userExist) {
    throw new Error("User not found");
  }

  const deleted = await db.delete(user).where(eq(user.id, userId)).returning();

  return deleted;
});
