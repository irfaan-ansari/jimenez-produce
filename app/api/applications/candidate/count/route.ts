import { db } from "@/lib/db";
import { count } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { jobApplications } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await getSession();

    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const grouped = await db
      .select({
        status: jobApplications.status,
        value: count(),
      })
      .from(jobApplications)
      .groupBy(jobApplications.status);

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
