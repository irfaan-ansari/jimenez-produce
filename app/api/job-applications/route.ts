import { db } from "@/lib/db";
import { jobApplications } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { eq, or, and, ilike, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 10, status, q } = query;

    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      status ? eq(jobApplications.status, status) : undefined,
      q
        ? or(
            ilike(jobApplications.firstName, `%${q}%`),
            ilike(jobApplications.lastName, `%${q}%`),
            ilike(jobApplications.position, `%${q}%`)
          )
        : undefined
    );

    const response = await db
      .select()
      .from(jobApplications)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(jobApplications.createdAt));

    const total = await db.$count(jobApplications, filters);

    return NextResponse.json(
      {
        data: response,
        pagination: {
          page,
          limit,
          total: total,
          totalPages: Math.ceil(total / (limit as number)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
