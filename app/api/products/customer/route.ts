import {
  eq,
  or,
  and,
  ne,
  desc,
  ilike,
  arrayContains,
  getTableColumns,
  count,
  isNotNull,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { lineItem, orderGuideItem, product } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user.locationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { locationId, id: userId } = session.user;

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, q, cat, guide = "false" } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      ne(product.status, "archived"),
      eq(product.locationId, locationId),
      cat ? arrayContains(product.categories, [cat]) : undefined,
      q
        ? or(
            ilike(product.title, `%${q}%`),
            ilike(product.description, `%${q}%`),
            ilike(product.identifier, `%${q}%`),
          )
        : undefined,
      guide === "true" ? isNotNull(orderGuideItem.id) : undefined,
    );

    // get all products
    const distinctOn = guide === "true" ? orderGuideItem.id : product.id;

    const products = await db
      .selectDistinctOn([distinctOn], {
        ...getTableColumns(product),
        lastPurchased: {
          id: lineItem.id,
          orderId: lineItem.orderId,
          quantity: lineItem.quantity,
          createdAt: lineItem.createdAt,
        },
        guide: {
          id: orderGuideItem.id,
          quantity: orderGuideItem.quantity,
        },
      })
      .from(product)
      .leftJoin(
        lineItem,
        and(eq(lineItem.productId, product.id), eq(lineItem.userId, userId)),
      )
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.userId, userId!),
        ),
      )
      .where(filters)
      .orderBy(distinctOn, desc(lineItem.createdAt), desc(lineItem.quantity))
      .limit(Number(limit))
      .offset(offset);

    // get total products count
    const [{ total }] = await db
      .selectDistinctOn([distinctOn], {
        total: count(product.id),
      })
      .from(product)
      .leftJoin(
        lineItem,
        and(eq(lineItem.productId, product.id), eq(lineItem.userId, userId!)),
      )
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.userId, userId!),
        ),
      )
      .where(filters)
      .groupBy(distinctOn);

    return NextResponse.json(
      {
        data: products,
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
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
}
