"use client";
import React from "react";

import {
  Dialog,
  DialogClose,
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { useDebounce } from "@/hooks/use-debounce";
import { usePriceLevels } from "@/hooks/use-product";
import { formatPriceLevelAdjustment } from "@/lib/utils";

interface PriceLevel {
  id: number;
  name: string;
  adjustmentType: string;
  adjustmentValue: string | null;
  appliesTo: string;
}

export const PriceLevelSelector = ({
  value,
  onValueChange,
  children,
}: {
  value?: PriceLevel;
  onValueChange: (value: PriceLevel) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = React.useState("");

  const [debounced, setDebounced] = React.useState("");

  const debounceFn = useDebounce((val) => {
    setDebounced(val);
  }, 500);

  const [selected, setSelected] = React.useState<PriceLevel | undefined>(value);

  const query = new URLSearchParams();
  if (debounced) query.set("q", debounced);

  const { data: priceLevels, isPending } = usePriceLevels(query.toString());

  const options = React.useMemo(() => {
    return (
      priceLevels?.data?.map((t) => ({
        id: t.id,
        name: t.name,
        adjustmentType: t.adjustmentType,
        adjustmentValue: t.adjustmentValue,
        appliesTo: t.appliesTo,
      })) ?? []
    );
  }, [priceLevels, value]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[calc(100svh-10rem)] flex-col overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Assign price level
          </DialogTitle>
          <DialogDescription>
            Select the price level to assign to this customer account.
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
        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
          {isPending ? (
            <LoadingSkeleton />
          ) : options.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No result found
            </p>
          ) : (
            <RadioGroup
              className="gap-1"
              value={String(selected?.id)}
              onValueChange={(value) => {
                const index = options.findIndex(
                  (pl) => String(pl.id) === String(value),
                );

                setSelected(options[index]);
              }}
            >
              {options.map((priceLevel) => {
                return (
                  <FieldLabel
                    key={priceLevel.id}
                    htmlFor={String(priceLevel.id)}
                    className="cursor-pointer rounded-xl!"
                  >
                    <Field
                      orientation="horizontal"
                      className="rounded-xl has-data-checked:*:data-[slot=icon]:opacity-100"
                    >
                      <FieldContent>
                        <FieldTitle>{priceLevel.name}</FieldTitle>
                        <FieldDescription className="text-xs font-medium">
                          {priceLevel.appliesTo === "all"
                            ? "Applies to all items"
                            : "Per item adjustment"}
                        </FieldDescription>
                      </FieldContent>
                      {priceLevel.appliesTo === "all" && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            Number(priceLevel.adjustmentValue ?? 0) > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                                        `}
                        >
                          {formatPriceLevelAdjustment(
                            priceLevel.adjustmentType,
                            priceLevel.adjustmentValue || 0,
                          )}
                        </span>
                      )}
                      <RadioGroupItem
                        className="sr-only"
                        value={String(priceLevel.id)}
                        id={String(priceLevel.id)}
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

        {/* Footer */}
        <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
          <DialogClose asChild onClick={() => onValueChange(selected!)}>
            <Button size="lg">Done</Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
};
