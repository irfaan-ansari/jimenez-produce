"use server";

import { db } from "@/lib/db";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Role } from "@/lib/types";
import { headers } from "next/headers";
import { getInitialsAvatar } from "@/lib/utils";
import { handleAction } from "@/lib/helper/error-handler";
import { member, organization, team, teamMember } from "@/lib/db/auth-schema";

type SignupProps = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role?: Role;
  accountType?: string;
};

/**
 * get session
 */
export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

/**
 * signup user
 * @param data
 * @returns
 */
const signUpUser = async (data: SignupProps) => {
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
 * get current user
 */
export async function getActiveUser(userId: string) {
  const memberUser = await db.query.member.findFirst({
    where: eq(member.userId, userId),
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organization.findFirst({
    where: eq(organization.id, memberUser.organizationId),
  });

  return { ...memberUser, organization: activeOrganization };
}

/**
 * get active team
 * @param userId
 * @returns
 */
export const getActiveTeam = async (userId: string) => {
  const teamMemberUser = await db.query.teamMember.findFirst({
    where: eq(teamMember.userId, userId),
  });

  if (!teamMemberUser) {
    return null;
  }

  const activeTeam = await db.query.team.findFirst({
    where: eq(team.id, teamMemberUser.teamId),
  });

  return activeTeam;
};

/**
 * signup user and add to organization
 * this is being used on add user page
 */
export const signupWithOrganization = handleAction(
  async ({
    name,
    email,
    password,
    phoneNumber,
    role,
    accountType,
  }: SignupProps & { role?: Role }) => {
    const session = await getSession();

    if (!session) {
      throw new Error("No session found");
    }

    if (!session.session.activeOrganizationId) {
      throw new Error("No active organization found");
    }

    const { user: createdUser } = await signUpUser({
      name,
      email,
      password,
      phoneNumber,
      accountType,
    });

    const data = await auth.api.addMember({
      body: {
        userId: createdUser.id,
        role: role || "member",
        organizationId: session.session.activeOrganizationId,
      },
    });

    return data;
  },
);

/**
 * signup user and add to team/customer
 */
interface CreateTeam {
  name: string;
  phone: string;
  email: string;
  password: string;
  managerName: string;
  pricelevelId: string | number;
  groupId: any;
}

export const addTeamWithUser = handleAction(async (data: CreateTeam) => {
  const session = await getSession();

  if (!session) throw new Error("No session found");

  if (!session.session.activeOrganizationId) {
    throw new Error("No active organization found");
  }
  const { name, email, password, phone, managerName } = data;

  // create customer
  const { data: createdUser, error } = await signupWithOrganization({
    name,
    email,
    password,
    phoneNumber: phone,
    accountType: "customer",
  });

  if (!createdUser) throw new Error(error?.message);

  // create team
  const createdTeam = await auth.api.createTeam({
    body: {
      name,
      email,
      phone,
      managerName,
      logo: getInitialsAvatar(data.name),
      priceLevelId: Number(data.pricelevelId),
      organizationId: session.session.activeOrganizationId,
    },
  });

  // add member
  await auth.api.addTeamMember({
    body: {
      userId: createdUser.userId,
      teamId: createdTeam.id,
    },
    headers: await headers(),
  });

  return { ...createdUser, createdTeam };
});
