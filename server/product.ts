"use server";

import { db } from "@/lib/db";
import { getSession } from "./auth";
import { cookies } from "next/headers";
import { handleAction } from "@/lib/helper/error-handler";
import { product, ProductInsertType } from "@/lib/db/schema";
import { and, eq, ilike, desc, sql, countDistinct } from "drizzle-orm";

export const getProducts = handleAction(
  async (query: Record<string, string>) => {
    const cookieStore = await cookies();
    const email: string = cookieStore.get("customer-email")?.value as any;

    const { page = 1, limit = 24 } = query;

    const offset = (Number(page) - 1) * Number(limit);

    const filters = [ilike(product.image, `%http%`)];

    filters.push(eq(product.status, "active"));

    const products = await db
      .selectDistinctOn([product.identifier], {
        id: product.id,
        title: product.title,
        image: product.image,
        identifier: product.identifier,
      })
      .from(product)
      .limit(email ? Number(limit) : 20)
      .where(and(...filters))
      .offset(email ? offset : 0)
      .orderBy(product.identifier, desc(product.createdAt));

    const [{ total }] = await db
      .select({
        total: countDistinct(product.identifier),
      })
      .from(product)
      .where(and(...filters));

    return {
      data: products,
      access: !!email,
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / (limit as number)),
      },
    };
  },
);

/**
 * Create a product
 * @param data - The product to be created
 * @returns ID of the created product
 */
export const createProduct = handleAction(async (data: ProductInsertType) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId } = session.session;
  const { status, ...rest } = data;

  const [result] = await db
    .insert(product)
    .values({
      ...rest,
      status: status?.toLowerCase(),
      organizationId: activeOrganizationId,
    })
    .returning();

  return result;
});

/**
 * Import products
 *
 */
export const importProducts = handleAction(
  async (data: Partial<ProductInsertType>[]) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");

    const { activeOrganizationId } = session.session;

    const mappedData = data
      .filter((i) => i.identifier && !isNaN(Number(i.basePrice!)))
      .map((item) => {
        return {
          ...item,
          organizationId: activeOrganizationId,
        };
      });

    const result = await db
      .insert(product)
      .values(mappedData as ProductInsertType[])
      .onConflictDoUpdate({
        target: [product.identifier, product.organizationId],
        set: {
          basePrice: sql`COALESCE(excluded.basePrice, ${product.basePrice})`,
        },
      })
      .returning({ id: product.id });

    return result.length;
  },
);

/**
 * Upddate a product
 * @param id - ID of product to be updated
 * @param data - Product data to be updated
 * @returns
 */
export const updateProduct = handleAction(
  async (id: number, data: ProductInsertType) => {
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
  },
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
