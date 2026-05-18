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
import { CoinStack } from "@duo-icons/react";
import { Button } from "@/components/ui/button";
import { ImageOff, Search } from "lucide-react";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useDebounce } from "@/hooks/use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { formatUSD, getInitialsAvatar } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductType {
  productId: number;
  title: string;
  categories: string[];
  image?: string;
  price: string | undefined;
}

export const ProductSelectorCustomer = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: number[];
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
      <DialogContent className="flex h-full max-h-[min(800px,90svh)] flex-col justify-start overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
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
                const checked = selected.includes(Number(item.productId));
                item.image = item.image ?? getInitialsAvatar(item.title!);
                return (
                  <FieldLabel
                    key={item.productId}
                    htmlFor={String("product-selector" + item.productId)}
                    className="cursor-pointer"
                  >
                    <Field
                      orientation="horizontal"
                      className="has-data-checked:*:data-[slot=icon]:opacity-100"
                    >
                      <Checkbox
                        className="self-start"
                        id={String("product-selector" + item.productId)}
                        checked={checked}
                        onCheckedChange={() => {
                          setSelectedChange({
                            ...item,
                            image: item.image!,
                            categories: item.categories as string[],
                          });
                        }}
                      />
                      <FieldContent className="flex w-full items-start gap-3 flex-row min-w-0">
                        <div className="shrink-0 pt-1">
                          <Avatar className="size-9 rounded-lg ring-2 ring-ring ring-offset-1 **:rounded-lg after:hidden">
                            <AvatarImage src={item?.image as string} />
                            <AvatarFallback>
                              <ImageOff className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <FieldTitle className="truncate">
                            {item.title}
                          </FieldTitle>
                          <p className="truncate line-clamp-1 text-xs uppercase text-muted-foreground font-medium">
                            {item.categories?.join(" • ")}
                          </p>
                        </div>

                        <div className="self-center text-right font-semibold text-primary">
                          {formatUSD(item.price)}
                        </div>
                      </FieldContent>
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
            <Button size="lg">Add</Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
};
