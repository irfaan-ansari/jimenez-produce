import { db } from "@/lib/db";
import { jobPost } from "@/lib/db/schema";
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

    // return published posts if not authorised
    const statusFilter = session
      ? status
        ? eq(jobPost.status, status)
        : undefined
      : eq(jobPost.status, "published");

    const filters = and(
      statusFilter,
      q
        ? or(
            ilike(jobPost.title, `%${q}%`),
            ilike(jobPost.description, `%${q}%`),
            ilike(jobPost.responsibility, `%${q}%`)
          )
        : undefined
    );

    const posts = await db
      .select()
      .from(jobPost)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(jobPost.createdAt));

    const total = await db.$count(jobPost, filters);

    return NextResponse.json(
      {
        data: posts,
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
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
