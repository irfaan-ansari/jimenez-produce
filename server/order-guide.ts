"use server";
import { handleAction } from "@/lib/helper/error-handler";
import { getSession } from "./auth";
import {
  orderGuide,
  OrderGuideInsertType,
  orderGuideItem,
  OrderGuideItemInsertType,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";
import { eq, inArray, sql } from "drizzle-orm";

/**
 * Create order guide item
 * @param productId - ID of product to be added to order guide
 * @returns ID of the created order guide item
 */
export const createOrderGuide = handleAction(
  async (
    payload: Partial<OrderGuideInsertType> & {
      productIds: number[] | string[];
    },
  ) => {
    const auth = await getSession();
    if (!auth) throw new Error("Authentication required");
    const { role, userId, activeTeamId, activeOrganizationId } = auth.session;

    if (!activeOrganizationId) throw new Error(ERROR_MESSAGE.BAD_REQUEST);

    const isCustomer = role === "customer";

    const {
      productIds = [],
      name = "",
      description = "",

      target = "",
    } = payload;

    if (productIds.length <= 0)
      throw new Error("At least one product is required.");

    const [createdGuide] = await db
      .insert(orderGuide)
      .values({
        name,
        description,
        target: isCustomer ? "team" : target,
        organizationId: activeOrganizationId!,
        teamId: isCustomer ? activeTeamId : null,
        createdBy: userId,
      })
      .returning();

    const guideItemValue = productIds.map((productId, i) => {
      return {
        productId: Number(productId),
        orderGuideId: createdGuide.id,
        position: i + 1,
        quantity: `1`,
      };
    });

    const createdOrderGuideItems = await db
      .insert(orderGuideItem)
      .values(guideItemValue)
      .returning();

    return { ...createdGuide, items: createdOrderGuideItems };
  },
);

export const updateOrderGuide = handleAction(
  async (
    id: number,
    payload: Partial<OrderGuideInsertType> & {
      productIds: number[];
    },
  ) => {
    const { productIds, ...rest } = payload;

    const existingItems = await db.query.orderGuideItem.findMany({
      where: eq(orderGuideItem.orderGuideId, id),
    });

    const toDeleteIds = existingItems
      .filter((item) => !productIds.includes(item.productId))
      .map((item) => item.id);

    const toUpsert = productIds.map((productId, i) => {
      return {
        productId: Number(productId),
        orderGuideId: id,
        position: i + 1,
        quantity: "1",
      };
    });

    // update guide
    const promises: Promise<unknown>[] = [
      db
        .update(orderGuide)
        .set({ ...rest })
        .returning(),
    ];

    // delete items
    if (toDeleteIds.length > 0) {
      promises.push(
        db
          .delete(orderGuideItem)
          .where(inArray(orderGuideItem.id, toDeleteIds)),
      );
    }

    // update items/insert
    if (toUpsert.length > 0) {
      promises.push(
        db
          .insert(orderGuideItem)
          .values(toUpsert)
          .onConflictDoUpdate({
            target: [orderGuideItem.orderGuideId, orderGuideItem.productId],
            set: {
              position: sql`excluded.position`,
              quantity: sql`excluded.quantity`,
            },
          })
          .returning(),
      );
    }

    const [updatedGuide, deletedItems, insertedItems] =
      await Promise.all(promises);
    return { updatedGuide, items: insertedItems };
  },
);
/**
 * Delete order guide item
 * @param id - ID of order guide item to be deleted
 * @returns ID of the deleted order guide item
 */
export const deleteOrderGuideItem = handleAction(async (id: number) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required");

  const { activeTeamId } = session.session;

  if (!activeTeamId || session.user.accountType !== "customer")
    throw new Error("Not authorized for this action.");

  // const existing = await db.query.orderGuideItem.findFirst({
  //   where: and(
  //     eq(orderGuideItem.id, id),
  //     eq(orderGuideItem.teamId, activeTeamId),
  //   ),
  // });

  // if (!existing) throw new Error("Item not found in your order guide.");

  // const [res] = await db
  //   .delete(orderGuideItem)
  //   .where(eq(orderGuideItem.id, id))
  //   .returning();

  // return res;

  return null;
});
