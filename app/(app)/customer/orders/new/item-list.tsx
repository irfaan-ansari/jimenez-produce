"use client";
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ListFilter,
  Minus,
  Plus,
  SearchIcon,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { type CustomerProductType } from "@/lib/types";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useCategories, useProducts } from "@/hooks/use-product";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ItemList = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const [filter, setFilter] = React.useState<Record<string, string>>({});
    const query = new URLSearchParams(filter);

    const { data, isError, error, isPending, isPlaceholderData } = useProducts(
      query?.toString()
    );

    return (
      <Card
        className="rounded-2xl flex-1 ring-0 shadow-none gap-0 border h-[calc(100svh-80px)]"
        size="default"
      >
        <CardHeader className="flex relative flex-row gap-2 border-b">
          <SearchBar setFilter={setFilter} filter={filter} />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto no-scrollbar px-0">
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 pl-6">Item</TableHead>
                <TableHead className="py-4">Pack</TableHead>
                <TableHead className="py-4">Price</TableHead>
                <TableHead className="text-right py-4 pr-6">Quantity</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((product) => (
                  <ItemRow
                    key={product.id}
                    product={product as CustomerProductType}
                    form={form}
                  />
                ))
              ) : (
                <TableRow className="hover:bg-background">
                  <TableCell colSpan={4} className="p-0 text-center">
                    {isPending || isPlaceholderData ? (
                      <div className="h-1 bg-primary mb-36 animate-pulse rounded-full"></div>
                    ) : isError ? (
                      <EmptyComponent variant="error" title={error?.message} />
                    ) : (
                      <EmptyComponent variant="empty" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
const SearchBar = ({
  filter,
  setFilter,
}: {
  filter: Record<string, string>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const { data, isPending } = useCategories();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState(filter.q);

  const debouncedSetQuery = useDebounce((value: string) => {
    setFilter({ q: value });
  }, 400);

  return (
    <InputGroup className="h-10 rounded-xl">
      <InputGroupInput
        id="inline-start-input"
        placeholder="Search..."
        value={input}
        onChange={(e) => {
          const value = e.target.value;
          setInput(value);
          debouncedSetQuery(value);
        }}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {filter.cat && (
          <Badge className="rounded-xl h-6 pr-0 bg-secondary" variant="outline">
            {filter.cat}
            <Button
              size="icon-xs"
              variant="destructive"
              type="button"
              onClick={() => setFilter({ cat: "" })}
            >
              <X />
            </Button>
          </Badge>
        )}
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <InputGroupButton
              size="icon-sm"
              type="button"
              className="rounded-xl relative"
            >
              <ListFilter />
            </InputGroupButton>
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
      </InputGroupAddon>
    </InputGroup>
  );
};

const ItemRow = withForm({
  ...formOpt,
  props: {} as {
    product: CustomerProductType;
  },

  render: function Render({ form, product }) {
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
            total: `${Number(item.inventory.price) * Number(item.quantity)}`,
          };
        })
      );
    };

    return (
      <TableRow
        key={product.id}
        className="cursor-pointer hover:bg-primary/6 hover:shadow-md"
        onClick={() => updateItem({ action: "increase" })}
      >
        <TableCell className="py-4 pl-6">
          <div className="flex gap-4 items-start">
            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Avatar className="rounded-xl **:rounded-xl after:hidden size-12 ring-2 ring-offset-1 ring-green-600/20">
                  <AvatarImage src={product.image!} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent
                className="flex w-72 flex-col gap-4 rounded-2xl"
                align="start"
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
                <div className="space-y-1.5">
                  <h2 className="font-semibold">{product.title}</h2>
                  <span className="font-semibold">
                    {formatUSD(product.inventory?.price!)}
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>

            <div className="space-y-1">
              <h4 className="font-medium max-w-3xs truncate">
                {product.title}
              </h4>

              <div className="flex gap-3 items-center flex-wrap">
                {product.categories?.map((cat: string, i) => (
                  <Badge
                    key={cat + i}
                    variant="secondary"
                    className="text-sm bg-blue-100 text-blue-600 border border-blue-200 rounded-xl h-5"
                  >
                    {cat}
                  </Badge>
                ))}

                {product.lastPurchased && (
                  <Badge className="text-sm rounded-xl h-5 bg-blue-600">
                    {product.lastPurchased.quantity} cs on{" "}
                    {format(
                      new Date(product.lastPurchased.createdAt!),
                      "MM/dd"
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-4">{product.pack}</TableCell>

        <TableCell className="py-4">
          {formatUSD(product.inventory?.price ?? 0)}
        </TableCell>

        <TableCell className="text-right py-4 w-32 pr-6">
          <InputGroup
            className="h-9 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✍️ INPUT */}
            <InputGroupInput
              value={qty}
              className="text-center"
              onChange={(e) => {
                const value = Number(e.target.value);
                if (isNaN(value)) return;

                updateItem({ qty: value });
              }}
            />

            {/* ➖ MINUS */}
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

            {/* ➕ PLUS */}
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                className="bg-green-100 text-green-600 hover:text-green-100 hover:bg-green-600 rounded-xl"
                onClick={() => updateItem({ action: "increase" })}
              >
                <Plus />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </TableCell>
      </TableRow>
    );
  },
});
