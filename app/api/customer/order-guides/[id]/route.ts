import { db } from "@/lib/db";
import { asc } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { resolvePrices } from "@/lib/helper/resolve-price";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";
import { orderGuideTarget, orderGuideItem } from "@/lib/db/schema";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { role, activeTeamId, activeOrganizationId } = auth.session;

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

    const guide = await db.query.orderGuide.findFirst({
      where: (og, { eq, and, or, exists }) =>
        and(
          eq(og.id, Number(id)),
          eq(og.organizationId, activeOrganizationId),
          or(
            eq(og.teamId, activeTeamId),
            exists(
              db
                .select()
                .from(orderGuideTarget)
                .where(
                  and(
                    eq(orderGuideTarget.orderGuideId, og.id),
                    eq(orderGuideTarget.teamId, activeTeamId),
                  ),
                ),
            ),
          ),
        ),
      with: {
        orderGuideItems: {
          with: {
            product: true,
          },
          orderBy: asc(orderGuideItem.position),
        },
      },
    });

    if (!guide)
      return NextResponse.json(
        { message: ERROR_MESSAGE.NOT_FOUND },
        { status: 404 },
      );

    const { orderGuideItems } = guide;

    // resolve all prices first
    const prices = await resolvePrices({
      teamId: activeTeamId,
      productIds: orderGuideItems.map((g) => g.productId),
    });

    // pricing lookup
    const pricingMap = new Map(prices.map((p) => [p.id, p]));

    const transformedItems = orderGuideItems
      .sort((a, b) => a.position - b.position)
      .map((g) => {
        const { id, basePrice, ...restProduct } = g.product || {};
        const { finalPrice = 0 } = pricingMap.get(g.productId) ?? {};

        return {
          ...restProduct,
          id: g.id,
          productId: g.productId,
          position: g.position,
          quantity: g.quantity,
          finalPrice: finalPrice,
        };
      });

    return NextResponse.json(
      { data: { ...guide, items: transformedItems } },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "API error" }, { status: 500 });
  }
};
