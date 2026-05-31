import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { getQueryObject } from "@/lib/helper/query";
import { NextRequest, NextResponse } from "next/server";
import { resolvePrices } from "@/lib/helper/resolve-price";
import { eq, and, desc, inArray, countDistinct } from "drizzle-orm";

const PROMO = ["6BMX12", "6BMX11"];

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { activeOrganizationId, activeTeamId } = session.session;
    const search = req.nextUrl.searchParams;

    const { page, limit, offset = 0 } = getQueryObject(search);

    const products = await db.query.product.findMany({
      where: (p, { inArray, and, eq }) =>
        and(
          eq(p.organizationId, activeOrganizationId),
          inArray(p.identifier, PROMO),
        ),
      limit,
      offset,
      orderBy: [desc(product.createdAt), desc(product.id)],
    });

    const [{ total }] = await db
      .select({ total: countDistinct(product.id) })
      .from(product)
      .where(
        and(
          eq(product.organizationId, activeOrganizationId),
          inArray(product.identifier, PROMO),
        ),
      );

    // resolved prices
    const prices = await resolvePrices({
      teamId: activeTeamId!,
      productIds: products.map((p) => p.id),
    });

    // pricing lookup
    const pricingMap = new Map(prices.map((p) => [p.id, p]));

    const transformedProducts = products.map((product) => {
      const { basePrice, ...rest } = product;
      const { finalPrice = 0 } = pricingMap.get(product.id) ?? {};

      return {
        ...rest,
        finalPrice,
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
