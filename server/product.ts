"use server";

import {
  customer,
  customerInvite,
  inventory,
  InventoryInsertType,
  product,
  ProductInsertType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { cookies } from "next/headers";
import { handleAction } from "@/lib/helper/error-handler";
import { and, eq, ilike, or, sql, desc } from "drizzle-orm";

export const getProducts = handleAction(
  async (query: Record<string, string>) => {
    const session = await getSession();

    const cookieStore = await cookies();
    const email: string = cookieStore.get("customer-email")?.value as any;

    const [customerRes, inviteRes] = await Promise.all([
      db.query.customer.findFirst({
        where: and(
          or(
            eq(customer.companyEmail, email),
            eq(customer.officerEmail, email)
          ),
          eq(customer.status, "approved")
        ),
      }),
      db.query.customerInvite.findFirst({
        where: and(
          eq(customerInvite.email, email),
          eq(customerInvite.status, "approved")
        ),
      }),
    ]);

    const isPublicUser = !session && !customerRes && !inviteRes;

    const { page = 1, limit = 24, status, q } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const statusFilter = isPublicUser
      ? eq(product.status, "active")
      : status
      ? eq(product.status, status)
      : undefined;

    const filters = and(
      statusFilter,
      q ? ilike(product.title, `%${q}%`) : undefined
    );

    const products = await db
      .select()
      .from(product)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(product.createdAt));

    const total = await db.$count(product);

    return {
      data: products,
      access: !isPublicUser,
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / (limit as number)),
      },
    };
  }
);

/**
 * Create a product
 * @param data - The product to be created
 * @returns ID of the created product
 */
export const createProduct = handleAction(
  async (
    data: ProductInsertType & {
      inventory: InventoryInsertType[];
    }
  ) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");

    const { inventory: inventoryData = [], ...rest } = data;

    const [result] = await db
      .insert(product)
      .values({ ...rest, status: rest.status?.toLowerCase() })
      .returning();

    const [inv] = await db
      .insert(inventory)
      .values(
        inventoryData.map((inv) => ({
          ...inv,
          productId: result.id,
        }))
      )
      .returning();

    return { ...result, inventory: inv };
  }
);

/**
 * Upddate a product
 * @param id - ID of product to be updated
 * @param data - Product data to be updated
 * @returns
 */
export const updateProduct = handleAction(
  async (
    id: number,
    data: ProductInsertType & {
      inventory: InventoryInsertType[];
    }
  ) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const existing = await db.query.product.findFirst({
      where: eq(product.id, id),
    });

    if (!existing) throw new Error("Resource not found.");

    const [result] = await db
      .update(product)
      .set(data)
      .where(eq(product.id, id))
      .returning();

    return result;
  }
);

/**
 * delete product
 * @param id
 * @returns Id of the deleted record
 */
export const deleteProduct = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const existing = await db.query.product.findFirst({
    where: eq(product.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning({ id: product.id });

  return result;
});

/**
 * Get categories
 * @returns list of unique categories
 */
export const getCategories = async () => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const { rows } = await db.execute(sql`
                    SELECT DISTINCT jsonb_array_elements_text(categories) AS label
                    FROM ${product}
                    WHERE categories IS NOT NULL
                  `);
  const categories = rows.map((row) => row.label as string);

  return { data: categories };
};
