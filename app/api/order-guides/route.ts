import {
  eq,
  and,
  or,
  desc,
  count,
  getTableColumns,
  ilike,
  isNotNull,
  asc,
  isNull,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  orderGuide,
  orderGuideTarget,
  orderGuideItem,
  order,
} from "@/lib/db/schema";

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

    const filters = and(
      eq(orderGuide.organizationId, activeOrganizationId),
      isNull(orderGuide.teamId),

      q
        ? or(
            ilike(orderGuide.name, `%${q}%`),
            ilike(orderGuide.description, `%${q}%`),
          )
        : undefined,
    );

    //   main query
    const result = await db.query.orderGuide.findMany({
      where: filters,
      with: {
        orderGuideItems: {
          columns: {
            id: true,
          },
        },
        orderGuideTargets: {
          columns: { id: true },
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
      .where(filters);

    const transform = result.map((item) => {
      const { orderGuideItems, orderGuideTargets, ...rest } = item;
      return {
        ...rest,
        itemCount: orderGuideItems.length,
        customerCount: orderGuideTargets.length,
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
