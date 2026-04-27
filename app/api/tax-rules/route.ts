import { db } from "@/lib/db";
import { taxRule } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { getQueryObject } from "@/lib/helper/query";
import { eq, ilike, and, or, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const search = req.nextUrl.searchParams;
    const { page, limit, q, offset } = getQueryObject(search);

    const conditions = [
      eq(taxRule.organizationId, session.session.activeOrganizationId),
    ];

    if (q)
      conditions.push(
        or(
          ilike(taxRule.name, `%${q}%`),
          ilike(taxRule.rate, `%${q}%`),
        ) as SQL<unknown>,
      );

    const filters = and(...conditions);

    const response = await db.query.taxRule.findMany({
      where: filters,
      limit: Number(limit),
      offset,
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(taxRule, filters);

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
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
};
