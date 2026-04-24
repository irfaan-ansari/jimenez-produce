import { db } from "@/lib/db";
import { count } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { NextResponse } from "next/server";
import { priceLevel } from "@/lib/db/schema";

export const GET = async () => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const response = await db
      .select({
        status: priceLevel.status,
        value: count(),
      })
      .from(priceLevel)
      .groupBy(priceLevel.status);

    const dbCountsMap = response.reduce(
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
