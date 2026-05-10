"use client";

import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns/format";
import { cn, formatUSD } from "@/lib/utils";
import { QuantityInput } from "./order-form";
import { Badge } from "@/components/ui/badge";
import { formOpt, OrderItem } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { useCategories } from "@/hooks/use-product";
import { Skeleton } from "@/components/ui/skeleton";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Check, ChevronDown, Filter, ImageOff, Star, X } from "lucide-react";
import { AddToOrderGuideDialog } from "../../../../components/admin/add-to-order-guide-dialog";

export const ProductItem = withForm({
  ...formOpt,
  props: {} as {
    product: OrderItem;
  },
  render: function Render({ form, product }) {
    const { productId } = product;

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
      [form, productId, product, qty],
    );

    return (
      <div
        className={cn(
          `flex overflow-hidden animate-in relative cursor-pointer items-center bg-background gap-4 rounded-xl border p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
          group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0
          group-data-[layout=list]/card:mb-1 hover:shadow-md 
          group-data-[layout=grid]/card:hover:-translate-y-1`,
          isCartItem ? "shadow-sm" : "",
        )}
        onClick={() => updateQty(qty + 1)}
      >
        {/* guide item action for card layout */}
        <div
          className="absolute top-1.5 right-1.5 z-1 group-data-[layout=list]/card:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {product.isGuide ? (
            <Star className="fill-amber-400 size-4" />
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
          <div className="w-full min-w-0 flex flex-col gap-1">
            <h4 className="leading-tight text-sm font-medium group-data-[layout=grid]/card:order-2">
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
            className="group-data-[layout=grid]/card:hidden self-center"
            onClick={(e) => e.stopPropagation()}
          >
            {product.isGuide ? (
              <Star className="fill-amber-400 size-4" />
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

          <QuantityInput
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
            <QuantityInput value={qty} onChange={updateQty} />
          </div>
        </div>
      </div>
    );
  },
});

/* Last Purchased */
const LastPurchase = ({
  product,
  className,
}: {
  product: OrderItem;
  className?: string;
}) => {
  if (!product.lastPurchased?.id) return;
  return (
    <Badge
      className={cn(
        "h-4 shrink-0 rounded-sm bg-primary whitespace-nowrap uppercase",
        className,
      )}
    >
      {product.lastPurchased.quantity}cs •{" "}
      {format(new Date(product.lastPurchased.createdAt!), "MM/dd")}
    </Badge>
  );
};

/* Product Price */
export const Price = ({
  price,
  className,
}: {
  price: number | string;
  className?: string;
}) => {
  return (
    <div className={cn("w-24 self-center font-bold text-primary", className)}>
      {formatUSD(price ?? 0)}
    </div>
  );
};

/* Product Image Thumbnail */
export const Thumbnail = ({
  qty,
  product,
  onChange,
}: {
  product: OrderItem;
  qty: number;
  onChange: (qty: number) => void;
}) => {
  return (
    <HoverCard openDelay={500} closeDelay={10}>
      <HoverCardTrigger asChild>
        <div className="relative aspect-square inline-flex items-center justify-center w-12 shrink-0 overflow-hidden rounded-t-lg group-data-[layout=list]/card:rounded-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
            />
          ) : (
            <ImageOff className="opacity-40 size-4 group-data-[layout=grid]/card:size-6" />
          )}

          <LastPurchase
            product={product}
            className="absolute top-1 left-1 hidden group-data-[layout=grid]/card:inline-flex"
          />
        </div>
      </HoverCardTrigger>
      {product.image && (
        <HoverCardContent
          className="flex w-80 flex-col overflow-hidden rounded-xl p-0 text-base"
          align="center"
        >
          <div className="aspect-video rounded-t-xl bg-secondary">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                className="aspect-video object-contain mix-blend-multiply"
              />
            )}
          </div>

          <div className="space-y-3 p-4">
            <h4 className="text-base leading-tight font-medium">
              {product.title}
            </h4>

            <div className="flex w-full items-center gap-2">
              <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
                {product.categories?.map((cat, i) => (
                  <Badge
                    key={cat + i}
                    variant="secondary"
                    className="h-5 shrink-0 rounded-xl px-1.5"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <LastPurchase
              product={product}
              className="group-data-[layout=grid]/card:hidden"
            />

            <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
              <div className="flex flex-1 flex-col">
                <div className="text-xs text-muted-foreground">
                  {product.pack ?? null}
                </div>

                <Price price={product.price} className="w-auto self-start" />
              </div>
              <QuantityInput value={qty} onChange={onChange} />
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

/* Filter By Category */
export const CategoryPills = ({
  filter,
  setFilter,
}: {
  filter: Record<string, string>;
  setFilter: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const { data, isPending, isError } = useCategories();

  const toggle = (cat: string) => {
    setFilter((prev: any) => {
      const next = { ...prev, page: "1" };
      if (next.cat === cat) delete next.cat;
      else next.cat = cat;
      return next;
    });
  };

  if (isError) return null;

  if (isPending)
    return (
      <div className="flex w-full flex-1 items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-18 rounded-xl" />
        ))}
      </div>
    );

  const categories = data.data.slice(0, 8);

  const displayPills =
    filter.cat && !categories.includes(filter.cat)
      ? [...data.data.slice(0, 7), filter.cat]
      : categories;

  return (
    <>
      <PopoverXDrawer
        open={open}
        setOpen={setOpen}
        trigger={
          <Button type="button" variant="outline" className="rounded-lg">
            <Filter />
            All Categories
            <ChevronDown className="opacity-80" />
          </Button>
        }
        className="no-scrollbar max-h-80 overflow-auto *:gap-0"
      >
        <>
          <Button
            variant={!filter.cat ? "secondary" : "ghost"}
            className="rounded-lg!"
            type="button"
            onClick={() => setFilter({ ...filter, cat: "" })}
          >
            All
            <Check
              data-selected={!filter.cat}
              className="ml-auto opacity-0 data-[selected=true]:opacity-100"
            />
          </Button>
          {data?.data?.map((cat, i) => (
            <Button
              variant={filter.cat === cat ? "secondary" : "ghost"}
              className="rounded-lg!"
              type="button"
              key={cat + i}
              onClick={() => setFilter({ ...filter, cat })}
            >
              {cat}
              <Check
                data-selected={cat === filter.cat}
                className="ml-auto opacity-0 data-[selected=true]:opacity-100"
              />
            </Button>
          ))}
        </>
      </PopoverXDrawer>

      <div className="no-scrollbar flex-1 items-center gap-2 overflow-x-auto hidden lg:flex">
        {displayPills.map((cat: string) => (
          <Button
            key={cat}
            type="button"
            data-active={filter.cat === cat}
            variant="outline"
            className="rounded-lg data-[active=true]:bg-foreground data-[active=true]:text-primary-foreground"
            onClick={() => toggle(cat)}
          >
            {cat}
            {filter.cat === cat && (
              <Button
                size="icon-xs"
                className="rounded-xl"
                variant="ghost"
                type="button"
                asChild
              >
                <span>
                  <X />
                </span>
              </Button>
            )}
          </Button>
        ))}
      </div>
    </>
  );
};
