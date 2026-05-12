"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Thumbnail } from "./thumbnail";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { LastPurchase, Price } from "./card-badge";
import { ProductItemQty } from "./product-item-qty";
import { formOpt, OrderItem } from "./order-form-options";
import { AddToOrderGuideDialog } from "@/components/admin/add-to-order-guide-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductSelection } from "./selection-content";

export const ProductItem = withForm({
  ...formOpt,
  props: {} as {
    product: OrderItem;
  },
  render: function Render({ form, product }) {
    const { productId } = product;

    const { isSelecting, isSelected, toggleSelected } = useProductSelection();
    const isItemSelected = isSelected(productId);
    const qty = useStore(form.store, (state) => {
      const item = state.values.lineItems.find(
        (i) => i.productId === productId,
      );
      return Number(item?.quantity) || 0;
    });

    const isCartItem = qty > 0;

    const updateQty = React.useCallback(
      (qty: number | string) => {
        const nextQty = Number(qty);
        const lineItems = form.getFieldValue("lineItems") || [];

        const index = lineItems.findIndex((i) => i.productId === productId);

        if (nextQty <= 0) {
          if (index >= 0) {
            form.removeFieldValue("lineItems", index);
          }
          return;
        }

        if (index >= 0) {
          form.setFieldValue(`lineItems[${index}].quantity`, String(nextQty));
        } else {
          form.pushFieldValue("lineItems", {
            ...product,
            quantity: String(nextQty),
          });
        }
      },
      [form, productId, product],
    );

    return (
      <div
        className={cn(
          `relative flex animate-in cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-background p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
          group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0
          group-data-[layout=list]/card:mb-1 hover:shadow-md 
          group-data-[layout=grid]/card:hover:-translate-y-1`,
          isCartItem ? "shadow-sm" : "",
          isItemSelected ? "ring-2 ring-black/50" : "",
        )}
        onClick={() => {
          if (!isSelecting) updateQty(qty + 1);
        }}
      >
        <div
          className="
    absolute top-0 left-0 z-10 h-20 w-20 bg-black/40
    mask-[linear-gradient(90deg,#000_40%,transparent)]
    p-3
    backdrop-blur-md
    [-webkit-mask-image:linear-gradient(120deg,#000_40%,transparent)]
  "
        >
          <Checkbox
            className="bg-background"
            checked={isItemSelected}
            onCheckedChange={(checked) => toggleSelected(productId)}
          />
        </div>
        {/* guide item action for card layout */}
        <div
          className="absolute top-1.5 right-1.5 z-1 group-data-[layout=list]/card:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {product.isGuide ? (
            <Star className="size-4 fill-amber-400" />
          ) : (
            <AddToOrderGuideDialog
              item={{
                id: String(product.productId),
                title: product.title,
                image: product.image || "",
                finalPrice: product.price,
              }}
            >
              <Button
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={(e) => e.stopPropagation()}
                className="size-7 rounded-lg"
              >
                <Star className="size-3.5 fill-foreground" />
              </Button>
            </AddToOrderGuideDialog>
          )}
        </div>
        <Thumbnail
          product={product}
          qty={qty}
          onChange={(newValue) => updateQty(newValue)}
        />

        <div
          className="flex min-w-0 flex-1 items-start gap-4
             group-data-[layout=grid]/card:w-full
             group-data-[layout=grid]/card:flex-col
             group-data-[layout=grid]/card:justify-between
             group-data-[layout=grid]/card:p-3"
        >
          <div className="flex w-full min-w-0 flex-col gap-1">
            <h4 className="text-sm leading-tight font-medium group-data-[layout=grid]/card:order-2">
              {product.title}
            </h4>

            <div className="flex w-full items-center gap-2">
              <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
                {product.categories?.map((cat, i) => (
                  <span
                    key={cat + i}
                    className="inline-block text-xs leading-[1.1] font-medium whitespace-nowrap text-muted-foreground uppercase not-last:border-r-2 not-last:pr-1"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <LastPurchase
                product={product}
                className="group-data-[layout=grid]/card:hidden"
              />
            </div>
          </div>

          {/* order guide action for list layout */}
          <div
            className="self-center group-data-[layout=grid]/card:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {product.isGuide ? (
              <Star className="size-4 fill-amber-400" />
            ) : (
              <AddToOrderGuideDialog
                item={{
                  id: String(product.productId),
                  title: product.title,
                  image: product.image || "",
                  finalPrice: product.price,
                }}
              >
                <Button
                  size="icon-xs"
                  type="button"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  className="size-8 rounded-md"
                >
                  <Star className="size-3.5 fill-foreground" />
                </Button>
              </AddToOrderGuideDialog>
            )}
          </div>

          <div className="ml-auto w-24 self-center text-xs text-muted-foreground group-data-[layout=grid]/card:hidden">
            {product.pack ?? null}
          </div>

          <Price
            price={product.price}
            className="group-data-[layout=grid]/card:hidden"
          />

          <ProductItemQty
            value={qty}
            onChange={updateQty}
            className="group-data-[layout=grid]/card:hidden"
          />

          <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
            <div className="flex flex-1 flex-col">
              <div className="text-xs text-muted-foreground">
                {product.pack ?? null}
              </div>

              <Price price={product.price} className="w-auto self-start" />
            </div>
            <ProductItemQty value={qty} onChange={updateQty} />
          </div>
        </div>
      </div>
    );
  },
});
