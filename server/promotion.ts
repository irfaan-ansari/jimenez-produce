"use server";
import {
  promotion,
  PromotionInsertType,
  promotionTarget,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getSession } from "./auth";
import { and, eq, inArray } from "drizzle-orm";
import { handleAction } from "@/lib/helper/error-handler";

interface PromotionProps extends Omit<PromotionInsertType, "organizationId"> {
  teamIds: string[];
}

/**
 * Create a new promotion
 * @param {data} promotion data
 * @returns Created promotion
 */
export const createPromotion = handleAction(async (data: PromotionProps) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId } = session.session;

  const teamIds = data.teamIds;
  const productIds = data.productIds;
  const triggerProductIds = data.triggerProductIds;

  if (data.target == "selected" && (!teamIds || teamIds.length <= 0)) {
    throw new Error("Required atleat 1 customer");
  }

  const [result] = await db
    .insert(promotion)
    .values({
      name: data.name ?? "",
      title: data.title ?? "",
      description: data.description ?? "",
      status: data.status ?? "active",
      badge: data.badge ?? "",
      media: data.media ?? "",
      target: data.target ?? "all",
      placement: data.placement ?? ["new-order"],
      organizationId: activeOrganizationId!,
      productIds,
      triggerProductIds,
    })
    .returning();

  if (teamIds.length > 0) {
    await db.insert(promotionTarget).values(
      teamIds.map((id) => {
        return {
          teamId: id,
          promotionId: result.id,
        };
      }),
    );
  }
  return result;
});

/**
 * update a promotion
 * @param {id, data} promotion data and id
 * @returns updated promotion
 */
export const updatePromotion = handleAction(
  async (id: number, data: PromotionProps) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");

    const { activeOrganizationId } = session.session;

    const teamIds = data.teamIds ?? [];
    const productIds = data.productIds ?? [];
    const triggerProductIds = data.triggerProductIds ?? [];

    const existing = await db.query.promotion.findFirst({
      where: (p, { eq, and }) =>
        and(eq(p.organizationId, activeOrganizationId!), eq(p.id, id)),
    });

    if (!existing) throw new Error("Resource not found");

    if (data.target == "selected" && (!teamIds || teamIds.length <= 0)) {
      throw new Error("Required atleat 1 customer");
    }

    const [result] = await db
      .update(promotion)
      .set({
        name: data.name ?? "",
        title: data.title ?? "",
        description: data.description ?? "",
        status: data.status ?? "active",
        badge: data.badge ?? "",
        media: data.media ?? "",
        target: data.target ?? "all",
        organizationId: activeOrganizationId!,
        placement: data.placement ?? ["new-order"],
        productIds,
        triggerProductIds,
      })
      .where(eq(promotion.id, id))
      .returning();

    // remove all targets if target = all
    if (data.target !== "selected") {
      await db
        .delete(promotionTarget)
        .where(eq(promotionTarget.promotionId, id));

      return result;
    }

    // insert and delete
    const existingTargets = await db.query.promotionTarget.findMany({
      where: (pt, { eq }) => eq(pt.promotionId, id),
    });

    const existingIds = existingTargets.map((r) => r.teamId);

    // to insert
    const toInsert = teamIds.filter((id) => !existingIds.includes(id));

    // to delete
    const toDelete = existingIds.filter((id) => !teamIds.includes(id));

    const promises = [];
    // Delete removed
    if (toDelete.length) {
      promises.push(
        db
          .delete(promotionTarget)
          .where(
            and(
              eq(promotionTarget.promotionId, id),
              inArray(promotionTarget.teamId, toDelete),
            ),
          ),
      );
    }

    // Insert new
    if (toInsert.length) {
      promises.push(
        db.insert(promotionTarget).values(
          toInsert.map((teamId) => ({
            teamId,
            promotionId: id,
          })),
        ),
      );
    }

    await Promise.all(promises);

    return result;
  },
);

/**
 * delete promotion
 * @param id promotion id
 * @returns deleted promotion
 */

export const deletePromotion = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId } = session.session;

  const existing = await db.query.promotion.findFirst({
    where: (p, { eq, and }) =>
      and(eq(p.organizationId, activeOrganizationId!), eq(p.id, id)),
  });

  if (!existing) throw new Error("Resource not found");

  const [result] = await db
    .delete(promotion)
    .where(eq(promotion.id, id))
    .returning();

  return result;
});
