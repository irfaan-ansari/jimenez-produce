import { formOptions } from "@tanstack/react-form";
import { InventoryInsertType, LineItemInsertType } from "@/lib/db/schema";

export const defaultValues = {
  shippingAddress: { street: "", city: "", state: "", zip: "" },
  locationId: undefined as any,
  customerId: undefined as any,
  receiverName: "",
  receiverPhone: "",
  lineItemCount: "0",
  lineItemQuantity: "0",
  lineItemTotal: "0",
  lineItems: [] as (LineItemInsertType & { image: string | undefined } & {
    inventory: InventoryInsertType;
  })[],
  subtotal: "0",
  discount: "0",
  tax: "0",
  total: "0",
  po: "",
  notes: "",
  deliveryDate: "",
  deliveryWindow: "",
  deliveryInstruction: "",
};

export const formOpt = formOptions({
  defaultValues,
});
