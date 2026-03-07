import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
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
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, status, q } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      eq(product.status, status),
      q
        ? or(
            ilike(product.title, `%${q}%`),
            ilike(product.description, `%${q}%`),
            ilike(product.identifier, `%${q}%`)
          )
        : undefined
    );

    const products = await db
      .select()
      .from(product)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(product.createdAt));

    const total = await db.$count(product, filters);

    return NextResponse.json(
      {
        data: products,

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
