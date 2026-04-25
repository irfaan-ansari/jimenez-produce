import { formOptions, useForm } from "@tanstack/react-form";
import { LineItemInsertType } from "@/lib/db/schema";

export const defaultValues = {
  shippingAddress: { street: "", city: "", state: "", zip: "" },
  lineItemCount: "0",
  lineItemQuantity: "0",
  lineItemTotal: "0",
  lineItems: [] as (LineItemInsertType & { image: string | undefined })[],
  subtotal: "0",
  discount: "0",
  tax: "0",
  total: "0",
  charges: { type: "Fuel Charge", amount: "15" },
  po: "",
  notes: "",
  deliveryDate: new Date().toISOString().split("T")[0],
  deliveryWindow: "",
  deliveryInstruction: "",
};

export const formOpt = formOptions({
  defaultValues,
});

export const getTotals = (
  items: typeof formOpt.defaultValues.lineItems = [],
) => {
  const form = useForm(formOpt);
  const values = form.store.state.values;
  const lineItems = items || values.lineItemTotal;
  const charges = values?.charges;
  const tax = Number(values?.tax ?? 0);

  let quantity = 0;
  let subtotal = 0;

  for (const item of lineItems ?? []) {
    const qty = Number(item?.quantity ?? 0);
    const price = Number(item?.price ?? 0);

    quantity += qty;
    subtotal += qty * price;
  }

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
