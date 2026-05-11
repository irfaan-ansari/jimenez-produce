"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Check, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { OrderGuide, useInfiniteOrderGuides } from "@/hooks/use-orders";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmptyComponent, LoadingSkeleton } from "./placeholder-component";

export const OrderGuideSelector = ({
  value,
  onValueChange,
  children,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: OrderGuide) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const query = new URLSearchParams({ q: debounced });

  const {
    data,
    isError,
    error,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteOrderGuides(query.toString());

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, open);

  const guides = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[min(700px,90svh)] flex-col items-start overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-xl font-bold">
            Select order guide
          </DialogTitle>
          <DialogDescription>Search or select an order guide</DialogDescription>
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
        <div className="no-scrollbar w-full flex-1 space-y-1 overflow-y-auto">
          {/* is pending */}
          {isPending && <LoadingSkeleton />}

          {/* error */}
          {isError && (
            <EmptyComponent
              variant="error"
              title={error.message}
              description="Please try again later"
            />
          )}

          <RadioGroup
            className="gap-1"
            value={value}
            onValueChange={(value) => {
              const index = guides.findIndex((g) => String(g.id) === value);
              if (index >= 0) {
                setOpen(false);
                onValueChange?.(guides[index]);
              }
            }}
          >
            {guides.length > 0
              ? guides?.map((guide) => {
                  return (
                    <FieldLabel
                      key={guide.id}
                      htmlFor={String(guide.id)}
                      className="cursor-pointer rounded-xl! bg-secondary/20"
                    >
                      <Field
                        orientation="horizontal"
                        className=" has-data-checked:*:data-[slot=icon]:opacity-100"
                      >
                        <FieldContent>
                          <FieldTitle>{guide.name}</FieldTitle>
                          <FieldDescription className="text-xs font-medium text-primary">
                            {guide.itemCount} items
                          </FieldDescription>
                        </FieldContent>

                        <RadioGroupItem
                          className="sr-only"
                          value={String(guide.id)}
                          id={String(guide.id)}
                        />
                        <span
                          data-slot="icon"
                          className="inline-flex size-4 items-center justify-center self-start rounded-full bg-primary text-primary-foreground opacity-0"
                        >
                          <Check className="size-3" />
                        </span>
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
          </RadioGroup>

          {/* infinite loading ref */}
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="col-span-full flex min-h-10 w-full justify-center"
            >
              {isFetchingNextPage && <LoadingSkeleton />}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
