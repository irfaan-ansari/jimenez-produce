"use server";

import {
  order,
  lineItem,
  OrderInsertType,
  LineItemInsertType,
  orderGuideItem,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { handleAction } from "@/lib/helper/error-handler";
import { isBefore } from "date-fns";

/**
 * create order
 * @param data
 * @returns order
 */
export const createOrder = handleAction(
  async (
    data: OrderInsertType & {
      lineItems: LineItemInsertType[];
    },
  ) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required");

    const { lineItems, ...rest } = data;

    const [orderRes] = await db
      .insert(order)
      .values({ ...rest, status: "in_progress" })
      .returning();

    const [lineItemsres] = await db
      .insert(lineItem)
      .values(
        lineItems.map((item) => ({
          ...item,
          orderId: orderRes.id,
          locationId: orderRes.locationId,
          userId: session.user.id,
        })),
      )
      .returning();

    return { ...orderRes, lineItems: lineItemsres };
  },
);

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

/**
 * Create order guide item
 * @param productId - ID of product to be added to order guide
 * @returns ID of the created order guide item
 */
export const createOrderGuideItem = handleAction(async (productId: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");

  if (session.user.role !== "customer") {
    throw new Error("Not authorized for this action.");
  }

  const existing = await db.query.orderGuideItem.findFirst({
    where: eq(orderGuideItem.productId, productId),
  });

  if (existing) throw new Error("Item already added to order guide.");

  const [result] = await db
    .insert(orderGuideItem)
    .values({ productId, userId: session.user.id })
    .returning();

  return result;
});

/**
 * Delete order guide item
 * @param id - ID of order guide item to be deleted
 * @returns ID of the deleted order guide item
 */
export const deleteOrderGuideItem = handleAction(async (id: number) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required");

  if (session.user.role !== "customer") {
    throw new Error("Not authorized for this action.");
  }

  const existing = await db.query.orderGuideItem.findFirst({
    where: eq(orderGuideItem.id, id),
  });

  if (!existing || existing.userId !== session.user.id)
    throw new Error("Item not found in your order guide.");

  const [res] = await db
    .delete(orderGuideItem)
    .where(eq(orderGuideItem.id, id))
    .returning();

  return res;
});
