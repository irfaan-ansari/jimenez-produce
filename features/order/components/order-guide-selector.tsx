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
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { QueryState } from "@/components/admin/query-state";

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
        <div className="flex-1 w-full space-y-1 overflow-y-auto no-scrollbar">
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
            <QueryState
              isPending={isPending}
              isError={isError}
              isEmpty={guides.length === 0}
              error={error}
            >
              {guides?.map((guide) => {
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
                          {guide.items.length} items
                        </FieldDescription>
                      </FieldContent>

                      <RadioGroupItem
                        className="sr-only"
                        value={String(guide.id)}
                        id={String(guide.id)}
                      />
                      <span
                        data-slot="icon"
                        className="inline-flex items-center self-start justify-center rounded-full opacity-0 size-4 bg-primary text-primary-foreground"
                      >
                        <Check className="size-3" />
                      </span>
                    </Field>
                  </FieldLabel>
                );
              })}
            </QueryState>
          </RadioGroup>

          {/* infinite loading ref */}
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="flex justify-center w-full col-span-full min-h-10"
            >
              {isFetchingNextPage && <LoadingSkeleton />}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
