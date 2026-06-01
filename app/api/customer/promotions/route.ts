import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { eq, and, or, exists, arrayContains } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { promotion, promotionTarget } from "@/lib/db/schema";
import { resolvePrices } from "@/lib/helper/resolve-price";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { activeTeamId, activeOrganizationId } = session.session || {};

    if (!activeTeamId || !activeOrganizationId) {
      return NextResponse.json(
        { message: "Missing account content" },
        { status: 400 },
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 24, status, q, placement } = query;

    const promotions = await db.query.promotion.findMany({
      where: (p, { eq, and, or, exists }) =>
        and(
          eq(p.organizationId, activeOrganizationId),
          eq(p.status, "active"),
          placement ? arrayContains(p.placement, [placement]) : undefined,
          or(
            eq(p.target, "all"),
            exists(
              db
                .select()
                .from(promotionTarget)
                .where(
                  and(
                    eq(promotionTarget.promotionId, p.id),
                    eq(promotionTarget.teamId, activeTeamId),
                  ),
                ),
            ),
          ),
        ),
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(
      promotion,
      and(
        eq(promotion.organizationId, activeOrganizationId),
        eq(promotion.status, "active"),
        or(
          eq(promotion.target, "all"),
          exists(
            db
              .select()
              .from(promotionTarget)
              .where(
                and(
                  eq(promotionTarget.promotionId, promotion.id),
                  eq(promotionTarget.teamId, activeTeamId),
                ),
              ),
          ),
        ),
      ),
    );

    // Get all unique product ids
    const productIds = [
      ...new Set(promotions.flatMap((p) => p.productIds ?? [])),
    ];

    const products = await db.query.product.findMany({
      where: (product, { inArray }) => inArray(product.id, productIds),
    });

    // resolved prices
    const prices = await resolvePrices({
      teamId: activeTeamId!,
      productIds: products.map((p) => p.id),
    });

    // pricing lookup
    const pricingMap = new Map(prices.map((p) => [p.id, p]));

    // products lookup with pricing
    const productsMap = new Map(
      products.map((product) => {
        const { basePrice, ...rest } = product;
        const { finalPrice = 0 } = pricingMap.get(product.id) ?? {};
        return [
          product.id,
          {
            ...rest,
            finalPrice,
          },
        ];
      }),
    );

    const response = promotions.map((promotion) => {
      const { productIds, ...rest } = promotion;

      return {
        ...rest,
        products: (promotion.productIds ?? [])
          .map((id) => productsMap.get(id))
          .filter(Boolean),
      };
    });

    return NextResponse.json(
      {
        data: response,
        pagination: {
          page: 1,
          limit: 100,
          total: total,
          totalPages: Math.ceil(total / (100 as number)),
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
