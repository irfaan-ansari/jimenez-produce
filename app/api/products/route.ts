import {
  eq,
  or,
  and,
  ilike,
  ne,
  arrayContains,
  inArray,
  getTableColumns,
  desc,
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
    const { page = 1, limit = 24, status, q, cat } = query;
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
              ilike(product.identifier, `%${q}%`),
            )
          : undefined,
      );

      const products = await db.query.product.findMany({
        where: filters,
        limit: Number(limit),
        offset,
        orderBy: (product, { desc }) => [
          desc(product.createdAt),
          desc(product.id),
        ],
      });

      const productIds = products.map((p) => p.id);

      const inv = await db.query.inventory.findMany({
        where: and(
          inArray(inventory.productId, productIds),
          eq(inventory.locationId, customerRes.locationId!),
        ),
      });

      const lineItems = await db
        .select({
          ...getTableColumns(lineItem),
        })
        .from(lineItem)
        .innerJoin(order, eq(order.id, lineItem.orderId))
        .where(
          and(
            eq(order.customerId, customerRes.id),
            inArray(lineItem.productId, productIds),
          ),
        )
        .orderBy(desc(lineItem.createdAt));

      const inventoryMap = new Map<number, (typeof inv)[0]>();
      const lineItemMap = new Map<number, (typeof lineItems)[0]>();

      for (const i of inv) {
        inventoryMap.set(i.productId!, i);
      }

      for (const li of lineItems) {
        lineItemMap.set(li.productId!, li);
      }

      const finalProducts = products.map((p) => {
        return {
          ...p,
          inventory: inventoryMap.get(p.id) ?? null,
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
        { status: 200 },
      );
    } else {
      const filters = and(
        status ? eq(product.status, status) : undefined,
        q
          ? or(
              ilike(product.title, `%${q}%`),
              ilike(product.description, `%${q}%`),
              ilike(product.identifier, `%${q}%`),
            )
          : undefined,
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
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
}
