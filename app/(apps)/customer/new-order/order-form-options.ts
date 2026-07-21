import { TaxRule } from "@/lib/types";
import { formOptions } from "@tanstack/react-form";

export type OrderItem = {
  productId: number;
  title: string;
  price: string;
  total: string;
  quantity: string;
  image: string | null;
  identifier: string;
  categories: string[];
  isTaxable: boolean;
  pack?: string | null;
  unit?: string | null;
  unitSize?: string | null;
  lastPurchased?: {
    id: number | null;
    quantity: string | null;
    createdAt: Date | string | null;
  } | null;
};

export const defaultValues = {
  shippingAddress: { street: "", city: "", state: "", zip: "" },
  lineItemCount: "0",
  lineItemQuantity: "0",
  lineItemTotal: "0",
  lineItems: [] as OrderItem[],
  subtotal: "0",
  discount: "0",
  taxRule: {} as TaxRule,
  tax: "0",
  total: "0",
  charges: { type: "Fuel Charge", amount: "15" },
  po: "",
  notes: "",
  deliveryDate: new Date().toISOString().split("T")[0],
  deliveryWindow: "Anytime",
  deliveryInstruction: "",
};

export const formOpt = formOptions({
  validators: {
    onSubmit: ({ value }) => {
      if (value.lineItems.length <= 0) {
        return true;
      }
    },
  },
  defaultValues,
});

export const getTotals = (
  items: typeof formOpt.defaultValues.lineItems = [],
  taxRule?: TaxRule,
) => {
  const values = formOpt.defaultValues;
  const lineItems = items || values.lineItems;

  const charges = values?.charges;

  let quantity = 0;
  let subtotal = 0;
  let taxableSubtotal = 0;

  for (const item of lineItems ?? []) {
    const qty = Number(item?.quantity ?? 0);
    const price = Number(item?.price ?? 0);
    const isTaxable = Boolean(item?.isTaxable);
    const lineTotal = qty * price;

    const a =
      Number(item.pack || 0) * Number(item.unitSize || 0) * Number(item.price);
    console.log(a);
    quantity += qty;
    subtotal += a;
    if (isTaxable) {
      taxableSubtotal += lineTotal;
    }
  }

  const tax = (taxableSubtotal * Number(taxRule?.rate ?? 0)) / 100;

  const total = subtotal + Number(charges?.amount ?? 0) + Number(tax);

  return {
    count: lineItems?.length ?? 0,
    quantity,
    subtotal,
    total,
    charges,
    tax,
  };
};
