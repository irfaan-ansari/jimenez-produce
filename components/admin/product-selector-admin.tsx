"use client";
import React from "react";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "../app-dialog";
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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageOff, Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { QueryState } from "./query-state";
import { CoinStack } from "@duo-icons/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteProducts } from "@/hooks/use-product";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatUSD, getAvatarFallback, getInitialsAvatar } from "@/lib/utils";
import { LoadingSkeleton } from "./placeholder-component";

interface ProductSelectorAdminType {
  id: number;
  title: string;
  identifier: string;
  categories: string[];
  status: string;
  image: string;
  basePrice: string;
}

export const ProductSelectorAdmin = ({
  selected,
  setSelectedChange,
  children,
}: {
  selected: number[];
  setSelectedChange: (value: ProductSelectorAdminType) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState({ q: "", page: "1", cat: "" });

  const query = new URLSearchParams(filters);

  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = useInfiniteProducts(query.toString());

  const debounceFn = useDebounce((value: string) => {
    setFilters({ ...filters, q: value });
  }, 500);

  const options = React.useMemo(() => {
    const products = data?.pages.flatMap((page) => page.data) ?? [];
    return (
      products?.map((t) => ({
        id: String(t.id),
        title: t.title!,
        identifier: t.identifier!,
        categories: t.categories!,
        status: t.status!,
        image: t.image!,
        basePrice: t.basePrice!,
      })) ?? []
    );
  }, [data]);

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, true);

  return (
    <AppDialog>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>

      <AppDialogContent className="h-full max-h-[min(800px,90svh)] overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
        <AppDialogHeader className="flex-row items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-4">
            <CoinStack />
          </span>
          <AppDialogTitle className="text-xl font-semibold">
            Select Items
          </AppDialogTitle>
        </AppDialogHeader>

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
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={options.length === 0}
          >
            {options.map((item) => {
              const checked = selected.includes(Number(item.id));

              item.image = item.image ?? getInitialsAvatar(item.title!);
              return (
                <FieldLabel
                  key={item.id}
                  htmlFor={item.id}
                  className="cursor-pointer"
                >
                  <Field orientation="horizontal">
                    <Checkbox
                      id={item.id}
                      checked={checked}
                      onCheckedChange={() =>
                        setSelectedChange({
                          ...item,
                          id: Number(item.id),
                        })
                      }
                    />
                    <FieldContent>
                      <div className="flex flex-1 items-start gap-3">
                        <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-ring ring-offset-1 **:rounded-lg after:hidden">
                          <AvatarImage src={item?.image as string} />
                          <AvatarFallback>
                            <ImageOff className="size-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1 space-y-1">
                          <FieldTitle>{item.title}</FieldTitle>
                          <Badge
                            variant="secondary"
                            className="rounded-xl border border-border uppercase"
                          >
                            {item.identifier}
                          </Badge>
                        </div>
                        <div className="self-center text-right font-semibold text-primary">
                          {formatUSD(item.basePrice)}
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              );
            })}
          </QueryState>

          <div ref={loadMoreRef} className="flex w-full justify-center py-10">
            {isFetchingNextPage ? <LoadingSkeleton /> : null}
          </div>
        </div>

        {/* Footer */}
        <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
          <AppDialogClose asChild>
            <Button size="lg">Add</Button>
          </AppDialogClose>
        </Field>
      </AppDialogContent>
    </AppDialog>
  );
};
