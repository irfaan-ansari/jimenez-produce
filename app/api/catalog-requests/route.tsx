import { db } from "@/lib/db";
import { catalogAccess } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { eq, or, and, ilike, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const status = searchParams.get("status") ?? "all";
    const q = searchParams.get("q") ?? "";

    const offset = (page - 1) * limit;

    const conditions = [];

    if (status !== "all") {
      conditions.push(eq(catalogAccess.status, status));
    }

    if (q) {
      conditions.push(
        or(
          ilike(catalogAccess.name, `%${q}%`),
          ilike(catalogAccess.businessName, `%${q}%`),
          ilike(catalogAccess.businessType, `%${q}%`),
          ilike(catalogAccess.email, `%${q}%`),
          ilike(catalogAccess.phone, `%${q}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(catalogAccess)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(catalogAccess.createdAt));

    const total = await db.$count(catalogAccess, whereClause);

    return NextResponse.json(
      {
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("catalogAccesss API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
