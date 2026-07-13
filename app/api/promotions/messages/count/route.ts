import { db } from "@/lib/db";
import { count, eq } from "drizzle-orm";
import { messages } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = session.session;

    if (!activeOrganizationId) {
      return NextResponse.json(
        { message: "No active organization." },
        { status: 403 },
      );
    }

    const result = await db
      .select({
        status: messages.status,
        value: count(),
      })
      .from(messages)
      .where(eq(messages.organizationId, activeOrganizationId))
      .groupBy(messages.status);

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
