import { db } from "@/lib/db";
import { getSession } from "@/services/auth";
import { orderGuide } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, or, count, ilike, asc, isNull, SQL } from "drizzle-orm";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = auth.session;

    if (!activeOrganizationId)
      return NextResponse.json(
        { message: "Required account context is missing." },
        { status: 403 },
      );

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 24, q } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const filters = [
      eq(orderGuide.organizationId, activeOrganizationId),
      isNull(orderGuide.teamId),
    ];

    if (q) {
      filters.push(
        or(
          ilike(orderGuide.name, `%${q}%`),
          ilike(orderGuide.description, `%${q}%`),
        ) as SQL<unknown>,
      );
    }

    //   main query
    const result = await db.query.orderGuide.findMany({
      where: and(...filters),
      with: {
        orderGuideItems: {
          with: {
            product: true,
          },
        },
        orderGuideTargets: {
          with: {
            team: true,
          },
        },
      },
      limit: Number(limit),
      offset: offset,
      orderBy: asc(orderGuide.position),
    });

    //   total
    const [{ count: total }] = await db
      .select({
        count: count(orderGuide.id),
      })
      .from(orderGuide)
      .where(and(...filters));

    const transform = result.map((item) => {
      const { orderGuideItems, orderGuideTargets, ...rest } = item;
      return {
        ...rest,
        items: orderGuideItems.map((i) => i.product),
        teams: orderGuideTargets.map((t) => t.team),
      };
    });

    return NextResponse.json(
      {
        data: transform,
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
    return NextResponse.json({ message: "API error" }, { status: 500 });
  }
};
