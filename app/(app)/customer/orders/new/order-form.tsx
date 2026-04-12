"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import { ItemList } from "./item-list";
import { OrderCart } from "./order-cart";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { getNextDayDate } from "@/lib/utils";
import { formOpt } from "./order-form-options";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { CustomerSelectType } from "@/lib/db/schema";
import { useQueryClient } from "@tanstack/react-query";

export const OrderForm = ({ customer }: { customer: CustomerSelectType }) => {
  const router = useRouter();
  const confirm = useConfirm();

  const queryClient = useQueryClient();
  const {
    deliverySchedule,
    companyStreet,
    companyCity,
    companyState,
    companyZip,
  } = customer;
  const form = useAppForm({
    ...formOpt,
    defaultValues: {
      ...formOpt.defaultValues,
      shippingAddress: {
        street: companyStreet,
        city: companyCity,
        state: companyState,
        zip: companyZip,
      },
      notes: "",
      customerId: customer.id,
      locationId: customer.locationId,
      receiverName: deliverySchedule[0].receivingName,
      receiverPhone: deliverySchedule[0].receivingPhone,
      deliveryDate: format(
        getNextDayDate(deliverySchedule[0].day),
        "MM-dd-yyyy"
      ),
      deliveryWindow: deliverySchedule[0].window,
      deliveryInstruction: deliverySchedule[0].instructions,
    },
    onSubmit: async ({ value }) => {
      const { lineItems } = value;

      const orderLineItems = lineItems.map((item) => {
        const { id, createdAt, updatedAt, ...rest } = item;
        return { ...rest };
      });

      const { success, error, data } = await createOrder({
        ...value,
        lineItems: orderLineItems,
      });

      if (success) {
        confirm.success({
          title: "Order Confirmed!",
          description: `Thanks for your purchase! Your order is confirmed and we're getting it ready for you.`,
          actionLabel: "View Order",
          action: () => router.push(`/customer/orders/${data.id}`),
        });
        form.reset();
        router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      } else toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <form
      className="flex gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <ItemList form={form} />
      <OrderCart customer={customer} form={form} />
    </form>
  );
};
