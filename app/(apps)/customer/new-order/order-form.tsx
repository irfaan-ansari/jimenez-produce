"use client";

import React from "react";
import { toast } from "sonner";
import { formatUSD } from "@/lib/utils";
import { ItemList } from "./item-list";
import { GuideList } from "./guide-list";
import { OrderCart } from "./order-cart";
import { type TaxRule } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { ShoppingBag } from "@duo-icons/react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { useSidebar } from "@/components/ui/sidebar";
import { Loader, Menu, Plus, Star } from "lucide-react";
import { OrderTab, useOrderUIStore } from "@/lib/store/order-store";
import { formOpt, getTotals } from "./order-form-options";
import { OrderFormToolbar, ToolbarSearch } from "./order-from-toolbar";
import { OrderGuideDialog } from "@/components/admin/order-guide-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OrderForm = ({ taxRules }: { taxRules: TaxRule[] }) => {
  const router = useRouter();
  const confirm = useConfirm();

  const setShowCart = useOrderUIStore((s) => s.setShowCart);

  const selectedTab = useOrderUIStore((s) => s.selectedTab);
  const setSelectedTab = useOrderUIStore((s) => s.setSelectedTab);

  const isSelecting = useOrderUIStore((s) => s.isSelecting);
  const setIsSelecting = useOrderUIStore((s) => s.setIsSelecting);
  const unselectAll = useOrderUIStore((s) => s.unselectAll);
  const selectedItems = useOrderUIStore((s) => s.selectedItems);
  const selectedCount = selectedItems.size;

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
        setShowCart(false);
      } else toast.error(error.message, { id: toastId });
    },
  });

  const createGuideValue = React.useMemo(() => {
    return {
      name: "",
      description: "",
      items: Array.from(selectedItems.values()).map((item) => ({
        ...item,
        categories: item.categories ?? [],
        image: item.image ?? "",
      })),
    };
  }, [selectedItems]);

  const selectedTotal = createGuideValue.items.reduce(
    (acc, item) => acc + item.price,
    0,
  );

  React.useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as OrderTab)}
      className="flex w-full flex-col gap-6"
    >
      <div className="flex w-full flex-col items-start gap-4 **:data-[slot=input-group]:bg-background lg:flex-row lg:items-center">
        <TabsList className="bg-background p-0 shadow-sm *:h-11 *:text-foreground group-data-horizontal/tabs:h-11 *:data-active:bg-primary *:data-active:text-primary-foreground *:data-active:hover:bg-primary/80 *:data-active:hover:text-primary-foreground">
          <TabsTrigger value="all">
            <Menu />
            All Products
          </TabsTrigger>
          <TabsTrigger value="guides">
            <Star className="fill-current" />
            Order Guides
          </TabsTrigger>
        </TabsList>
        <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:flex-1 lg:justify-end">
          <ToolbarSearch />
          <Button
            size="xl"
            variant="secondary"
            className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90"
            onClick={() => {
              setIsSelecting(true);
              setSelectedTab("all");
            }}
          >
            <Plus />
            New Guide
          </Button>
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

      {/* toolbar */}

      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center gap-4">
          <OrderFormToolbar />
        </div>

        <TabsContent value="all">
          <ItemList form={form} />
        </TabsContent>

        <TabsContent value="guides">
          <GuideList form={form} />
        </TabsContent>
      </div>

      {/* sticky cart  */}
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
          if (totals.count <= 0 || isSelecting) return null;

          return (
            <div className="sticky bottom-6 z-3 mx-auto w-full max-w-xl">
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

      {/* sticky save */}
      <div
        data-active={isSelecting}
        className="sticky bottom-6 z-3 mx-auto hidden w-full max-w-xl data-[active=true]:block"
      >
        <div className="flex h-16 items-center gap-4 rounded-2xl bg-secondary px-6 py-4 shadow-lg ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
          <div className="flex flex-1 flex-col">
            <span className="text-xs uppercase">selected</span>

            <span className="text-base font-semibold">
              {selectedCount} item
              {selectedCount > 1 ? "s" : ""}
            </span>
          </div>

          <Button
            type="button"
            variant="link"
            size="lg"
            onClick={() => setIsSelecting(false)}
          >
            Cancel
          </Button>

          <OrderGuideDialog
            onSuccess={() => {
              unselectAll();
              setSelectedTab("guides");
            }}
            initialValue={createGuideValue}
          >
            <Button
              type="button"
              size="lg"
              disabled={selectedCount <= 0}
              className="w-32 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
            >
              Save guide
            </Button>
          </OrderGuideDialog>
        </div>
      </div>

      {/* cart overlay */}
      <OrderCart form={form} />
    </Tabs>
  );
};
