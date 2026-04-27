"use server";

import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { getSession } from "./auth";
import { taxRule, TaxRuleInsertType } from "@/lib/db/schema";
import { handleAction } from "@/lib/helper/error-handler";

/**
 * Create a new tax rule
 * @param data Tax rule data
 * @returns Created tax rule
 */
export const createTaxRule = handleAction(async (data: TaxRuleInsertType) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId } = session.session;

  const [result] = await db
    .insert(taxRule)
    .values({
      name: data.name,
      rate: String(Number(data.rate).toFixed(2)),
      organizationId: activeOrganizationId,
    })
    .returning();

  return result;
});

/**
 * Update a new tax rule
 * @param id id of the tax rule
 * @param data Tax rule data
 * @returns Updated tax rule
 */
export const updateTaxRule = handleAction(
  async (id: number, data: TaxRuleInsertType) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");

    const { activeOrganizationId } = session.session;

    const exists = await db.query.taxRule.findFirst({
      where: and(
        eq(taxRule.id, id),
        eq(taxRule.organizationId, activeOrganizationId!),
      ),
    });

    if (!exists) throw new Error("Tax rule not found.");

    const [result] = await db
      .update(taxRule)
      .set({
        name: data.name,
        rate: String(Number(data.rate).toFixed(2)),
      })
      .where(eq(taxRule.id, id))
      .returning();

    return result;
  },
);

/**
 * Delete a tax rule
 * @param id id of the tax rule
 * @returns Deleted tax rule
 */
export const deleteTaxRule = handleAction(async (id: number) => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId } = session.session;

  const exists = await db.query.taxRule.findFirst({
    where: and(
      eq(taxRule.id, id),
      eq(taxRule.organizationId, activeOrganizationId!),
    ),
  });

  if (!exists) throw new Error("Tax rule not found.");

  const [result] = await db
    .delete(taxRule)
    .where(eq(taxRule.id, id))
    .returning();

  return result;
});
