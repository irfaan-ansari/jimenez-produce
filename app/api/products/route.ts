import {
  eq,
  or,
  and,
  ne,
  desc,
  ilike,
  inArray,
  arrayContains,
  getTableColumns,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { customer, inventory, lineItem, order, product } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, status, q, cat, guide } = query;
    const offset = ((page as number) - 1) * Number(limit);

    if (session.user.role === "customer") {
      const customerRes = await db.query.customer.findFirst({
        where: eq(customer.accountId, session.user.id),
      });

      if (!customerRes) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const filters = and(
        ne(product.status, "archived"),
        cat ? arrayContains(product.categories, [cat]) : undefined,
        q
          ? or(
              ilike(product.title, `%${q}%`),
              ilike(product.description, `%${q}%`),
              ilike(product.identifier, `%${q}%`)
            )
          : undefined
      );

      const products = await db
        .select({
          ...getTableColumns(product),
          price: inventory.price,
          offerPrice: inventory.offerPrice,
          stock: inventory.stock,
        })
        .from(product)
        .innerJoin(
          inventory,
          and(
            eq(inventory.productId, product.id),
            eq(inventory.locationId, customerRes.locationId!)
          )
        )
        .where(filters)
        .orderBy(desc(product.createdAt), desc(product.id))
        .limit(Number(limit))
        .offset(offset);

      const productIds = products.map((p) => p.id);

      const lineItems = await db
        .select({
          ...getTableColumns(lineItem),
        })
        .from(lineItem)
        .innerJoin(order, eq(order.id, lineItem.orderId))
        .where(
          and(
            eq(order.customerId, customerRes.id),
            inArray(lineItem.productId, productIds)
          )
        )
        .orderBy(desc(lineItem.createdAt));

      const lineItemMap = new Map<number, (typeof lineItems)[0]>();

      for (const li of lineItems) {
        lineItemMap.set(li.productId!, li);
      }

      const finalProducts = products.map((p) => {
        return {
          ...p,
          lastPurchased: lineItemMap.get(p.id) ?? null,
        };
      });

      const total = await db.$count(product, filters);

      return NextResponse.json(
        {
          data: finalProducts,
          pagination: {
            page,
            limit,
            total: total,
            totalPages: Math.ceil(total / (limit as number)),
          },
        },
        { status: 200 }
      );
    } else {
      const filters = and(
        status ? eq(product.status, status) : undefined,
        q
          ? or(
              ilike(product.title, `%${q}%`),
              ilike(product.description, `%${q}%`),
              ilike(product.identifier, `%${q}%`)
            )
          : undefined
      );

      const products = await db.query.product.findMany({
        where: filters,
        limit: Number(limit),
        offset,
        orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          inventory: true,
        },
      });

      const total = await db.$count(product, filters);

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
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
