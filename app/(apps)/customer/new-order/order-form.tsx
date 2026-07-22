"use client";

import React from "react";
import { toast } from "sonner";
import { formatUSD } from "@/lib/utils";
import { ItemList } from "./item-list";
import { GuideList } from "./guide-list";
import { OrderCart } from "./order-cart";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/order";
import { ShoppingBag } from "@duo-icons/react";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { PromoProducts } from "./promo-products";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { Session, type TaxRule } from "@/lib/types";
import { useSidebar } from "@/components/ui/sidebar";
import { List, Loader, Plus, Star } from "lucide-react";
import { formOpt, getTotals, OrderItem } from "./order-form-options";
import { OrderTab, useOrderUIStore } from "@/lib/store/order-store";
import { OrderFormToolbar, ToolbarSearch } from "./order-from-toolbar";
import { OrderGuideDialog } from "@/components/admin/order-guide-dialog";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storage } from "@/lib/local-storage";

export const OrderForm = ({
  taxRule,
  session,
}: {
  taxRule: TaxRule | null;
  session: Session;
}) => {
  const router = useRouter();
  const confirm = useConfirm();

  const CART_KEY = `order-items-${session.session.activeTeamId}`;
  const [mounted, setMounted] = React.useState(false);

  const setShowCart = useOrderUIStore((s) => s.setShowCart);

  // tab switch
  const selectedTab = useOrderUIStore((s) => s.selectedTab);
  const setSelectedTab = useOrderUIStore((s) => s.setSelectedTab);

  // promo cart state
  const setPromoCart = useOrderUIStore((s) => s.setPromoCart);
  const promoItems = useOrderUIStore((s) => s.promoCart[CART_KEY]) ?? [];

  // for selection store
  const setSelectionState = useOrderUIStore((s) => s.setSelectionState);
  const selectionState = useOrderUIStore((s) => s.selectionState);
  const selectedCount = Object.keys(selectionState.items).length;

  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  const form = useAppForm({
    ...formOpt,
    defaultValues: {
      ...formOpt.defaultValues,
      taxRule: taxRule as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting your order...");

      const { success, error, data } = await createOrder({
        ...value,
      });

      if (success) {
        storage.remove(CART_KEY);
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

  const lineItems = useStore(form.store, (state) => state.values.lineItems);

  // create value from selection store
  const createGuideValue = React.useMemo(() => {
    return {
      name: selectionState.name ?? "",
      description: selectionState.description ?? "",
      items: Object.values(selectionState.items).map((item) => ({
        ...item,
        categories: item.categories ?? [],
        image: item.image ?? "",
      })),
    };
  }, [selectionState.items]);

  // restore cart
  React.useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
    const items = storage.get<OrderItem[]>(CART_KEY) ?? [];
    if (items.length > 0) form.setFieldValue("lineItems", items);
    setMounted(true);
  }, []);

  // add promo items to cart
  React.useEffect(() => {
    if (promoItems.length > 0) {
      const existing = storage.get<OrderItem[]>(CART_KEY, []) ?? [];

      const merged = [...existing];

      promoItems.forEach((promoItem) => {
        const index = merged.findIndex(
          (item) => item.productId === promoItem.productId,
        );

        if (index >= 0) {
          merged[index] = {
            ...merged[index],
            quantity: String(Number(merged[index].quantity) + 1),
          };
        } else {
          merged.push(promoItem);
        }
      });

      form.setFieldValue("lineItems", merged);
      setPromoCart({ key: CART_KEY, items: [] });
    }
  }, [promoItems]);

  // set to local storage
  React.useEffect(() => {
    storage.set(CART_KEY, lineItems);
  }, [lineItems]);

  if (!mounted) return <LoadingSkeleton />;

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as OrderTab)}
      className="flex flex-col w-full h-full gap-6"
    >
      <div className="flex flex-wrap justify-start w-full gap-x-2 gap-y-4 md:flex-nowrap">
        <TabsList className="bg-background p-1 *:h-9 group-data-horizontal/tabs:h-11 border *:data-active:bg-secondary rounded-xl *:rounded-lg">
          <TabsTrigger value="all">
            <List />
            All Products
          </TabsTrigger>
          <TabsTrigger value="guides" disabled={selectionState.mode !== "idle"}>
            <Star className="fill-current" />
            Order Guides
          </TabsTrigger>
        </TabsList>
        <ToolbarSearch className="order-4 max-w-full md:ml-auto md:max-w-xs md:order-2 basis-full" />
        <Button
          size="xl"
          variant="secondary"
          className="ml-auto bg-yellow-500 w-11 sm:w-auto md:ml-0 rounded-xl md:order-3 hover:bg-yellow-500/90"
          onClick={() => {
            setSelectionState({
              mode: "create",
            });
            setSelectedTab("all");
          }}
        >
          <Plus />
          <span className="hidden sm:inline">Create guide</span>
        </Button>
        <form.Field
          name="lineItems"
          children={(field) => (
            <Button
              size="xl"
              className="rounded-xl [&>svg]:size-5! md:order-4 w-11 sm:w-auto"
              onClick={() => setShowCart(true)}
              disabled={field.state.value.length === 0}
            >
              <ShoppingBag />
              <span className="hidden sm:inline">
                View cart ({field.state.value.length})
              </span>
            </Button>
          )}
        />
      </div>

      {/* toolbar */}
      <div className="flex flex-col h-full gap-3">
        <div className="flex items-center w-full gap-4 overflow-hidden">
          <OrderFormToolbar />
        </div>
        <PromoProducts form={form} />
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
          const totals = getTotals(values.lineItems, values.taxRule);
          return {
            totals,
            isSubmitting,
            canSubmit,
          };
        }}
      >
        {({ totals, isSubmitting, canSubmit }) => {
          if (totals.lineItemCount <= 0 || selectionState.mode !== "idle") return null;

          return (
            <div className="sticky w-full max-w-xl mx-auto mt-auto bottom-6 z-3">
              <div className="flex items-center h-16 gap-4 px-6 py-4 shadow-lg rounded-2xl bg-secondary ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
                <div className="flex flex-col">
                  <span className="text-xs uppercase">
                    {totals.lineItemCount} items in cart
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
                  className="w-32 rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                  onClick={() => form.handleSubmit()}
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
        data-active={selectionState.mode !== "idle"}
        className="sticky bottom-6 z-3 mx-auto hidden w-full max-w-xl data-[active=true]:block"
      >
        <div className="flex items-center h-16 gap-4 px-6 py-4 shadow-lg rounded-2xl bg-secondary ring-2 ring-primary/50 ring-offset-2 backdrop-blur-2xl">
          <div className="flex flex-col flex-1">
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
            onClick={() => setSelectionState({ mode: "idle" })}
          >
            Cancel
          </Button>

          <OrderGuideDialog
            onSuccess={() => {
              setSelectionState({ mode: "idle" });
              setSelectedTab("guides");
            }}
            initialValue={{
              ...createGuideValue,
              ...(selectionState.mode === "update"
                ? {
                  id: selectionState.guideId!,
                }
                : {}),
            }}
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
