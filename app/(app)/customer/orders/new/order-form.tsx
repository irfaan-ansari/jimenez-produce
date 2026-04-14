"use client";

import React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ItemList } from "./item-list";
import { OrderCart } from "./order-cart";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { formOpt } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { CheckoutDialog } from "./checkout-dialog";
import { CustomerSelectType } from "@/lib/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { formatUSD, getNextDayDate } from "@/lib/utils";

export const OrderForm = ({
  customer,
  lineItems,
}: {
  customer: CustomerSelectType;
  lineItems?: [];
}) => {
  const router = useRouter();
  const confirm = useConfirm();
  const [showSummary, setShowSummary] = React.useState(false);
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
    },
  });

  const { lineItemCount, total } = useStore(
    form.store,
    (state) => state.values
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="relative"
    >
      <div className="flex w-full items-start gap-4">
        <ItemList form={form} />
        <OrderCart customer={customer} form={form} show={showSummary} />
      </div>

      {Number(lineItemCount ?? 0) > 0 && (
        <div className="sticky bottom-6 mx-auto h-16 w-xl rounded-2xl bg-secondary px-6  py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
          <div className="flex h-full items-center gap-4">
            <div className="gap-0.5e flex flex-col">
              <span className="text-xs uppercase">
                {lineItemCount ?? 0} items in cart
              </span>
              <span className="text-base font-bold text-primary">
                {formatUSD(total)}
              </span>
            </div>
            <Button
              className="ml-auto rounded-xl text-foreground"
              size="lg"
              variant="link"
              type="button"
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? "Hide Cart" : "View Cart"}
            </Button>
            <CheckoutDialog
              form={form}
              trigger={
                <Button className="rounded-xl px-6" size="lg" type="button">
                  Checkout
                </Button>
              }
            />
          </div>
        </div>
      )}
    </form>
  );
};
