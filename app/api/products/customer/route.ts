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
import { inventory, lineItem, orderGuideItem, product } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user.customerId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { customerId, locationId } = session.user;

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, q, cat, guide = "false" } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      ne(product.status, "archived"),
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

    //   const products = await db
    //     .selectDistinctOn([product.id], {
    //       ...getTableColumns(product),
    //       price: inventory.price,
    //       stock: inventory.stock,
    //       lastPurchased: {
    //         id: lineItem.id,
    //         quantity: lineItem.quantity,
    //         createdAt: lineItem.createdAt,
    //       },
    //     })
    //     .from(product)
    //     .innerJoin(
    //       lineItem,
    //       and(
    //         eq(product.id, lineItem.productId),
    //         eq(lineItem.customerId, customerId!),
    //       ),
    //     )
    //     .innerJoin(
    //       inventory,
    //       and(
    //         eq(inventory.productId, product.id),
    //         eq(inventory.locationId, locationId!),
    //       ),
    //     )
    //     .where(filters)
    //     .orderBy(product.id, desc(lineItem.createdAt), desc(lineItem.quantity))
    //     .limit(Number(limit))
    //     .offset(offset);

    //   // get total products count
    //   const [{ total }] = await db
    //     .selectDistinct({
    //       total: count(product.id),
    //     })
    //     .from(product)
    //     .innerJoin(
    //       lineItem,
    //       and(
    //         eq(product.id, lineItem.productId),
    //         eq(lineItem.customerId, customerId!),
    //       ),
    //     )
    //     .innerJoin(
    //       inventory,
    //       and(
    //         eq(inventory.productId, product.id),
    //         eq(inventory.locationId, locationId!),
    //         and(isNotNull(inventory.price), ne(inventory.price, "0")),
    //       ),
    //     )
    //     .where(filters);

    //   return NextResponse.json(
    //     {
    //       data: products,
    //       pagination: {
    //         page,
    //         limit,
    //         total: total,
    //         totalPages: Math.ceil(total / (limit as number)),
    //       },
    //     },
    //     { status: 200 },
    //   );
    // }

    // get all products
    const distinctOn = guide === "true" ? orderGuideItem.id : product.id;

    const products = await db
      .selectDistinctOn([distinctOn], {
        ...getTableColumns(product),
        price: inventory.price,
        offerPrice: inventory.offerPrice,
        stock: inventory.stock,
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
        and(
          eq(lineItem.productId, product.id),
          eq(lineItem.customerId, customerId!),
        ),
      )
      .innerJoin(
        inventory,
        and(
          eq(inventory.productId, product.id),
          eq(inventory.locationId, locationId!),
          and(isNotNull(inventory.price), ne(inventory.price, "0")),
        ),
      )
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.customerId, customerId!),
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
        and(
          eq(lineItem.productId, product.id),
          eq(lineItem.customerId, customerId!),
        ),
      )
      .innerJoin(
        inventory,
        and(
          eq(inventory.productId, product.id),
          eq(inventory.locationId, locationId!),
        ),
      )
      .leftJoin(
        orderGuideItem,
        and(
          eq(orderGuideItem.productId, product.id),
          eq(orderGuideItem.customerId, customerId!),
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
