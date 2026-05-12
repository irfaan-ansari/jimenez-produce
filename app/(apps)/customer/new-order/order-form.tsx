"use client";

import React from "react";
import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { ItemList } from "./item-list";
import { OrderCart } from "./order-cart";
import { formatUSD } from "@/lib/utils";
import { type TaxRule } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { ShoppingBag } from "@duo-icons/react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useSidebar } from "@/components/ui/sidebar";
import { OrderGuideButton } from "./order-guide";
import { useQueryClient } from "@tanstack/react-query";
import { formOpt, getTotals } from "./order-form-options";
import { useAppForm, withForm } from "@/hooks/form-context";
import { SearchBar } from "@/components/admin/search-filters";
import { useProductSelection } from "./selection-content";

export const OrderForm = ({ taxRules }: { taxRules: TaxRule[] }) => {
  const router = useRouter();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { isSelecting } = useProductSelection();

  const [showCart, setShowCart] = React.useState(false);

  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  const form = useAppForm({
    ...formOpt,
    defaultValues: {
      ...formOpt.defaultValues,
      taxRules: taxRules,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting your order...");

      const { success, error, data } = await createOrder({
        ...value,
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
    if (sidebarOpen) {
      setSidebarOpen(false);
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
          <OrderGuideButton />

          <form.Field
            name="lineItems"
            children={(field) => (
              <Button
                size="xl"
                className="rounded-lg [&>svg]:size-5!"
                onClick={() => setShowCart(true)}
                disabled={field.state.value.length === 0}
              >
                <ShoppingBag />
                View cart ({field.state.value.length})
              </Button>
            )}
          />
        </div>
      </div>

      {/* form content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="relative"
      >
        {/* items list */}
        <ItemList form={form} />

        {/* sticky buttons  */}
        {isSelecting ? (
          <StickySave />
        ) : (
          <StickyCart
            form={form}
            showCart={showCart}
            setShowCart={setShowCart}
          />
        )}

        {/* cart overlay */}
        <OrderCart form={form} showCart={showCart} setShowCart={setShowCart} />
      </form>
    </div>
  );
};

const StickyCart = withForm({
  ...formOpt,
  props: {} as {
    showCart: boolean;
    setShowCart: (v: boolean) => void;
  },

  render: function ({ form, setShowCart }) {
    return (
      <form.Subscribe
        selector={({ values, isSubmitting, canSubmit }) => {
          const totals = getTotals(values.lineItems, values.taxRules);

          return {
            totals,
            isSubmitting,
            canSubmit,
          };
        }}
      >
        {({ totals, isSubmitting, canSubmit }) => {
          if (totals.count <= 0) return null;

          return (
            <div className="sticky bottom-6 z-2 mx-auto w-full max-w-xl">
              <div className="flex h-16 items-center gap-4 rounded-2xl bg-secondary px-6 py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
                <div className="flex flex-col">
                  <span className="text-xs uppercase">
                    {totals.count} items in cart
                  </span>

                  <span className="text-base font-bold text-primary">
                    {formatUSD(totals.total)}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="ml-auto"
                  onClick={() => setShowCart(true)}
                >
                  View cart
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  className="w-32 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Submit Order"
                  )}
                </Button>
              </div>
            </div>
          );
        }}
      </form.Subscribe>
    );
  },
});

const StickySave = () => {
  const { selectedCount } = useProductSelection();
  return (
    <div className="sticky bottom-6 z-3 mx-auto w-full max-w-xl">
      <div className="flex h-16 items-center gap-4 rounded-2xl bg-secondary px-6 py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
        <div className="flex flex-1 flex-col">
          <span className="text-xs uppercase">
            {selectedCount} item
            {selectedCount > 1 ? "s" : ""} selected
          </span>
        </div>

        <Button type="button" variant="link" size="lg">
          Discard
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={selectedCount <= 0}
          className="w-32 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
        >
          Save guide
        </Button>
      </div>
    </div>
  );
};
