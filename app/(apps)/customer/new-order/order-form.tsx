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
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { CustomerSelectType } from "@/lib/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { cn, formatUSD, getNextDayDate } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Minus, Plus, Star, X } from "lucide-react";
import { CustomerProductType } from "@/lib/types";
import { useStore } from "@tanstack/react-form";
import { SearchBar } from "@/components/admin/search-filters";
import Link from "next/link";
import { useRouterStuff } from "@/hooks/use-router-stuff";

export const OrderForm = ({ customer }: { customer: CustomerSelectType }) => {
  const router = useRouter();
  const confirm = useConfirm();
  const [showSummary, setShowSummary] = React.useState(false);
  const queryClient = useQueryClient();
  const { queryParams, searchParamsObj } = useRouterStuff();
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
        "MM-dd-yyyy",
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

  const { lineItemCount, total, lineItems } = useStore(
    form.store,
    (state) => state.values,
  );

  const updateItem = (args: {
    product: CustomerProductType;
    qty: number | string;
  }) => {
    const { product, qty } = args;
    const updatedItems = [...lineItems];

    const index = updatedItems.findIndex((i) => i.id === product.id);

    const newQty = Number(qty);

    if (newQty <= 0) {
      updatedItems.splice(index, 1);
    } else if (index >= 0) {
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: String(newQty),
      };
    } else {
      updatedItems.push({
        ...product,
        productId: product.id,
        image: product.image!,
        quantity: `${newQty || 1}`,
      });
    }

    const updatedItemsWithTotal = updatedItems.map((item) => {
      return {
        ...item,
        total: String(Number(item.price) * Number(item.quantity)),
      };
    });

    form.setFieldValue("lineItems", updatedItemsWithTotal);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start lg:items-center lg:flex-row gap-4 w-full **:data-[slot=input-group]:bg-background">
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl font-bold">Build a new order</h1>
          <p className="text-sm text-muted-foreground">
            Search products, update quantities, and send an order faster.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-between lg:justify-end w-full lg:w-auto lg:flex-1">
          <SearchBar placeholder="Search products..." />
          <Button
            size="xl"
            className="rounded-xl bg-yellow-500 transition hover:bg-yellow-500/80"
            asChild
          >
            <Link
              href={
                queryParams({
                  set: {
                    guide: searchParamsObj.guide === "true" ? "" : "true",
                  },
                  getNewPath: true,
                }) as string
              }
            >
              <Star />
              {searchParamsObj.guide ? "Hide" : "View"} Order Guide
            </Link>
          </Button>
        </div>
      </div>

      {/* content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="relative"
      >
        <ItemList form={form} updateItem={updateItem} />

        <OrderCart
          form={form}
          open={showSummary}
          setOpen={setShowSummary}
          updateItem={updateItem}
        />

        {Number(lineItemCount ?? 0) > 0 && (
          <div className="sticky bottom-6 mx-auto h-16 w-full max-w-xl rounded-2xl bg-secondary px-6  py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
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
              <Button className="rounded-xl px-6" size="lg" type="submit">
                Submit Order
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const QuantityInput = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (arg: number) => void;
  className?: string;
}) => {
  return (
    <InputGroup
      className={cn("h-8 w-24 shrink-0 self-center rounded-xl", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <InputGroupInput
        value={value}
        className="px-0 text-center text-xs"
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) onChange(value);
        }}
      />

      <InputGroupAddon align="inline-start">
        <InputGroupButton
          type="button"
          size="icon-xs"
          className="rounded-xl bg-secondary"
          onClick={() => onChange(value - 1)}
        >
          <Minus />
        </InputGroupButton>
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          variant="default"
          className="rounded-xl bg-foreground hover:bg-foreground/80"
          onClick={() => onChange(Number(value) + 1)}
        >
          <Plus className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
