"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Check, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteOrderGuides } from "@/hooks/use-orders";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSkeleton } from "./placeholder-component";

export const OrderGuideSelector = ({
  value,
  onValueChange,
  children,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const {
    data,
    isError,
    error,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteOrderGuides("");

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
      <DialogContent className="h-full items-start flex flex-col max-h-[min(700px,90svh)] overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-xl font-bold">
            Select order guide
          </DialogTitle>
          <DialogDescription>
            Select the order guide you want to add item to
          </DialogDescription>
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
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto w-full">
          {isPending ? (
            <LoadingSkeleton />
          ) : guides?.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No result found
            </p>
          ) : (
            <RadioGroup
              className="gap-1"
              value={String(value)}
              onValueChange={(value) => {
                setOpen(false);
                onValueChange?.(value);
              }}
            >
              {guides?.map((guide) => {
                return (
                  <FieldLabel
                    key={guide.id}
                    htmlFor={String(guide.id)}
                    className="cursor-pointer rounded-xl!"
                  >
                    <Field
                      orientation="horizontal"
                      className="rounded-xl has-data-checked:*:data-[slot=icon]:opacity-100"
                    >
                      <FieldContent>
                        <FieldTitle>{guide.name}</FieldTitle>
                        <FieldDescription className="text-xs font-medium">
                          {guide.itemCount} items
                        </FieldDescription>
                      </FieldContent>

                      <RadioGroupItem
                        value={String(guide.id)}
                        id={String(guide.id)}
                      />
                      <span
                        data-slot="icon"
                        className="size-4 self-start inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0"
                      >
                        <Check className="size-3" />
                      </span>
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
