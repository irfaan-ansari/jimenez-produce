import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { catalog } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = session.session;

    if (!activeOrganizationId) {
      return NextResponse.json(
        { message: "No active organization." },
        { status: 403 },
      );
    }

    const { searchParams } = req.nextUrl;

    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, q } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const response = await db.query.catalog.findMany({
      where: (c, { eq }) => eq(c.organizationId, activeOrganizationId),
      limit: Number(limit),
      with: {
        views: true,
      },
      offset,
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    const total = await db.$count(
      catalog,
      eq(catalog.organizationId, activeOrganizationId),
    );

    const productIds = response.flatMap(
      (item) => item.featuredProductIds ?? [],
    );

    const products = await db.query.product.findMany({
      where: (p, { inArray }) => inArray(p.id, productIds),
    });

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const responseWithProducts = response.map((item) => ({
      ...item,
      products: (item.featuredProductIds ?? [])
        .map((productId) => productsMap.get(productId))
        .filter(
          (product): product is (typeof products)[number] =>
            product !== undefined,
        ),
    }));

    return NextResponse.json(
      {
        data: responseWithProducts,
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
    return NextResponse.json(
      { message: "Failed to generate invoice." },
      { status: 400 },
    );
  }
}
