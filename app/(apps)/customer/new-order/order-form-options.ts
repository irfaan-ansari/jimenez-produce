import { formOptions } from "@tanstack/react-form";
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
