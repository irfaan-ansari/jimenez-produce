import { db } from "@/lib/db";

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
      where: (p, { inArray }) => inArray(p.id, productIds),
    }),

    db.query.team.findFirst({
      where: (t, { eq }) => eq(t.id, teamId),
      with: {
        priceLevel: true,
      },
    }),
  ]);

  const priceLevel = teamData?.priceLevel;

  // Full product lookup
  const productMap = new Map(products.map((p) => [p.id, p]));

  let overrideMap = new Map<number, number>();

  // Fetch overrides only if needed
  if (priceLevel?.appliesTo === "per_item") {
    const overrides = await db.query.priceLevelItem.findMany({
      where: (pl, { and, eq, inArray }) =>
        and(
          eq(pl.priceLevelId, priceLevel.id),
          inArray(pl.productId, productIds),
        ),
    });

    overrideMap = new Map(overrides.map((o) => [o.productId, Number(o.price)]));
  }

  const adjustmentValue = Number(priceLevel?.adjustmentValue ?? 0);

  const results = [];

  for (const id of productIds) {
    const product = productMap.get(id);

    if (!product) {
      throw new Error(`Product ${id} not found`);
    }

    const basePrice = Number(product.basePrice ?? 0);

    // Skip all calculations if base price is 0 or less
    if (basePrice <= 0) {
      results.push({
        ...product,
        finalPrice: basePrice.toFixed(2),
      });

      continue;
    }

    let finalPrice = basePrice;

    if (priceLevel) {
      const { appliesTo, adjustmentType } = priceLevel;

      // Global pricing
      if (appliesTo === "all") {
        if (adjustmentType === "percentage") {
          finalPrice = basePrice * (1 + adjustmentValue / 100);
        } else {
          finalPrice = basePrice + adjustmentValue;
        }
      }

      // Per-item pricing
      else if (appliesTo === "per_item") {
        finalPrice = overrideMap.get(id) ?? basePrice;
      }
    }

    results.push({
      ...product,
      finalPrice: Math.max(0, finalPrice).toFixed(2),
    });
  }

  return results;
};
