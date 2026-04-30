"use server";

import { db } from "@/lib/db";
import { cache } from "react";
import { and, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Role } from "@/lib/types";
import { headers } from "next/headers";
import { getInitialsAvatar } from "@/lib/utils";
import { handleAction } from "@/lib/helper/error-handler";
import {
  member,
  organization,
  team,
  teamMember,
  user,
} from "@/lib/db/auth-schema";
import { taxRuleItem } from "@/lib/db/schema";

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
 * send otp to user
 * @param phoneNumber
 */
export const sendOtp = handleAction(
  async ({ phoneNumber }: { phoneNumber: string }) => {
    const account = await db.query.user.findFirst({
      where: eq(user.phoneNumber, phoneNumber),
    });

    if (!account) throw new Error("Invalid phone number");

    return await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber,
      },
    });
  },
);

export const verifyOtp = handleAction(
  async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
    const account = await db.query.user.findFirst({
      where: eq(user.phoneNumber, phoneNumber),
    });

    if (!account) throw new Error("Invalid phone number");

    return await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
      },
    });
  },
);

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

    await auth.api.addMember({
      body: {
        userId: createdUser.id,
        role: role || "member",
        organizationId: session.session.activeOrganizationId,
      },
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
 * create a team with tax rules
 */
interface CreateTeam {
  name: string;
  phone: string;
  email: string;
  managerName: string;
  priceLevelId: string | number;
  taxRuleIds?: number[];
  groupId: any;
}

export const addTeamWithTaxRules = handleAction(async (data: CreateTeam) => {
  const session = await getSession();

  if (!session) throw new Error("No session found");

  if (!session.session.activeOrganizationId) {
    throw new Error("No active organization found");
  }
  const { name, email, phone, managerName, taxRuleIds = [] } = data;

  // create team
  const createdTeam = await auth.api.createTeam({
    body: {
      name,
      email,
      phone,
      managerName,
      logo: getInitialsAvatar(data.name),
      priceLevelId: Number(data.priceLevelId),
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (taxRuleIds?.length > 0) {
    await updateTaxRulesToTeam({
      teamId: createdTeam.id,
      taxRuleIds: taxRuleIds,
    });
  }

  return { ...createdTeam };
});

/**
 * update team with tax rules
 */
export const updateTeamWithTaxRules = handleAction(
  async (teamId: string, data: CreateTeam) => {
    const session = await getSession();

    if (!session) throw new Error("No session found");

    if (!session.session.activeOrganizationId) {
      throw new Error("No active organization found");
    }
    const { name, email, phone, managerName, taxRuleIds = [] } = data;

    // create team
    const updatedTeam = await auth.api.updateTeam({
      body: {
        teamId,
        data: {
          name,
          email,
          phone,
          managerName,
          logo: getInitialsAvatar(data.name),
          priceLevelId: Number(data.priceLevelId),
          organizationId: session.session.activeOrganizationId,
        },
      },
      headers: await headers(),
    });

    if (taxRuleIds?.length > 0) {
      await updateTaxRulesToTeam({
        teamId,
        taxRuleIds: taxRuleIds,
      });
    }

    return { ...updatedTeam };
  },
);

/**
 * update tax rules to team
 * @param data { teamId, taxRuleIds }
 * @returns inserted and deleted count
 */
export const updateTaxRulesToTeam = handleAction(
  async (data: { teamId: string; taxRuleIds: number[] }) => {
    const { teamId, taxRuleIds } = data;

    //  Get existing
    const existing = await db
      .select({ taxRuleId: taxRuleItem.taxRuleId })
      .from(taxRuleItem)
      .where(eq(taxRuleItem.teamId, teamId));

    const existingIds = existing.map((r) => r.taxRuleId);

    // to insert
    const toInsert = taxRuleIds.filter((id) => !existingIds.includes(id));

    // to delete
    const toDelete = existingIds.filter((id) => !taxRuleIds.includes(id));

    const promises = [];
    // Delete removed
    if (toDelete.length) {
      promises.push(
        db
          .delete(taxRuleItem)
          .where(
            and(
              eq(taxRuleItem.teamId, teamId),
              inArray(taxRuleItem.taxRuleId, toDelete),
            ),
          ),
      );
    }

    // Insert new
    if (toInsert.length) {
      promises.push(
        db.insert(taxRuleItem).values(
          toInsert.map((taxRuleId) => ({
            teamId,
            taxRuleId,
          })),
        ),
      );
    }

    await Promise.all(promises);

    // return inserted and deleted count
    return {
      inserted: toInsert.length,
      deleted: toDelete.length,
    };
  },
);
