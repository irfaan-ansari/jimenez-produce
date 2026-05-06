import {
  eq,
  and,
  exists,
  or,
  desc,
  count,
  getTableColumns,
  ilike,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { orderGuide, orderGuideTarget, orderGuideItem } from "@/lib/db/schema";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { role, activeTeamId, activeOrganizationId, userId } = auth.session;

    if (role !== "customer")
      return NextResponse.json(
        { message: "You do not have permission to access this resource." },
        { status: 403 },
      );

    if (!activeTeamId || !activeOrganizationId)
      return NextResponse.json(
        { message: "Required account context is missing." },
        { status: 403 },
      );

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 24, q, status } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const filters = and(
      eq(orderGuide.organizationId, activeOrganizationId),
      and(
        or(
          eq(orderGuide.target, "all"),
          eq(orderGuide.teamId, activeTeamId),
          exists(
            db
              .select({ id: orderGuideTarget.id })
              .from(orderGuideTarget)
              .where(
                and(
                  eq(orderGuideTarget.orderGuideId, orderGuide.id),
                  eq(orderGuideTarget.teamId, activeTeamId),
                ),
              ),
          ),
        ),
        q ? ilike(orderGuide.name, `%${q}%`) : undefined,
      ),
    );

    //  subquery for item counts
    const itemsCountSubquery = db
      .select({
        orderGuideId: orderGuideItem.orderGuideId,
        itemCount: count(orderGuideItem.id).as("item_count"),
      })
      .from(orderGuideItem)
      .groupBy(orderGuideItem.orderGuideId)
      .as("items_count");

    //   main query
    const response = await db
      .select({
        ...getTableColumns(orderGuide),
        itemCount: itemsCountSubquery.itemCount,
      })
      .from(orderGuide)
      .leftJoin(
        itemsCountSubquery,
        eq(itemsCountSubquery.orderGuideId, orderGuide.id),
      )
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(orderGuide.createdAt));

    //   total
    const total = await db.$count(orderGuide, filters);

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
    return NextResponse.json({ message: "API error" }, { status: 500 });
  }
};
