"use server";
import {
  db,
  lineItem,
  LineItemInsertType,
  order,
  OrderInsertType,
} from "@/services/db";
import { getTaxRule } from "./tax-rule";
import { handleAction } from "@/lib/helper/error-handler";
import { getSession } from "@/services/auth";

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
    const auth = await getSession();

    if (!auth) throw new Error("Authentication required");

    const { lineItems, ...rest } = data;

    if (lineItems.length <= 0) throw new Error("Add atleast one item");

    const { activeTeamId, activeOrganizationId, userId } = auth.session;

    // TOTO get price levels
    const { data: taxRule, error } = await getTaxRule();

    if (error) throw new Error("Failed to submit your order, please try again");

    const taxName = taxRule?.name;
    const taxRate = Number(taxRule?.rate ?? 0);

    //  totals
    const charges = { type: "Fuel Charge", amount: 15 };
    const totals = {
      lineItemCount: 0,
      lineItemQuantity: 0,
      lineItemTotal: 0,
      subtotal: 0,
      taxableSubtotal: 0,
      nonTaxableSubtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };

    for (const [index, item] of lineItems.entries()) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const isTaxable = Boolean(item.isTaxable);

      const lineSubtotal = qty * price;

      //  line tax
      const lineTax = isTaxable ? (lineSubtotal * taxRate) / 100 : 0;

      const lineTotal = lineSubtotal + lineTax;

      // assign line item fields
      lineItems[index].subtotal = String(lineSubtotal.toFixed(2));
      lineItems[index].taxAmount = String(lineTax.toFixed(2));
      lineItems[index].total = String(lineTotal.toFixed(2));

      // accumulate totals
      totals.lineItemCount++;
      totals.lineItemQuantity += qty;
      totals.lineItemTotal += lineSubtotal;
      totals.subtotal += lineSubtotal;

      if (isTaxable) {
        totals.taxableSubtotal += lineSubtotal;
        totals.tax += lineTax;
      } else {
        totals.nonTaxableSubtotal += lineSubtotal;
      }
    }

    // final total
    totals.total =
      totals.subtotal -
      totals.discount +
      totals.tax +
      Number(charges.amount || 0);

    // stringify for DB
    const stringTotals = Object.fromEntries(
      Object.entries(totals).map(([key, value]) => [
        key,
        String(
          key === "lineItemCount" || key === "lineItemQuantity"
            ? value
            : value.toFixed(2),
        ),
      ]),
    );

    // create order
    const [orderRes] = await db
      .insert(order)
      .values({
        ...rest,
        ...stringTotals,
        taxName,
        taxRate: String(taxRate),
        charges: {
          ...charges,
          amount: String(charges.amount),
        },
        status: "in_progress",
        organizationId: activeOrganizationId,
        teamId: activeTeamId,
        userId,
      })
      .returning();

    // create order line items
    const lineItemsWithOrderId = lineItems.map((item) => {
      const { createdAt, updatedAt, ...rest } = item;
      return {
        ...rest,
        orderId: orderRes.id,
        organizationId: activeOrganizationId,
        teamId: activeTeamId,
      };
    });

    const [lineItemsres] = await db
      .insert(lineItem)
      .values(lineItemsWithOrderId)
      .returning();

    return { ...orderRes, lineItems: lineItemsres };
  },
);
