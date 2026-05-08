import {
  eq,
  or,
  ne,
  and,
  SQL,
  desc,
  ilike,
  inArray,
  arrayContains,
  countDistinct,
} from "drizzle-orm";
import {
  product,
  orderGuide,
  teamProduct,
  priceLevelItem,
  orderGuideItem,
  orderGuideTarget,
  ProductSelectType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { team } from "@/lib/db/auth-schema";
import { getQueryObject } from "@/lib/helper/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { activeOrganizationId, activeTeamId } = session.session;
    const search = req.nextUrl.searchParams;

    const {
      page,
      limit,
      q,
      cat,
      offset = 0,
      orderGuideId,
    } = getQueryObject(search);

    const ids = await db.query.teamProduct.findMany({
      where: eq(teamProduct.teamId, activeTeamId!),
      columns: {
        productId: true,
      },
    });

    const privateIds = ids.map((id) => id.productId);

    const conditions = [
      ne(product.status, "archived"),
      eq(product.organizationId, activeOrganizationId),
      or(eq(product.status, "active"), inArray(product.id, privateIds)),
    ];

    if (cat) {
      conditions.push(arrayContains(product.categories, [cat]));
    }

    if (q) {
      const searchCondition = or(
        ilike(product.title, `%${q}%`),
        ilike(product.description, `%${q}%`),
        ilike(product.identifier, `%${q}%`),
      ) as SQL<unknown>;

      conditions.push(searchCondition);
    }

    if (orderGuideId) {
      conditions.push(
        inArray(
          product.id,
          db
            .select({ id: orderGuideItem.productId })
            .from(orderGuideItem)
            .where(eq(orderGuideItem.orderGuideId, orderGuideId)),
        ),
      );
    }

    const filters = and(...conditions);

    const guideMeta = db
      .select({ id: orderGuide.id })
      .from(orderGuide)
      .leftJoin(
        orderGuideTarget,
        eq(orderGuideTarget.orderGuideId, orderGuide.id),
      )
      .where(
        or(
          eq(orderGuide.teamId, activeTeamId!),
          eq(orderGuideTarget.teamId, activeTeamId!),
        ),
      );

    const products = await db.query.product.findMany({
      where: filters,
      with: {
        lineItems: {
          limit: 1,
          orderBy: (li, { desc }) => [desc(li.createdAt)],
        },
        orderGuideItems: {
          with: {
            orderGuide: true,
          },
          limit: 1,
          orderBy: (ogi, { desc }) => [desc(ogi.position)],
          where: (ogi, { inArray }) => inArray(ogi.orderGuideId, guideMeta),
        },
      },
      limit,
      offset,
      orderBy: [desc(product.createdAt), desc(product.id)],
    });

    const transformedProducts = products.map((product) => {
      const { lineItems, orderGuideItems, ...rest } = product;
      const [lineItem] = lineItems;
      const [orderGuideItem] = orderGuideItems;
      const teamId = orderGuideItem?.orderGuide?.teamId;

      return {
        ...rest,
        lastPurchased: {
          id: lineItem?.id,
          orderId: lineItem?.orderId,
          quantity: lineItem?.quantity,
          createdAt: lineItem?.createdAt,
        },
        isSuggested: !teamId,
        isGuide: !!teamId,
      };
    });

    // get total count for pagination
    const [{ total }] = await db
      .select({ total: countDistinct(product.id) })
      .from(product)
      .where(filters);

    const updatedProducts = await resolvePrice(
      activeTeamId!,
      transformedProducts,
    );

    return NextResponse.json(
      {
        data: updatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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
}

/**
 * Resolve price level for products
 * @param teamId
 * @param products
 * @returns Promise<ProductSelectType[]>
 */
const resolvePrice = async (teamId: string, products: ProductSelectType[]) => {
  // get price level data
  const teamData = await db.query.team.findFirst({
    where: eq(team.id, teamId),
    with: { priceLevel: true },
  });

  const priceLevel = teamData?.priceLevel;

  if (!priceLevel) return products;

  if (priceLevel.appliesTo === "all") {
    const { adjustmentType, adjustmentValue } = priceLevel;

    return products.map((p) => {
      let price = Number(p.basePrice);

      if (adjustmentType === "percentage") {
        price = price * (1 + Number(adjustmentValue) / 100);
      } else {
        price = price - Number(adjustmentValue);
      }

      return { ...p, basePrice: String(price) };
    });
  }

  if (priceLevel.appliesTo === "per_item") {
    const productIds = products.map((p) => p.id);

    const prices = await db.query.priceLevelItem.findMany({
      where: and(
        inArray(priceLevelItem.productId, productIds),
        eq(priceLevelItem.priceLevelId, priceLevel.id),
      ),
    });

    const priceMap = new Map(prices.map((p) => [p.productId, p.price]));

    return products.map((p) => ({
      ...p,
      basePrice: priceMap.get(p.id) ?? p.basePrice,
    }));
  }
};
