"use server";
import {
  orderGuide,
  OrderGuideInsertType,
  orderGuideItem,
  orderGuideTarget,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { and, eq, inArray, sql } from "drizzle-orm";
import { handleAction } from "@/lib/helper/error-handler";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

/**
 * Create order guide item
 * @param productId - ID of product to be added to order guide
 * @returns ID of the created order guide item
 */
export const createOrderGuide = handleAction(
  async (
    payload: Partial<OrderGuideInsertType> & {
      productIds: number[];
      teamIds?: string[];
    },
  ) => {
    const auth = await getSession();
    if (!auth) throw new Error("Authentication required");
    const { role, userId, activeTeamId, activeOrganizationId } = auth.session;

    if (!activeOrganizationId) throw new Error(ERROR_MESSAGE.BAD_REQUEST);

    const isCustomer = role === "customer";

    const { productIds = [], teamIds, name = "", description = "" } = payload;

    if (productIds.length <= 0)
      throw new Error("At least one product is required.");

    const [createdGuide] = await db
      .insert(orderGuide)
      .values({
        name,
        description,
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

    const teamValues =
      teamIds?.map((teamId) => ({
        orderGuideId: createdGuide.id,
        teamId: String(teamId),
      })) ?? [];

    if (teamValues?.length > 0) {
      await db.insert(orderGuideTarget).values(teamValues);
    }

    return { ...createdGuide, items: createdOrderGuideItems };
  },
);

/**
 * update order guide
 * @param id - ID of order guide to be updated
 * @param payload - payload for updating order guide
 * @returns updated order guide
 */
export const updateOrderGuide = handleAction(
  async (
    id: number,
    payload: Partial<OrderGuideInsertType> & {
      productIds: number[];
      teamIds?: string[];
    },
  ) => {
    const auth = await getSession();
    if (!auth) throw new Error("Authentication required");
    const { role, activeTeamId, activeOrganizationId } = auth.session;

    if (!activeOrganizationId) throw new Error(ERROR_MESSAGE.BAD_REQUEST);

    const isCustomer = role === "customer";

    const {
      productIds = [],
      teamIds = [],
      name = "",
      description = "",
      position = "",
    } = payload;

    const [existingOrderGuide, existingItems] = await Promise.all([
      db.query.orderGuide.findFirst({
        where: eq(orderGuide.id, id),
      }),
      db.query.orderGuideItem.findMany({
        where: eq(orderGuideItem.orderGuideId, id),
      }),
    ]);

    if (!existingOrderGuide) throw new Error("Resource not found.");

    if (isCustomer && existingOrderGuide.teamId !== activeTeamId)
      throw new Error("Not authorized for this action");

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
        .set({ name, description, position: Number(position ?? 0) })
        .where(eq(orderGuide.id, id))
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

    if (teamIds.length > 0 && !isCustomer) {
      const targets = await db.query.orderGuideTarget.findMany({
        where: eq(orderGuideTarget.orderGuideId, id),
      });

      const toDeleteIds = targets
        .filter((target) => !teamIds.includes(target.teamId))
        .map((target) => target.id);

      const toUpsert = teamIds.map((teamId) => ({
        orderGuideId: id,
        teamId: String(teamId),
      }));

      if (toDeleteIds.length > 0) {
        promises.push(
          db
            .delete(orderGuideTarget)
            .where(inArray(orderGuideTarget.id, toDeleteIds)),
        );
      }

      if (toUpsert.length > 0) {
        promises.push(
          db
            .insert(orderGuideTarget)
            .values(toUpsert)
            .onConflictDoUpdate({
              target: [orderGuideTarget.orderGuideId, orderGuideTarget.teamId],
              set: {
                teamId: sql`excluded.team_id`,
              },
            }),
        );
      }
    }

    const [
      updatedGuide,
      deletedItems,
      insertedItems,
      deletedTargets,
      insertedTargets,
    ] = await Promise.all(promises);

    return { updatedGuide };
  },
);

/**
 * add order guide item
 * @param orderGuideId - ID of order guide to add item to
 * @param productId - ID of product to add
 * @returns added order guide item
 */
export const addOrderGuideItem = handleAction(
  async ({
    orderGuideId,
    productId,
  }: {
    orderGuideId: number;
    productId: number;
  }) => {
    const auth = await getSession();

    if (!auth) throw new Error("Authentication required");

    const { role, activeTeamId, activeOrganizationId } = auth.session;

    if (!activeOrganizationId || !activeTeamId)
      throw new Error(ERROR_MESSAGE.BAD_REQUEST);

    const isCustomer = role === "customer";

    const existing = await db.query.orderGuide.findFirst({
      where: and(
        eq(orderGuide.id, orderGuideId),
        eq(orderGuide.teamId, activeTeamId),
      ),
    });

    if (!existing) throw new Error("Resource not found.");

    if (isCustomer && existing.teamId !== activeTeamId)
      throw new Error("Not authorized for this action");

    const [response] = await db
      .insert(orderGuideItem)
      .values({
        productId,
        orderGuideId,
        quantity: "1",
      })
      .returning();

    return response;
  },
);

/**
 * Delete order guide item
 * @param id - ID of order guide item to be deleted
 * @returns ID of the deleted order guide item
 */
export const deleteOrderGuide = handleAction(async (id: number) => {
  const auth = await getSession();
  if (!auth) throw new Error("Authentication required");
  const { role, activeTeamId, activeOrganizationId } = auth.session;

  if (!activeOrganizationId) throw new Error(ERROR_MESSAGE.BAD_REQUEST);

  const isCustomer = role === "customer";

  const existing = await db.query.orderGuide.findFirst({
    where: eq(orderGuide.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  if (isCustomer && existing.teamId !== activeTeamId)
    throw new Error("Not authorized for this action");

  const [res] = await db
    .delete(orderGuide)
    .where(eq(orderGuide.id, id))
    .returning();

  return res;
});

/**
 * Updates multiple order guides.
 */
export const updateOrderGuides = handleAction(
  async (
    guides: {
      id: number;
      productIds: number[];
    }[],
  ) => {
    const auth = await getSession();

    if (!auth) {
      throw new Error("Authentication required");
    }

    const { activeOrganizationId } = auth.session;

    if (!activeOrganizationId) {
      throw new Error(ERROR_MESSAGE.BAD_REQUEST);
    }

    const existingGuides = await db.query.orderGuide.findMany({
      where: inArray(
        orderGuide.id,
        guides.map((g) => g.id),
      ),
    });

    const existingGuideMap = new Map(
      existingGuides.map((guide) => [guide.id, guide]),
    );

    const promises = guides
      .filter((guide) => guide.productIds.length > 0)
      .map((guide, index) => {
        const existingGuide = existingGuideMap.get(guide.id);

        return updateOrderGuide(guide.id, {
          name: existingGuide?.name,
          description: existingGuide?.description,
          position: index + 1,
          productIds: guide.productIds,
        });
      });
    await Promise.all(promises);

    return { success: true };
  },
);
