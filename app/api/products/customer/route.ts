import {
  eq,
  or,
  and,
  ne,
  desc,
  ilike,
  arrayContains,
  getTableColumns,
  inArray,
  SQL,
  isNotNull,
  countDistinct,
} from "drizzle-orm";
import {
  lineItem,
  orderGuideItem,
  priceLevelItem,
  product,
  ProductSelectType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { team } from "@/lib/db/auth-schema";
import { getSession } from "@/server/auth";
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
      saved = false,
    } = getQueryObject(search);

    // 🔹 Filters
    const conditions = [
      ne(product.status, "archived"),
      eq(product.organizationId, activeOrganizationId),
    ];

    if (cat) {
      conditions.push(arrayContains(product.categories, [cat]));
    }

    if (saved) {
      conditions.push(isNotNull(orderGuideItem.id));
    }

    if (q) {
      const searchCondition = or(
        ilike(product.title, `%${q}%`),
        ilike(product.description, `%${q}%`),
        ilike(product.identifier, `%${q}%`),
      ) as SQL<unknown>;

      conditions.push(searchCondition);
    }

    const filters = and(...conditions);

    // sub query to get line items
    const lastLineItem = db
      .select({
        productId: lineItem.productId,
        id: lineItem.id,
        orderId: lineItem.orderId,
        quantity: lineItem.quantity,
        createdAt: lineItem.createdAt,
      })
      .from(lineItem)
      .where(eq(lineItem.teamId, activeTeamId!))
      .orderBy(desc(lineItem.createdAt))
      .limit(1)
      .as("lastLineItem");

    // main query to get products
    const products = await db
      .select({
        ...getTableColumns(product),
        lastPurchased: {
          id: lastLineItem.id,
          orderId: lastLineItem.orderId,
          quantity: lastLineItem.quantity,
          createdAt: lastLineItem.createdAt,
        },
        guide: {
          id: orderGuideItem.id,
          quantity: orderGuideItem.quantity,
        },
      })
      .from(product)
      .leftJoin(lastLineItem, eq(lastLineItem.productId, product.id))
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.teamId, activeTeamId!),
        ),
      )
      .where(filters)
      .limit(limit)
      .offset(offset);

    // get total count for pagination
    const [{ total }] = await db
      .select({ total: countDistinct(product.id) })
      .from(product)
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.teamId, activeTeamId!),
        ),
      )
      .where(filters);

    const updatedProducts = await resolvePrice(activeTeamId!, products);

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

    const ids = prices.map((p) => p.productId);

    const priceMap = new Map(prices.map((p) => [p.productId, p.price]));

    return products.map((p) => ({
      ...p,
      basePrice: priceMap.get(p.id) ?? p.basePrice,
    }));
  }
};
