import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { priceLevel } from "@/lib/db/schema";
import { handleAction } from "@/lib/helper/error-handler";

/**
 * Create a new price level
 * @param data - Price level data
 * @returns Array containing the created price level
 */
export const createPriceLevel = handleAction(async (data: any) => {
  console.log(data);
  return "text";
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const response = await db.insert(priceLevel).values(data).returning();

  return [response];
});

/**
 * Update a price level
 * @param id - Price level ID
 * @param data - Price level data
 * @returns Array containing the updated price level
 */
export const updatePriceLevel = handleAction(async (id: number, data: any) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const response = await db
    .update(priceLevel)
    .set(data)
    .where(eq(priceLevel.id, id))
    .returning();

  return response;
});
