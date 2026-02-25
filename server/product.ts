"use server";

import { db } from "@/lib/db";
import { getSession } from "./auth";
import { eq, sql } from "drizzle-orm";
import { product, ProductInsertType } from "@/lib/db/schema";

/**
 * Create a product
 * @param data - The product to be created
 * @returns ID of the created product
 */
export const createProduct = async (data: ProductInsertType) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  if (!data.image)
    data.image = `https://api.dicebear.com/9.x/initials/svg?seed=${data.title}&scale=80`;

  const [result] = await db
    .insert(product)
    .values({ ...data, status: data.status?.toLowerCase() })
    .returning({ id: product.id });

  return result;
};

/**
 * Upddate a product
 * @param id - ID of product to be updated
 * @param data - Product data to be updated
 * @returns
 */
export const updateProduct = async (id: number, data: ProductInsertType) => {
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
    .returning({ id: product.id });
  return result;
};

/**
 * delete product
 * @param id
 * @returns Id of the deleted record
 */
export const deleteProduct = async (id: number) => {
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
};

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
