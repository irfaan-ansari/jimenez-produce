import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { getSession } from "@/services/auth";
import { count, eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { accountType } = session.user;
    const { activeOrganizationId, activeTeamId } = session.session;

    if (!activeOrganizationId || !activeTeamId) {
      return NextResponse.json(
        { message: ERROR_MESSAGE.FORBIDDEN },
        { status: 403 },
      );
    }

    const filters = [
      eq(order.organizationId, activeOrganizationId),
      eq(order.teamId, activeTeamId),
    ];

    const result = await db
      .select({
        status: order.status,
        value: count(),
      })
      .from(order)
      .where(and(...filters))
      .groupBy(order.status);

    const dbCountsMap = result.reduce(
      (acc, curr) => {
        acc[curr.status!] = Number(curr.value);
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalAll = Object.values(dbCountsMap).reduce((a, b) => a + b, 0);

    const counts: Record<string, number> = {
      all: totalAll,
      ...dbCountsMap,
    };

    return NextResponse.json({ data: counts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
};
