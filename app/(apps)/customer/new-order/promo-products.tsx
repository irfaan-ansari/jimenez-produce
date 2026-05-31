"use client";
import { withForm } from "@/hooks/form-context";
import { formOpt, OrderItem } from "./order-form-options";
import { usePromoProducts } from "@/hooks/use-product";
import { useStore } from "@tanstack/react-form";
import React from "react";
import { ImageOff, X } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { ProductItemQty } from "./product-item-qty";
import { Button } from "@/components/ui/button";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { Stack, StackItem } from "@/components/ui/stack";

const STORAGE_KEY = "hide-promo-products";

export const PromoProducts = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const { value, set } = useLocalStorage(STORAGE_KEY, false);

    if (value) {
      return null;
    }

    const { data, isPending, isError } = usePromoProducts();
    const lineItems = useStore(form.store, (s) => s.values.lineItems);

    const products = React.useMemo(() => {
      return (
        data?.data?.map((p) => {
          const { id, ...rest } = p;
          return { ...rest, productId: id };
        }) ?? []
      );
    }, [data]);

    const updateQty = React.useCallback(
      (product: OrderItem, qty: number) => {
        const index =
          lineItems.findIndex((i) => i.productId === product.productId) ?? -1;

        if (qty <= 0) {
          if (index >= 0) {
            form.removeFieldValue("lineItems", index);
          }

          return;
        }

        if (index >= 0) {
          form.setFieldValue(`lineItems[${index}].quantity`, String(qty));
        } else {
          form.pushFieldValue("lineItems", {
            ...product,
            quantity: String(qty),
          });
        }
      },
      [form, lineItems],
    );

    return (
      <Stack
        side="top"
        expandOnHover
        className="fixed bottom-34 right-6 w-100 z-3"
      >
        {products.map((p) => {
          const qty =
            lineItems.find((i) => i.productId === p.productId)?.quantity ?? 0;
          return (
            <StackItem
              key={p.productId}
              className="bg-linear-to-br from-white via-lime-50 to-sky-50 rounded-xl relative"
            >
              <Button
                size="icon-xs"
                variant="outline"
                className="absolute -right-2 -top-2 rounded-full"
              >
                <X />
              </Button>
              <div className="flex gap-3 items-start relative">
                <div className="relative inline-flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      width={200}
                      height={200}
                      className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <ImageOff className="size-4 opacity-40 group-data-[layout=grid]/card:size-6" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm leading-tight font-medium">
                    {p.title}
                  </h4>
                  <div className="min-w-0 overflow-auto text-muted-foreground uppercase text-xs font-medium">
                    {p.categories?.join(" • ")}
                  </div>
                  <div className="flex justify-between">
                    <div className="w-24 self-center font-bold text-primary">
                      {formatUSD(p.finalPrice ?? 0)}
                    </div>
                    <ProductItemQty
                      showButton={true}
                      value={Number(qty)}
                      onChange={(newQty) =>
                        updateQty(
                          // @ts-ignore
                          {
                            ...p,
                            price: p.finalPrice,
                            total: p.finalPrice,
                          },
                          newQty,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </StackItem>
          );
        })}
      </Stack>
    );
  },
});
