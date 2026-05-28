"use server";

import { db } from "@/services/db";
import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

/**
 *  get active user
 *  this is being used in session callback to get user details and add to session
 * @param userId {string}
 * @returns
 */
export async function getUserOrganization(userId: string) {
  const [user, memberUser] = await Promise.all([
    db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    }),
    db.query.member.findFirst({
      where: (m, { eq }) => eq(m.userId, userId),
    }),
  ]);

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.id, memberUser.organizationId),
  });

  return { user, memberUser, organization: activeOrganization };
}

/**
 * get active team
 * this is being used in session callback to get team details and add to session
 * @param userId {string}
 * @returns
 */
export const getUserTeam = async (userId: string) => {
  const teamMemberUser = await db.query.teamMember.findFirst({
    where: (tm, { eq }) => eq(tm.userId, userId),
  });

  if (!teamMemberUser) {
    return null;
  }

  const activeTeam = await db.query.team.findFirst({
    where: (t, { eq }) => eq(t.id, teamMemberUser.teamId),
  });

  return activeTeam;
};

/**
 * get session details
 */
export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
