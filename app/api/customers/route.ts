import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";
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
      conditions.push(eq(customer.status, status));
    }

    if (q) {
      conditions.push(
        or(
          ilike(customer.companyName, `%${q}%`),
          ilike(customer.companyPhone, `%${q}%`),
          ilike(customer.companyEmail, `%${q}%`),
          ilike(customer.companyEin, `%${q}%`),
          ilike(customer.officerFirst, `%${q}%`),
          ilike(customer.officerEmail, `%${q}%`),
          ilike(customer.officerMobile, `%${q}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(customer)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(customer.createdAt));

    const total = await db.$count(customer, whereClause);

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
    console.error("Customers API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
