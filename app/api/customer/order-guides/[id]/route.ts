import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, or, getTableColumns, isNotNull, asc } from "drizzle-orm";
import { orderGuide, orderGuideTarget, orderGuideItem } from "@/lib/db/schema";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
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

    const { id } = await params;

    const filters = and(
      eq(orderGuide.id, Number(id)),
      eq(orderGuide.organizationId, activeOrganizationId),
      or(
        eq(orderGuide.target, "all"),
        eq(orderGuide.teamId, activeTeamId),
        isNotNull(orderGuideTarget.id),
      ),
    );

    //  main query
    const [guide, guideItems] = await Promise.all([
      db
        .select({
          ...getTableColumns(orderGuide),
        })
        .from(orderGuide)
        .leftJoin(
          orderGuideTarget,
          and(
            eq(orderGuideTarget.orderGuideId, orderGuide.id),
            eq(orderGuideTarget.teamId, activeTeamId),
          ),
        )
        .where(filters),
      db.query.orderGuideItem.findMany({
        where: eq(orderGuideItem.orderGuideId, Number(id)),
        with: {
          product: true,
        },
        orderBy: asc(orderGuideItem.position),
      }),
    ]);

    // TODO - implement price level here
    const transformed = guideItems
      .sort((a, b) => a.position - b.position)
      .map((g) => {
        const { id, ...restProduct } = g.product || {};

        return {
          ...restProduct,
          id: g.id,
          productId: g.productId,
          position: g.position,
          quantity: g.quantity,
        };
      });

    return NextResponse.json(
      { data: { ...guide, items: transformed } },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "API error" }, { status: 500 });
  }
};
