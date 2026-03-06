import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { jobInvite } from "@/lib/db/schema";
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
      status ? eq(jobInvite.status, status) : undefined,
      q
        ? or(
            ilike(jobInvite.firstName, `%${q}%`),
            ilike(jobInvite.email, `%${q}%`),
            ilike(jobInvite.phone, `%${q}%`)
          )
        : undefined
    );

    const response = await db
      .select()
      .from(jobInvite)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(jobInvite.createdAt));

    const total = await db.$count(jobInvite, filters);

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
