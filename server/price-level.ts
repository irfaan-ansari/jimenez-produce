"use server";

import {
  priceLevel,
  PriceLevelInsertType,
  priceLevelItem,
  PriceLevelItemInsertType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { and, eq, inArray, sql } from "drizzle-orm";
import { handleAction } from "@/lib/helper/error-handler";

type PriceLevelItemInput = Omit<PriceLevelItemInsertType, "priceLevelId">;
/**
 * Create a new price level
 * @param data - Price level data
 * @returns Array containing the created price level
 */
export const createPriceLevel = handleAction(
  async (
    data: PriceLevelInsertType & {
      items: PriceLevelItemInput[];
    },
  ) => {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      throw new Error("Authentication required.");

    const { activeOrganizationId } = session.session;
    const { name, items, adjustmentType, adjustmentValue, appliesTo, status } =
      data;

    const [createdPriceLevel] = await db
      .insert(priceLevel)
      .values({
        name,
        appliesTo,
        status,
        adjustmentType,
        adjustmentValue,
        organizationId: activeOrganizationId,
      })
      .returning();

    const filteredItems = items
      .filter((item) => Number(item.price ?? 0) !== 0)
      .map((item) => ({
        productId: item.productId,
        price: item.price,
        priceLevelId: createdPriceLevel.id,
      }));

    if (filteredItems.length > 0) {
      await db.insert(priceLevelItem).values(filteredItems);
    }

    return { data: createdPriceLevel };
  },
);

/**
 * Update a price level
 * @param id - Price level ID
 * @param data - Price level data
 * @returns Array containing the updated price level
 */
export const updatePriceLevel = handleAction(
  async (
    id: number,
    data: PriceLevelInsertType & {
      items: PriceLevelItemInput[];
    },
  ) => {
    const session = await getSession();
    if (!session || !session.session.activeOrganizationId) {
      throw new Error("Authentication required.");
    }

    const { name, appliesTo, status, items, adjustmentType, adjustmentValue } =
      data;

    const [updatedPriceLevel] = await db
      .update(priceLevel)
      .set({
        name,
        appliesTo,
        status,
        adjustmentType,
        adjustmentValue,
      })
      .where(eq(priceLevel.id, id))
      .returning();

    const filteredItems = items
      .filter((item) => Number(item.price ?? 0) !== 0)
      .map((item) => ({
        productId: item.productId,
        price: item.price,
        priceLevelId: id,
      }));

    // 3. Get existing items
    const existingItems = await db
      .select()
      .from(priceLevelItem)
      .where(eq(priceLevelItem.priceLevelId, id));

    // 1. Delete removed items
    const toDelete = existingItems
      .filter(
        (item) => !filteredItems.some((f) => f.productId === item.productId),
      )
      .map((item) => item.id);

    if (toDelete.length > 0) {
      await db
        .delete(priceLevelItem)
        .where(inArray(priceLevelItem.id, toDelete));
    }

    // 2. Upsert (handles both insert + update)
    if (filteredItems.length > 0) {
      await db
        .insert(priceLevelItem)
        .values(filteredItems)
        .onConflictDoUpdate({
          target: [priceLevelItem.priceLevelId, priceLevelItem.productId],
          set: {
            price: sql`excluded.price`,
          },
        });
    }

    return { data: updatedPriceLevel };
  },
);

/**
 * Delete a price level
 * @param id - Price level ID
 * @returns deleted price level
 */
export const deletePriceLevel = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session || !session.session.activeOrganizationId) {
    throw new Error("Authentication required.");
  }

  const existingPriceLevel = await db
    .select()
    .from(priceLevel)
    .where(eq(priceLevel.id, id));

  if (!existingPriceLevel) throw new Error("Price level not found.");

  const [deletedPriceLevel] = await db
    .delete(priceLevel)
    .where(eq(priceLevel.id, id))
    .returning();

  return { data: deletedPriceLevel };
});

/**
 * bulk update/insert price level
 * @param values
 */
export const bulkUpdate = handleAction(
  async (values: Record<string, Record<string, string>[]>) => {
    const session = await getSession();

    if (!session?.session.activeOrganizationId) {
      throw new Error("Authentication required.");
    }

    const organizationId = session.session.activeOrganizationId;

    await Promise.all(
      Object.entries(values).map(async ([key, items]) => {
        // get the price level by name
        const priceLevel = await db.query.priceLevel.findFirst({
          where: (pl, { eq, and }) =>
            and(eq(pl.organizationId, organizationId), eq(pl.name, key)),
        });

        if (!priceLevel || !items.length) {
          return;
        }

        // get the products
        const products = await db.query.product.findMany({
          where: (p, { and, eq, inArray }) =>
            and(
              eq(p.organizationId, organizationId),
              inArray(
                p.identifier,
                items.map((i) => i.identifier),
              ),
            ),
        });

        if (!products.length) {
          return;
        }

        const productMap = new Map(products.map((p) => [p.identifier, p]));

        const toUpsert = [];
        const toDelete: number[] = [];

        for (const item of items) {
          const product = productMap.get(item.identifier);

          if (!product) continue;

          const csvPrice = Number(item.price);

          if (!item.price || Number.isNaN(csvPrice)) {
            toDelete.push(product.id);
            continue;
          }

          if (Number(product.basePrice) === csvPrice) continue;

          toUpsert.push({
            priceLevelId: priceLevel.id,
            productId: product.id,
            price: String(csvPrice.toFixed(2)),
          });
        }

        const promises = [];

        // delete
        if (toDelete.length)
          promises.push(
            db
              .delete(priceLevelItem)
              .where(
                and(
                  eq(priceLevelItem.priceLevelId, priceLevel.id),
                  inArray(priceLevelItem.productId, toDelete),
                ),
              ),
          );

        // insert or update
        if (toUpsert.length) {
          db.insert(priceLevelItem)
            .values(toUpsert)
            .onConflictDoUpdate({
              target: [priceLevelItem.priceLevelId, priceLevelItem.productId],
              set: {
                price: sql`excluded.price`,
              },
            });
        }

        await Promise.all(promises);

        return {
          level: key,
          upserted: toUpsert.length,
          deleted: toDelete.length,
        };
      }),
    );

    return true;
  },
);
