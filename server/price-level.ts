"use server";

import {
  priceLevel,
  PriceLevelInsertType,
  priceLevelItem,
  PriceLevelItemInsertType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { eq, inArray, sql } from "drizzle-orm";
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
