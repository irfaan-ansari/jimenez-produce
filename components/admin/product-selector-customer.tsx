"use client";
import React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Check, ImageOff, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoinStack } from "@duo-icons/react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUSD, getAvatarFallback, getInitialsAvatar } from "@/lib/utils";

interface ProductType {
  productId: number;
  title: string;
  categories: string[];
  image?: string;
  price: string | number;
}

export const ProductSelectorCustomer = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: ProductType[];
  setSelectedChange: (value: ProductType) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState({
    q: "",
    page: "1",
  });

  const query = new URLSearchParams(filters);

  const {
    data,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteProductsCustomer(query.toString());

  const debounceFn = useDebounce((value: string) => {
    setFilters({ ...filters, q: value });
  }, 500);

  const options = React.useMemo(() => {
    const products = data?.pages.flatMap((page) => page.data) ?? [];
    return (
      products?.map((t) => ({
        productId: t.id,
        title: t.title,
        categories: t.categories,
        image: t.image,
        price: t.finalPrice,
      })) ?? []
    );
  }, [data]);

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, true);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[min(800px,90svh)] flex-col justify-start overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
        <DialogHeader className="flex-row items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-4">
            <CoinStack />
          </span>
          <DialogTitle className="text-xl font-bold">Select Items</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <InputGroup className="rounded-xl">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceFn(e.target.value);
            }}
          />
        </InputGroup>

        {/* List */}
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
          {/* initial loading state */}
          {isPending && <LoadingSkeleton />}

          {/* error state */}
          {isError && <EmptyComponent variant="error" title={error?.message} />}

          {/* success state */}
          {options.length > 0
            ? options.map((item) => {
                const checked =
                  selected.findIndex((s) => s.productId === item.productId) >=
                  0;
                item.image = item.image ?? getInitialsAvatar(item.image!);
                return (
                  <FieldLabel
                    key={item.productId}
                    htmlFor={String(item.productId)}
                    className="cursor-pointer rounded-xl! bg-secondary/20"
                  >
                    <Field
                      orientation="horizontal"
                      className="has-data-checked:*:data-[slot=icon]:opacity-100"
                    >
                      <FieldContent>
                        <div className="flex flex-1 items-start gap-3">
                          <div className="shrink-0 pt-1">
                            <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                              <AvatarImage src={item?.image as string} />
                              <AvatarFallback>
                                <ImageOff className="size-4" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <FieldTitle>{item.title}</FieldTitle>
                            <div className="flex items-center gap-1">
                              {item.categories?.map((cat, i) => (
                                <span
                                  key={cat + i}
                                  className="text-xs uppercase text-muted-foreground font-medium border-r-2 pr-2 last:border-r-0 leading-3"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="w-28 self-center text-right font-semibold text-primary">
                            {formatUSD(item.price)}
                          </div>
                        </div>
                      </FieldContent>

                      <Checkbox
                        className="self-center"
                        id={String(item.productId)}
                        checked={checked}
                        onCheckedChange={() =>
                          setSelectedChange({
                            ...item,
                            image: item.image!,
                            categories: item.categories as string[],
                          })
                        }
                      />
                    </Field>
                  </FieldLabel>
                );
              })
            : !isPending &&
              !isError && (
                <EmptyComponent
                  variant="empty"
                  title="No products found"
                  description="Try adjusting your search"
                />
              )}

          {/* next page loading */}

          <div ref={loadMoreRef} className="flex py-10 w-full justify-center">
            {isFetchingNextPage ? <LoadingSkeleton /> : null}
          </div>
        </div>

        {/* Footer */}
        <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
          <DialogClose asChild>
            <Button size="lg">Done</Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
};
