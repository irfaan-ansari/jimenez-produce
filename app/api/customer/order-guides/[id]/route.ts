import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  eq,
  and,
  or,
  getTableColumns,
  isNotNull,
  asc,
  inArray,
} from "drizzle-orm";
import {
  orderGuide,
  orderGuideTarget,
  orderGuideItem,
  product,
  priceLevelItem,
} from "@/lib/db/schema";
import { team } from "@/lib/db/auth-schema";

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

    const filters = and(
      eq(orderGuide.id, Number(id)),
      eq(orderGuide.organizationId, activeOrganizationId),
      or(eq(orderGuide.teamId, activeTeamId), isNotNull(orderGuideTarget.id)),
    );

    //  main query
    const [[guide], guideItems] = await Promise.all([
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

    // resolve all prices first
    const pricing = await resolvePrices({
      teamId: activeTeamId,
      productIds: guideItems.map((g) => g.productId),
    });

    // pricing lookup
    const pricingMap = new Map(pricing.map((p) => [p.id, p]));

    // TODO - implement price level here
    const transformed = guideItems
      .sort((a, b) => a.position - b.position)
      .map((g) => {
        const { id, ...restProduct } = g.product || {};
        const { finalPrice = 0 } = pricingMap.get(g.productId) ?? {};
        return {
          ...restProduct,
          id: g.id,
          productId: g.productId,
          position: g.position,
          quantity: g.quantity,
          finalPrice: finalPrice ?? 0,
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

/**
 * @param teamId
 * @param productIds
 * @returns Promise<Array<{id: number; basePrice: number; finalPrice: number}>>
 */

export const resolvePrices = async ({
  teamId,
  productIds,
}: {
  teamId: string;
  productIds: number[];
}) => {
  if (productIds.length === 0) return [];

  const [products, teamData] = await Promise.all([
    db.query.product.findMany({
      where: inArray(product.id, productIds),
    }),

    db.query.team.findFirst({
      where: eq(team.id, teamId),
      with: {
        priceLevel: true,
      },
    }),
  ]);

  const priceLevel = teamData?.priceLevel;

  // product lookup
  const productMap = new Map(products.map((p) => [p.id, Number(p.basePrice)]));

  let overrideMap = new Map<number, number>();

  // fetch overrides only if needed
  if (priceLevel?.appliesTo === "per_item") {
    const overrides = await db.query.priceLevelItem.findMany({
      where: and(
        eq(priceLevelItem.priceLevelId, priceLevel.id),
        inArray(priceLevelItem.productId, productIds),
      ),
    });

    overrideMap = new Map(overrides.map((o) => [o.productId, Number(o.price)]));
  }

  const adjustmentValue = Number(priceLevel?.adjustmentValue ?? 0);

  const results = [];

  for (const id of productIds) {
    const basePrice = productMap.get(id);

    if (basePrice == null) {
      throw new Error(`Product ${id} not found`);
    }

    let finalPrice = basePrice;

    if (priceLevel) {
      const { appliesTo, adjustmentType } = priceLevel;
      // global pricing
      if (appliesTo === "all") {
        if (adjustmentType === "percentage") {
          finalPrice = basePrice * (1 + adjustmentValue / 100);
        } else {
          finalPrice = basePrice + adjustmentValue;
        }
      }

      // per-item pricing
      else if (priceLevel.appliesTo === "per_item") {
        finalPrice = overrideMap.get(id) ?? basePrice;
      }
    }

    results.push({
      id,
      finalPrice,
      basePrice: Math.max(0, finalPrice),
    });
  }

  return results;
};
