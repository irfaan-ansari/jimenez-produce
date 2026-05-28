"use server";

import { db } from "@/lib/db";
import { and, eq, inArray } from "drizzle-orm";
import { handleAction } from "@/lib/helper/error-handler";
import { teamProduct } from "@/lib/db/schema";

/**
 * update products to team
 * @param data { teamId, productIds }
 * @returns inserted and deleted count
 */
export const updateProductsToTeam = handleAction(
  async (data: { teamId: string; productIds: number[] }) => {
    const { teamId, productIds } = data;

    //  Get existing
    const existing = await db
      .select({ productId: teamProduct.productId })
      .from(teamProduct)
      .where(eq(teamProduct.teamId, teamId));

    const existingIds = existing.map((r) => r.productId);

    // to insert
    const toInsert = productIds.filter((id) => !existingIds.includes(id));

    // to delete
    const toDelete = existingIds.filter((id) => !productIds.includes(id));

    const promises = [];
    // Delete removed
    if (toDelete.length) {
      promises.push(
        db
          .delete(teamProduct)
          .where(
            and(
              eq(teamProduct.teamId, teamId),
              inArray(teamProduct.productId, toDelete),
            ),
          ),
      );
    }

    // Insert new
    if (toInsert.length) {
      promises.push(
        db.insert(teamProduct).values(
          toInsert.map((productId) => ({
            teamId,
            productId,
          })),
        ),
      );
    }

    await Promise.all(promises);

    // return inserted and deleted count
    return {
      inserted: toInsert.length,
      deleted: toDelete.length,
    };
  },
);
