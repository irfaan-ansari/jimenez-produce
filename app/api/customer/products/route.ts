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
  orderGuideTarget,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { getQueryObject } from "@/lib/helper/query";
import { NextRequest, NextResponse } from "next/server";
import { resolvePrices } from "@/lib/helper/resolve-price";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { activeOrganizationId, activeTeamId } = session.session;
    const search = req.nextUrl.searchParams;

    const { page, limit, q, cat, offset = 0 } = getQueryObject(search);

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

    // get data
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

    // get total count for pagination
    const [{ total }] = await db
      .select({ total: countDistinct(product.id) })
      .from(product)
      .where(filters);

    // resolved prices
    const prices = await resolvePrices({
      teamId: activeTeamId!,
      productIds: products.map((p) => p.id),
    });

    // pricing lookup
    const pricingMap = new Map(prices.map((p) => [p.id, p]));

    const transformedProducts = products.map((product) => {
      const { lineItems, orderGuideItems, basePrice, ...rest } = product;
      const [lineItem] = lineItems;
      const [orderGuideItem] = orderGuideItems;
      const teamId = orderGuideItem?.orderGuide?.teamId;

      const { finalPrice = 0 } = pricingMap.get(product.id) ?? {};

      return {
        ...rest,
        finalPrice,
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

    return NextResponse.json(
      {
        data: transformedProducts,
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
