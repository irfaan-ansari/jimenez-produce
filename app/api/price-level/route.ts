import { db } from "@/lib/db";
import { priceLevel } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { eq, ilike, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || session?.user?.role === "customer")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 10, q, status } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const conditions = [];

    if (status) conditions.push(eq(priceLevel.status, status));
    if (q) conditions.push(ilike(priceLevel.name, `%${q}%`));

    const filters = conditions.length > 0 ? and(...conditions) : undefined;

    const response = await db.query.priceLevel.findMany({
      where: filters,
      with: { priceLevelItem: true },
      limit: Number(limit),
      offset,
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(priceLevel, filters);

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
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
};
