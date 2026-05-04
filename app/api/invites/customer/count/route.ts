import { db } from "@/lib/db";
import { count, eq } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { customerInvite } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await getSession();

    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const params = req.nextUrl.searchParams;
    const type = params.get("type");

    if (!type)
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    const grouped = await db
      .select({
        status: customerInvite.status,
        value: count(),
      })
      .from(customerInvite)
      .where(eq(customerInvite.type, type!))
      .groupBy(customerInvite.status);

    const dbCountsMap = grouped.reduce(
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
    console.error("API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
};
