"use client";

import {
  Check,
  LayoutGrid,
  ListFilter,
  Loader,
  Star,
  TextAlignJustify,
  X,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns/format";
import { Badge } from "@/components/ui/badge";
import { QuantityInput } from "./order-form";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Skeleton } from "@/components/ui/skeleton";
import { type CustomerProductType } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { cn, formatUSD, getInitialsAvatar } from "@/lib/utils";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories, useInfiniteProducts } from "@/hooks/use-product";
import { createOrderGuideItem, deleteOrderGuideItem } from "@/server/order";
import { ImageZoom } from "@/components/animate-ui/primitives/effects/image-zoom";

const LAYOUTS = [
  {
    value: "list",
    icon: TextAlignJustify,
    className: "grid-cols-1 bg-background p-4! rounded-xl border shadow-sm",
    itemClassName: "",
  },
  {
    value: "grid",
    icon: LayoutGrid,
    className:
      "grid-cols-1 *:bg-background *:rounded-xl @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 gap-4",
    itemClassName: "",
  },
];

export const ItemList = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const [filter, setFilter] = React.useState<Record<string, any>>({});
    const [layout, setLayout] = React.useState<"list" | "grid">("list");
    const { searchParamsObj } = useRouterStuff();
    const query = new URLSearchParams({ ...filter, ...searchParamsObj });

    const {
      data,
      isError,
      error,
      isPending,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useInfiniteProducts(query?.toString());

    const products = data?.pages.flatMap((page) => page.data) ?? [];

    const loadMoreRef = useInfiniteScroll(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, true);

    const handleLayoutChange = (newLayout: string) => {
      const val = newLayout as "list" | "grid";
      setLayout(val);
      localStorage.setItem("layout-state", val);
    };

    React.useEffect(() => {
      const savedLayout = localStorage.getItem("layout-state") as
        | "list"
        | "grid";
      if (savedLayout) {
        setLayout(savedLayout);
      }
    }, []);

    return (
      <div
        data-layout={layout}
        className="group/card @container min-h-svh min-w-0 flex-1 space-y-3"
      >
        <div className="sticky top-0 z-2 flex flex-row gap-3 rounded-2xl border  bg-background p-4 shadow-sm">
          <CategoryPills filter={filter} setFilter={setFilter} />

          <Tabs
            value={layout}
            onValueChange={(v) => handleLayoutChange(v)}
            className="shrink-0"
          >
            <TabsList className="h-9 rounded-xl">
              {LAYOUTS.map(({ value, icon }, i) => {
                const Icon = icon;
                return (
                  <TabsTrigger value={value} key={i} asChild>
                    <Button
                      variant={layout === value ? "outline" : "secondary"}
                      size="icon"
                      type="button"
                      className="size-8! rounded-xl p-0"
                    >
                      <Icon />
                    </Button>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* error component */}
        {isError && <EmptyComponent variant="error" title={error?.message} />}

        {/* empty component */}
        {!products.length && !isPending && <EmptyComponent variant="empty" />}

        {/* products */}
        {products.length > 0 && (
          <div
            className={`flex-1 text-base overflow-auto no-scrollbar px-0 grid
            ${LAYOUTS.find((l) => l.value === layout)?.className}
            `}
          >
            {products?.map((product, idx) => (
              <ProductItem
                key={product.id}
                product={product as CustomerProductType}
                form={form}
              />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL SENTINEL */}
        <div
          ref={loadMoreRef}
          className="col-span-full flex min-h-10 w-full justify-center"
        >
          {(isFetchingNextPage || isPending) && <LoadingSkeleton />}
        </div>
      </div>
    );
  },
});

const ProductItem = withForm({
  ...formOpt,
  props: {} as {
    product: CustomerProductType;
  },
  render: function Render({ form, product }) {
    const productId = product.id;

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
            quantity: String(nextQty),
            productId,
            title: product.title,
            price: product.basePrice,
            total: product.basePrice,
            image: product.image!,
            type: product.type,
            identifier: product.identifier,
            pack: product.pack,
            categories: product.categories,
          });
        }
      },
      [form, productId, product, qty],
    );

    return (
      <div
        className={cn(
          `flex animate-in cursor-pointer items-center gap-4 rounded-xl border py-2 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
          group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0
          group-data-[layout=list]/card:mb-1 group-data-[layout=list]/card:px-4 hover:shadow-md 
          group-data-[layout=grid]/card:hover:-translate-y-1`,
          isCartItem ? "shadow-sm" : "",
        )}
        onClick={() => updateQty(qty + 1)}
      >
        <div
          className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-xl bg-secondary
             group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full"
        >
          {product.image ? (
            <ImageZoom>
              <img
                src={product.image!}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            </ImageZoom>
          ) : (
            <img
              src={getInitialsAvatar(product.title)}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div
          className="flex min-w-0 flex-1 items-start gap-4
             group-data-[layout=grid]/card:w-full
             group-data-[layout=grid]/card:flex-col
             group-data-[layout=grid]/card:justify-between
             group-data-[layout=grid]/card:p-4"
        >
          <div className="w-full min-w-0 space-y-1 group-data-[layout=grid]/card:space-y-2">
            <h4 className="leading-tight font-medium">{product.title}</h4>

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

              <LastPurchase
                product={product}
                className="group-data-[layout=grid]/card:hidden"
              />
            </div>
          </div>
          <OrderGuideButton
            id={product?.guide?.id}
            productId={product?.id}
            className="self-center group-data-[layout=grid]/card:hidden"
          />
          <div className="ml-auto w-24 self-center text-xs text-muted-foreground group-data-[layout=grid]/card:hidden">
            {product.pack ?? null}
          </div>

          <Price
            price={product.basePrice ?? 0}
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

              <Price
                price={product.basePrice ?? 0}
                className="w-auto self-start"
              />
            </div>
            <QuantityInput value={qty} onChange={updateQty} />
          </div>
        </div>
      </div>
    );
  },
});

const LastPurchase = ({
  product,
  className,
}: {
  product: CustomerProductType;
  className?: string;
}) => {
  if (!product.lastPurchased) return;
  return (
    <Badge
      className={cn(
        "h-5 shrink-0 rounded-xl bg-primary whitespace-nowrap uppercase",
        className,
      )}
    >
      {product.lastPurchased.quantity}cs •{" "}
      {format(new Date(product.lastPurchased.createdAt!), "MM/dd")}
    </Badge>
  );
};

const Price = ({
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

const Thumbnail = ({
  qty,
  product,
  onChange,
}: {
  product: CustomerProductType;
  qty: number;
  onChange: (qty: number) => void;
}) => {
  return (
    <HoverCard openDelay={500} closeDelay={10}>
      <HoverCardTrigger asChild>
        <div
          className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-xl bg-secondary
             group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}

          <LastPurchase
            product={product}
            className="absolute top-1 left-1 hidden group-data-[layout=grid]/card:inline-flex"
          />

          <OrderGuideButton
            productId={product.id}
            id={product.guide?.id}
            className="absolute top-1 right-1 hidden group-data-[layout=grid]/card:inline-flex"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="flex w-80 flex-col overflow-hidden rounded-2xl p-0 text-base"
        align="center"
      >
        <div className="aspect-video rounded-xl bg-secondary">
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="aspect-video object-contain"
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

              <Price
                price={product.basePrice ?? 0}
                className="w-auto self-start"
              />
            </div>
            <QuantityInput value={qty} onChange={onChange} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const OrderGuideButton = ({
  id,
  productId,
  className,
}: {
  id?: number | undefined;
  productId: number;
  className?: string;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    if (id) {
      const { success } = await deleteOrderGuideItem(id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["customer-products"] });
        toast.success("Removed from order guide");
      } else {
        toast.error("Failed to remove from order guide");
      }
    } else {
      const { success } = await createOrderGuideItem(productId);
      if (success) {
        toast.success("Saved to order guide");
        queryClient.invalidateQueries({ queryKey: ["customer-products"] });
      } else {
        toast.error("Failed to save to order guide");
      }
    }
    setLoading(false);
  };

  return (
    <Tooltip content={id ? "Remove from order guide" : "Add to order guide"}>
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        onClick={(e) => {
          e.stopPropagation();
          handleSave();
        }}
        className={className}
        disabled={loading}
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <Star
            className={
              id
                ? "fill-yellow-500 stroke-yellow-500"
                : "fill-foreground stroke-foreground"
            }
          />
        )}
      </Button>
    </Tooltip>
  );
};

const CategoryPills = ({
  filter,
  setFilter,
}: {
  filter: Record<string, string>;
  setFilter: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const { data, isPending } = useCategories();

  const toggle = (cat: string) => {
    setFilter((prev: any) => {
      const next = { ...prev, page: "1" };
      if (next.cat === cat) delete next.cat;
      else next.cat = cat;
      return next;
    });
  };

  if (!data?.data)
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
          <Button type="button" variant="secondary" className="rounded-xl">
            All Categories
            <ListFilter />
          </Button>
        }
        className="no-scrollbar max-h-80 overflow-auto"
      >
        {isPending ? (
          <span className="h-8 animate-pulse bg-secondary"></span>
        ) : (
          <>
            <Button
              variant={!filter.cat ? "secondary" : "ghost"}
              className="rounded-xl"
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
                className="rounded-xl"
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
        )}
      </PopoverXDrawer>

      <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
        {displayPills.map((cat: string) => (
          <Button
            key={cat}
            type="button"
            data-active={filter.cat === cat}
            variant="secondary"
            className="rounded-xl data-[active=true]:bg-foreground data-[active=true]:text-primary-foreground"
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
