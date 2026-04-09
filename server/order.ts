"use server";

import {
  order,
  lineItem,
  OrderInsertType,
  LineItemInsertType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { handleAction } from "@/lib/helper/error-handler";

/**
 * create order
 * @param data
 * @returns order
 */
export const createOrder = handleAction(
  async (
    data: OrderInsertType & {
      lineItems: LineItemInsertType[];
    }
  ) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required");

    const { lineItems, ...rest } = data;

    const [orderRes] = await db
      .insert(order)
      .values({ ...rest })
      .returning();

    const [lineItemsres] = await db
      .insert(lineItem)
      .values(
        lineItems.map((item) => ({
          ...item,
          orderId: orderRes.id,
          locationId: orderRes.locationId,
          customerId: orderRes.customerId,
        }))
      )
      .returning();

    return { ...orderRes, lineItems: lineItemsres };
  }
);
