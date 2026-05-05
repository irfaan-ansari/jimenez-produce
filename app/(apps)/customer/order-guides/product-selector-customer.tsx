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
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductSelectType } from "@/lib/db/schema";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUSD, getAvatarFallback, getInitialsAvatar } from "@/lib/utils";
import { CoinStack } from "@duo-icons/react";

export const ProductSelectorCustomer = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: ProductSelectType[];
  setSelectedChange: (value: ProductSelectType) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState({
    q: "",
    page: "1",
  });

  const query = new URLSearchParams(filters);

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteProductsCustomer(query.toString());

  const debounceFn = useDebounce((value: string) => {
    setFilters({ ...filters, q: value });
  }, 500);

  const options = React.useMemo(() => {
    const products = data?.pages.flatMap((page) => page.data) ?? [];
    return (
      products?.map((t) => ({
        id: String(t.id),
        title: t.title,
        identifier: t.identifier,
        categories: t.categories,
        image: t.image,
        basePrice: t.basePrice,
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
      <DialogContent className="h-full flex flex-col justify-start max-h-[min(700px,90svh)] overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
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
          {options.map((item) => {
            const checked =
              selected.findIndex((s) => String(s.id) === String(item.id)) >= 0;
            item.image = item.image ?? getInitialsAvatar(item.image!);
            return (
              <FieldLabel
                key={item.id}
                htmlFor={item.id}
                className="cursor-pointer rounded-xl! bg-secondary/20"
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <div className="flex flex-1 items-start gap-3">
                      <div className="shrink-0 pt-1">
                        <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                          <AvatarImage src={item?.image as string} />
                          <AvatarFallback>
                            {getAvatarFallback((item.title as string)?.[0])}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <FieldTitle>{item.title}</FieldTitle>
                        <div className="flex gap-1 items-center">
                          {item.categories?.map((cat, i) => (
                            <Badge
                              key={cat + i}
                              variant="outline"
                              className="rounded-xl border border-border bg-primary/20"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="w-28 self-center text-right font-semibold text-primary">
                        {formatUSD(item.basePrice)}
                      </div>
                    </div>
                  </FieldContent>

                  <Checkbox
                    className="self-center"
                    id={item.id}
                    checked={checked}
                    // @ts-expect-error
                    onCheckedChange={() => setSelectedChange(item)}
                  />
                </Field>
              </FieldLabel>
            );
          })}
          <div
            ref={loadMoreRef}
            className="flex min-h-10 w-full justify-center "
          >
            {isFetchingNextPage || isPending ? (
              <LoadingSkeleton />
            ) : options.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center">
                No result found
              </div>
            ) : null}
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
