"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns2,
  Columns3,
  Columns4,
  ListFilter,
  Minus,
  Plus,
  SearchIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { format } from "date-fns/format";
import { cn, formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { type CustomerProductType } from "@/lib/types";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useCategories, useProducts } from "@/hooks/use-product";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { useSidebar } from "@/components/ui/sidebar";

const LAYOUTS = [
  {
    value: "col-2",
    icon: Columns2,
    className: "grid-cols-2",
    itemClassName: "",
  },
  {
    value: "col-4",
    icon: Columns3,
    className: "grid-cols-4",
    itemClassName: "",
  },
  {
    value: "col-6",
    icon: Columns4,
    className: "grid-cols-6",
    itemClassName: "",
  },
];

export const ItemList = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const { open, setOpen } = useSidebar();

    const [filter, setFilter] = React.useState<Record<string, string>>({});
    const [layout, setLayout] = React.useState<"list" | "grid">("list");
    const query = new URLSearchParams(filter);

    const { data, isError, error, isPending } = useProducts(query?.toString());

    React.useEffect(() => {
      const savedLayout = localStorage.getItem("layout-state") as
        | "list"
        | "grid";
      if (savedLayout) {
        setLayout(savedLayout);
      }
      if (open) setOpen(false);
    }, []);

    const handleLayoutChange = (newLayout: string) => {
      const val = newLayout as "list" | "grid";
      setLayout(val);
      localStorage.setItem("layout-state", val);
    };

    return (
      <Card
        className="rounded-2xl flex-1 ring-0 shadow-none gap-0 border h-[calc(100svh-80px)]"
        size="default"
        data-layout={layout}
      >
        <CardHeader className="flex relative flex-row gap-6 border-b">
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
                      className="rounded-xl p-0 size-8!"
                    >
                      <Icon />
                    </Button>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <CategoryPills filter={filter} setFilter={setFilter} />
          </div>

          <SearchBar filter={filter} setFilter={setFilter} />
        </CardHeader>
        <CardContent
          className={`flex-1 items-start overflow-auto no-scrollbar p-6 grid gap-2 group-data-[layout=col-4]/card:gap-4
            ${LAYOUTS.find((l) => l.value === layout)?.className}
            `}
        >
          {data?.data && data?.data?.length > 0 ? (
            data?.data?.map((product) => (
              <ItemRow
                key={product.id}
                product={product as CustomerProductType}
                form={form}
                layout={layout}
              />
            ))
          ) : isPending ? (
            <div className="h-1 bg-primary mb-36 animate-pulse rounded-full group-data-[layout=col-2]:col-span-2 group-data-[layout=col-4]:col-span-4 group-data-[layout=col-6]:col-span-6" />
          ) : isError ? (
            <EmptyComponent variant="error" title={error?.message} />
          ) : (
            <EmptyComponent variant="empty" />
          )}
        </CardContent>
        <Pagination pagination={data?.pagination} setFilter={setFilter} />
      </Card>
    );
  },
});

const Pagination = ({
  setFilter,
  pagination,
}: {
  pagination: Record<string, number> | undefined;

  setFilter: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const { page, limit, total, totalPages } = pagination || {};
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <CardFooter className="flex flex-row items-center gap-3 border-t">
      {!pagination ? (
        <Skeleton className="h-5 w-36 rounded-xl" />
      ) : (
        <span>
          Viewing {start}–{end} of {total}
        </span>
      )}
      <Button
        size="icon-sm"
        type="button"
        className="ml-auto rounded-xl"
        disabled={page <= 1}
        onClick={() =>
          setFilter((prev) => ({ ...prev, page: (page - 1).toString() }))
        }
      >
        <ArrowLeft />
      </Button>
      <Button
        size="icon-sm"
        disabled={page === totalPages}
        className="rounded-xl"
        type="button"
        onClick={() =>
          setFilter((prev) => ({
            ...prev,
            page: (Number(page) + 1).toString(),
          }))
        }
      >
        <ArrowRight />
      </Button>
    </CardFooter>
  );
};

const ItemRow = withForm({
  ...formOpt,
  props: {} as {
    product: CustomerProductType;
    layout: string;
  },

  render: function Render({ form, product, layout }) {
    const lineItems = useStore(form.store, (state) => state.values.lineItems);

    const index = lineItems.findIndex((i) => i.productId === product.id);

    const qty = index >= 0 ? Number(lineItems[index].quantity) || 0 : 0;

    const updateItem = (options: {
      action?: "increase" | "decrease";
      qty?: number;
    }) => {
      const { action, qty: inputQty } = options;

      const updatedItems = [...lineItems];

      const currentQty =
        index >= 0 ? Number(updatedItems[index].quantity) || 0 : 0;

      let newQty = currentQty;

      if (typeof inputQty === "number") {
        newQty = inputQty;
      }

      if (action === "increase") {
        newQty = currentQty + 1;
      }

      if (action === "decrease") {
        newQty = currentQty - 1;
      }

      if (newQty <= 0) {
        if (index >= 0) {
          updatedItems.splice(index, 1);
          form.setFieldValue("lineItems", updatedItems);
        }
        return;
      }

      if (index >= 0) {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: `${newQty}`,
        };
      } else {
        updatedItems.push({
          ...product,
          productId: product.id,
          image: product.image!,
          quantity: `${newQty || 1}`,
        });
      }

      form.setFieldValue(
        "lineItems",
        updatedItems.map((item) => {
          return {
            ...item,
            total: `${
              Number(item.inventory.offerPrice) * Number(item.quantity)
            }`,
          };
        })
      );
    };

    const isCartItem = qty > 0;

    const ProductInfo = () => {
      return (
        <div className="space-y-1.5 flex-1 min-w-0 w-full p-4 group-data-[layout=col-2]/card:p-0 group-data-[layout=col-6]/card:p-3">
          <div className="flex flex-col">
            <h4 className="font-bold truncate text-sm leading-tight">
              {product.title}
            </h4>
            <span className="text-xs text-muted-foreground">
              {product.pack ?? "Pack"}
            </span>
          </div>

          {/* Categories & Last Purchased - Truncated logic applied */}
          <div className="flex gap-2 items-center w-full">
            <div className="flex gap-1 items-center flex-nowrap min-w-0 overflow-hidden">
              {product.categories?.map((cat, i) => (
                <Badge
                  key={cat + i}
                  variant="secondary"
                  className="rounded-xl bg-blue-100 text-blue-600 border-blue-200 h-5 px-1.5 shrink-0"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {product.lastPurchased && (
              <Badge className="rounded-xl h-5 bg-blue-600 whitespace-nowrap shrink-0">
                {product.lastPurchased.quantity}cs •{" "}
                {format(new Date(product.lastPurchased.createdAt!), "MM/dd")}
              </Badge>
            )}
          </div>

          {/* Price & Controls Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-primary">
              {formatUSD(product.inventory?.offerPrice ?? 0)}
            </span>

            {/* Quantity Controls */}
            <InputGroup
              className="h-9 rounded-xl ml-auto w-24 ml-auto shrink-0 self-center"
              onClick={(e) => e.stopPropagation()}
            >
              <InputGroupInput
                value={qty}
                className="text-center text-xs px-0"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) updateItem({ qty: value });
                }}
              />

              <InputGroupAddon align="inline-start">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  className="bg-red-100 text-red-600 hover:text-red-100 hover:bg-red-600 rounded-xl"
                  onClick={() => updateItem({ action: "decrease" })}
                >
                  <Minus />
                </InputGroupButton>
              </InputGroupAddon>

              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl"
                  onClick={() => updateItem({ action: "increase" })}
                >
                  <Plus className="size-3" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      );
    };
    return (
      <div
        key={product.id}
        className={cn(
          `rounded-xl hover:shadow-md 
          cursor-pointer transition fade-in border flex flex-col h-auto 
          group-data-[layout=col-2]/card:flex-row group-data-[layout=col-2]/card:p-4 group-data-[layout=col-2]/card:gap-4`,
          isCartItem
            ? "bg-primary/6 border-primary/50 hover:border-primary/50"
            : "hover:border-primary/20 hover:bg-primary/6 "
        )}
        onClick={() => updateItem({ action: "increase" })}
      >
        {/* Image Section */}
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="bg-secondary aspect-video inline-flex items-center justify-center rounded-xl shrink-0 basis-24">
              {product.image && (
                <img
                  src={product.image!}
                  width={200}
                  height={200}
                  className="object-contain h-full aspect-video w-auto"
                />
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="flex w-72 flex-col p-0 rounded-2xl"
            align="start"
            style={layout !== "col-2" ? { display: "none" } : {}}
          >
            <div className="aspect-video bg-secondary rounded-xl">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="aspect-video"
                />
              )}
            </div>
            <ProductInfo />
          </HoverCardContent>
        </HoverCard>

        {/* Product Info Section */}
        <ProductInfo />
      </div>
    );
  },
});

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
      <div className="flex items-center gap-0.5 w-full flex-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-18 rounded-xl" />
        ))}
      </div>
    );

  const categories = data.data.slice(0, 4);

  const displayPills =
    filter.cat && !categories.includes(filter.cat)
      ? [...data.data.slice(0, 3), filter.cat]
      : categories;

  return (
    <div className="flex gap-1.5 items-center whitespace-nowrap">
      {displayPills.map((cat: string) => (
        <Button
          key={cat}
          type="button"
          data-active={filter.cat === cat}
          variant="secondary"
          className="rounded-xl bg-blue-100 text-blue-600 data-[active=true]:bg-blue-600 data-[active=true]:text-blue-100"
          onClick={() => toggle(cat)}
        >
          {cat}
        </Button>
      ))}

      <PopoverXDrawer
        open={open}
        setOpen={setOpen}
        trigger={
          <Button type="button" variant="secondary" className="rounded-xl">
            All Categories
            <ListFilter />
          </Button>
        }
        className="max-h-80 no-scrollbar overflow-auto"
      >
        {isPending ? (
          <span className="h-8 animate-pulse bg-secondary"></span>
        ) : (
          data?.data?.map((cat, i) => (
            <Button
              variant={filter.cat === cat ? "secondary" : "ghost"}
              key={cat + i}
              className="rounded-xl"
              type="button"
              onClick={() => setFilter({ ...filter, cat })}
            >
              {cat}
              <Check
                data-selected={cat === filter.cat}
                className="ml-auto opacity-0 data-[selected=true]:opacity-100"
              />
            </Button>
          ))
        )}
      </PopoverXDrawer>
    </div>
  );
};

const SearchBar = ({ filter, setFilter }: { filter: any; setFilter: any }) => {
  const [val, setVal] = React.useState(filter.q || "");
  const debounce = useDebounce(
    (v: string) => setFilter((p: any) => ({ ...p, q: v, page: "1" })),
    400
  );

  return (
    <InputGroup className="h-9 w-64 shrink-0 rounded-xl">
      <InputGroupInput
        placeholder="Search..."
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          debounce(e.target.value);
        }}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
};
