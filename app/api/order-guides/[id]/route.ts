import { db } from "@/lib/db";
import { asc } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { orderGuideItem } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = auth.session;

    if (!activeOrganizationId)
      return NextResponse.json(
        { message: "Required account context is missing." },
        { status: 403 },
      );

    const { id } = await params;

    const guide = await db.query.orderGuide.findFirst({
      where: (og, { eq, and, or, isNull }) =>
        and(
          eq(og.id, Number(id)),
          eq(og.organizationId, activeOrganizationId),
          isNull(og.teamId),
        ),
      with: {
        orderGuideItems: {
          with: {
            product: true,
          },
          orderBy: asc(orderGuideItem.position),
        },
        orderGuideTargets: true,
      },
    });

    if (!guide)
      return NextResponse.json(
        { message: ERROR_MESSAGE.NOT_FOUND },
        { status: 404 },
      );
    const { orderGuideItems, orderGuideTargets, ...rest } = guide;

    const items = orderGuideItems.map((item) => {
      const { product, ...rest } = item;
      const { id, ...restProduct } = product;
      return {
        ...rest,
        ...restProduct,
      };
    });

    return NextResponse.json(
      { data: { ...rest, items, teams: orderGuideTargets } },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "API error" }, { status: 500 });
  }
};
