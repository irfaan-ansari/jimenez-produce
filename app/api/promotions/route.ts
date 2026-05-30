import { db } from "@/lib/db";
import { promotion } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { eq, ilike, and, or, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, status, q } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const conditions = [
      eq(promotion.organizationId, session.session.activeOrganizationId),
    ];

    if (q)
      conditions.push(
        or(
          ilike(promotion.name, `%${q}%`),
          ilike(promotion.title, `%${q}%`),
          ilike(promotion.description, `%${q}%`),
          ilike(promotion.badge, `%${q}%`),
        ) as SQL<unknown>,
      );

    if (status) {
      conditions.push(eq(promotion.status, status));
    }

    const filters = and(...conditions);

    const response = await db.query.promotion.findMany({
      where: filters,
      with: {
        promotionTargets: {
          with: {
            team: true,
          },
        },
      },
      limit: Number(limit),
      offset,
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(promotion, filters);

    const transformed = response.map((r) => {
      const { promotionTargets, ...rest } = r;
      return {
        ...rest,
        teams: promotionTargets.map((pt) => pt.team),
      };
    });
    return NextResponse.json(
      {
        data: transformed,
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
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
