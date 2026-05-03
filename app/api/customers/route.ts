import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getQueryObject } from "@/lib/helper/query";
import { apiHandler } from "@/lib/helper/api-handler";
import { team, teamMember, user } from "@/lib/db/auth-schema";
import { and, countDistinct, eq, exists, ilike, or, SQL } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json(
        {
          message: ERROR_MESSAGE.UNAUTHORIZED,
        },
        { status: 401 },
      );
    }

    const { activeTeamId, activeOrganizationId, role } = auth.session;

    const {
      q,
      page = 1,
      limit = 24,
      offset = 0,
    } = getQueryObject(req.nextUrl.searchParams);

    const conditions = [eq(team.organizationId, activeOrganizationId!)];

    if (role === "customer" && activeTeamId) {
      conditions.push(
        exists(
          db
            .select()
            .from(teamMember)
            .where(
              and(
                eq(teamMember.teamId, team.id), // relation
                eq(teamMember.teamId, activeTeamId),
              ),
            ),
        ),
      );
    }

    if (q) {
      conditions.push(
        or(
          ilike(team.name, `%${q}%`),
          ilike(team.managerName, `%${q}%`),
          ilike(team.email, `%${q}%`),
        ) as SQL<unknown>,
      );
    }

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
      },
      offset,
      limit,
      orderBy: (team, { asc }) => [asc(team.createdAt)],
    });

    const [{ total }] = await db
      .select({ total: countDistinct(team.id) })
      .from(team)
      .leftJoin(teamMember, eq(teamMember.teamId, activeTeamId!))
      .leftJoin(user, eq(user.id, teamMember.userId))
      .where(filter);

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
      };
    });

    return NextResponse.json(
      {
        data: transformed,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {}
};
