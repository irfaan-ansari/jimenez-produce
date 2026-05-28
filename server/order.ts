"use server";

import { order, OrderInsertType } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isBefore } from "date-fns";
import { getSession } from "@/services/auth";

import { handleAction } from "@/lib/helper/error-handler";

/**
 * update order
 * @param id
 * @param data
 * @returns
 */
export const updateOrder = handleAction(
  async (id: number, data: Partial<OrderInsertType>) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required");

    const { ...rest } = data;

    const existing = await db.query.order.findFirst({
      where: eq(order.id, id),
    });

    if (!existing) throw new Error("Resource not found.");

    if (rest.deliveryDate && isBefore(rest.deliveryDate, new Date())) {
      throw new Error("Cannot update order after delivery date.");
    }

    const [result] = await db
      .update(order)
      .set(rest)
      .where(eq(order.id, id))
      .returning();

    return result;
  },
);

/**
 * delete order
 * @param id
 * @returns
 */
export const deleteOrder = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");

  const existing = await db.query.order.findFirst({
    where: eq(order.id, id),
  });
  if (!existing) throw new Error("Resource not found.");

  const [res] = await db.delete(order).where(eq(order.id, id)).returning();

  return res;
});
