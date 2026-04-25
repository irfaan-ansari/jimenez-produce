"use client";

import React from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ItemList } from "./item-list";
import { OrderCart } from "./order-cart";
import { type Session } from "@/lib/types";
import { cn, formatUSD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { useSidebar } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Minus, Plus, Star } from "lucide-react";
import { formOpt, getTotals } from "./order-form-options";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { SearchBar } from "@/components/admin/search-filters";

export const OrderForm = ({ session }: { session?: Session }) => {
  const router = useRouter();
  const confirm = useConfirm();
  const { open, setOpen } = useSidebar();

  const queryClient = useQueryClient();
  const { queryParams, searchParamsObj } = useRouterStuff();

  const form = useAppForm({
    ...formOpt,
    defaultValues: {
      ...formOpt.defaultValues,
      shippingAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      notes: "",
      deliveryDate: "",
      deliveryWindow: "",
      deliveryInstruction: "",
    },
    onSubmit: async ({ value }) => {
      const { lineItems } = value;

      const orderLineItems = lineItems.map((item) => {
        const { id, createdAt, updatedAt, ...rest } = item;
        return { ...rest };
      });

      const toastId = toast.loading("Submitting your order...");
      const { success, error, data } = await createOrder({
        ...value,
        lineItems: orderLineItems,
      });

      if (success) {
        toast.success("Order submitted successfully!", { id: toastId });
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
      } else toast.error(error.message, { id: toastId });
    },
  });

  React.useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col items-start gap-4 **:data-[slot=input-group]:bg-background lg:flex-row lg:items-center">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Build a new order</h1>
          <p className="text-sm text-muted-foreground">
            Search products, update quantities, and send an order faster.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:flex-1 lg:justify-end">
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
                    saved: searchParamsObj.saved === "true" ? "" : "true",
                  },
                  getNewPath: true,
                }) as string
              }
            >
              <Star />
              Reorder List
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
        <ItemList form={form} />

        <form.Subscribe
          selector={({ values }) => ({
            lineItems: values.lineItems,
          })}
          children={({ lineItems }) => {
            const totals = getTotals(lineItems);

            return (
              <div
                className={`sticky bottom-6 mx-auto h-16 w-full max-w-xl rounded-2xl bg-secondary px-6  py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl ${totals.count <= 0 ? "hidden" : ""}`}
              >
                <div className="flex h-full items-center gap-4">
                  <div className="gap-0.5e flex flex-col">
                    <span className="text-xs uppercase">
                      {totals.count} items in cart
                    </span>
                    <span className="text-base font-bold text-primary">
                      {formatUSD(totals.total)}
                    </span>
                  </div>
                  <OrderCart form={form} />

                  <form.Subscribe
                    selector={({ isSubmitting, canSubmit }) => ({
                      isSubmitting,
                      canSubmit,
                    })}
                    children={({ isSubmitting, canSubmit }) => (
                      <Button
                        type="submit"
                        size="lg"
                        className="w-32 rounded-xl"
                        disabled={isSubmitting || !canSubmit}
                      >
                        {isSubmitting ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Submit Order"
                        )}
                      </Button>
                    )}
                  />
                </div>
              </div>
            );
          }}
        />
      </form>
    </div>
  );
};

export const QuantityInput = ({
  value = 0,
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
        onChange={(e) => onChange?.(Number(e.target.value))}
      />

      <InputGroupAddon align="inline-start">
        <InputGroupButton
          type="button"
          size="icon-xs"
          className="rounded-xl bg-secondary"
          onClick={() => onChange(Math.max(0, value - 1))}
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
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
