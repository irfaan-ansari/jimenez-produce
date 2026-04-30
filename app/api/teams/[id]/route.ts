import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getQueryObject } from "@/lib/helper/query";
import { apiHandler } from "@/lib/helper/api-handler";
import { team, teamMember, user } from "@/lib/db/auth-schema";
import { and, eq, exists, ilike, or, SQL } from "drizzle-orm";

export const GET = apiHandler(async ({ req, auth, params }) => {
  const { activeTeamId, activeOrganizationId, role } = auth.session;

  const {
    q,
    page = 1,
    limit = 24,
    offset = 0,
  } = getQueryObject(req.nextUrl.searchParams);

  const conditions = [eq(team.organizationId, activeOrganizationId!)];

  const filter = and(...conditions);

  const teams = await db.query.team.findMany({
    where: filter,
    with: {
      teamMembers: {
        with: {
          user: {
            columns: {
              name: true,
              phoneNumber: true,
              email: true,
              image: true,
            },
          },
        },
      },
      taxRuleItems: {
        with: {
          taxRule: true,
        },
      },
    },
    offset,
    limit,
    orderBy: (team, { asc }) => [asc(team.createdAt)],
  });

  // transform data
  const transformed = teams.map((t) => {
    return {
      id: t.id,
      name: t.name,
      organizationId: t.organizationId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      managerName: t.managerName,
      phone: t.phone,
      email: t.email,
      logo: t.logo,
      priceLevelId: t.priceLevelId,
      members: t.teamMembers.map((tm) => {
        return {
          id: tm.userId,
          name: tm.user.name,
          email: tm.user.email,
          phoneNumber: tm.user.phoneNumber,
          image: tm.user.image,
        };
      }),
      taxRules: t.taxRuleItems.map((tri) => {
        return {
          id: tri.taxRuleId,
          name: tri.taxRule.name,
          rate: tri.taxRule.rate,
        };
      }),
    };
  });

  return NextResponse.json(
    {
      data: transformed,
    },
    { status: 200 },
  );
});
