import { db } from "@/lib/db";
import {
  and,
  asc,
  count,
  DrizzleQueryError,
  eq,
  exists,
  ilike,
  or,
} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { resolvePrices } from "@/lib/helper/resolve-price";
import { withPermission } from "@/lib/helper/with-permission";
import { orderGuideTarget, orderGuideItem, orderGuide } from "@/lib/db/schema";

export const GET = async (req: NextRequest) => {
  try {
    const auth = await withPermission({
      resource: "orderGuide",
      action: "read:team",
    });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, q, limit = 24 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { activeTeamId, activeOrganizationId } = auth.session;

    const [guides, [{ total }]] = await Promise.all([
      db.query.orderGuide.findMany({
        where: (og, { and, or, eq, exists, ilike }) =>
          and(
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
            q ? ilike(og.name, `%${q}%`) : undefined,
          ),
        with: {
          orderGuideItems: {
            with: {
              product: true,
            },
            orderBy: asc(orderGuideItem.position),
          },
        },
        limit: 24,
        offset,
      }),
      db
        .select({ total: count() })
        .from(orderGuide)
        .leftJoin(
          orderGuideTarget,
          eq(orderGuideTarget.orderGuideId, orderGuide.id),
        )
        .where(
          and(
            eq(orderGuide.organizationId, activeOrganizationId),
            or(
              eq(orderGuide.teamId, activeTeamId),
              exists(
                db
                  .select()
                  .from(orderGuideTarget)
                  .where(
                    and(
                      eq(orderGuideTarget.orderGuideId, orderGuide.id),
                      eq(orderGuideTarget.teamId, activeTeamId),
                    ),
                  ),
              ),
            ),
            q ? ilike(orderGuide.name, `%${q}%`) : undefined,
          ),
        ),
    ]);

    const productIds = [
      ...new Set(
        guides.flatMap((g) => g.orderGuideItems.map((item) => item.productId)),
      ),
    ];

    const prices = await resolvePrices({
      teamId: activeTeamId,
      productIds,
    });

    const pricingMap = new Map(prices.map((p) => [p.id, p]));

    const transformedGuides = guides.map((guideItem) => {
      const { orderGuideItems, ...rest } = guideItem;
      const items = orderGuideItems
        .toSorted((a, b) => a.position - b.position)
        .map((item) => {
          const price = pricingMap.get(item.productId);
          const { basePrice, ...restItem } = item.product;
          return {
            ...restItem,
            position: item.position,
            quantity: item.quantity,
            finalPrice: price?.finalPrice ?? 0,
          };
        });

      return {
        ...rest,
        items,
      };
    });

    return NextResponse.json(
      {
        data: transformedGuides,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    if (error instanceof DrizzleQueryError) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
};
