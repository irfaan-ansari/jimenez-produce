"use client";

import z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  ListFilter,
  Loader,
  Percent,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createPriceLevel, updatePriceLevel } from "@/server/price-level";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { useAppForm, withForm } from "@/hooks/form-context";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useCategories, useProducts } from "@/hooks/use-product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PriceLevelType } from "@/lib/types";

const numberString = z
  .string()
  .trim()
  .refine((val) => !Number.isNaN(Number(val)), {
    message: "Invalid value",
  });

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    appliesTo: z.string(),
    adjustmentType: z.string().default(""),
    adjustmentValue: numberString.default(""),
    status: z.string(),
    items: z
      .array(
        z.object({
          productId: z.number(),
          title: z.string(),
          identifier: z.string(),
          image: z.string().optional(),
          basePrice: z.string(),
          price: z.string(),
        }),
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    const { appliesTo, items, adjustmentType, adjustmentValue } = data;

    if (appliesTo === "per_item") {
      if (!items || items.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Select at least one item for this price level",
          path: ["items"],
        });
      }
    } else if (appliesTo === "all") {
      if (!adjustmentType) {
        ctx.addIssue({
          code: "custom",
          message: "Adjustment type is required",
          path: ["adjustmentType"],
        });
      }

      if (adjustmentValue === undefined || adjustmentValue === null) {
        ctx.addIssue({
          code: "custom",
          message: "Adjustment value is required",
          path: ["adjustmentValue"],
        });
      }
    }
  });

const defaultValues = {
  name: "",
  adjustmentType: "fixed", // fixed | percentage
  adjustmentValue: "",
  appliesTo: "all", // all | per_item
  status: "active",
  items: [] as z.infer<typeof schema>["items"],
};

export const PriceLevelDialog = ({
  data,
  children,
}: {
  data?: PriceLevelType;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const isEdit = data?.id;

  const form = useAppForm({
    defaultValues: {
      ...(isEdit
        ? {
            ...data,
            adjustmentValue: String(data.adjustmentValue ?? ""),
            items: data.priceLevelItem,
          }
        : defaultValues),
    },

    validators: {
      onSubmit: ({ value, formApi }) => {
        console.log(value);
        if (value.appliesTo === "per_item") {
          value.adjustmentValue = "";
          value.adjustmentType = "";
          value.items.filter(
            (item) => Number(item.price) !== Number(item.basePrice),
          );
        } else if (value.appliesTo === "all") {
          value.items = [];
        }
        // @ts-ignore
        return formApi.parseValuesWithSchema(schema);
      },
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      if (isEdit) {
        const { success, error } = await updatePriceLevel(data.id, value);

        if (!success) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Price level updated successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["price-level"] });
          setOpen(false);
          form.reset();
        }
      } else {
        const { success, error } = await createPriceLevel(value);

        if (!success) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Price level created successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["price-level"] });
          setOpen(false);
          form.reset();
        }
      }
    },
  });

  const { appliesTo, adjustmentType } = useStore(
    form.store,
    (state) => state.values,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-2xl font-bold">
              Create Price Level
            </DialogTitle>
            <DialogDescription>
              Create price levels for specific customer groups to offer
              specialized pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar flex-1 overflow-auto">
            <FieldGroup className="grid grid-cols-1 px-6 lg:grid-cols-2">
              {/* name */}
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    placeholder="Wholesale"
                    className="**:rounded-xl lg:col-span-2"
                  />
                )}
              />
              {/* scope */}
              <form.Field
                name="appliesTo"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet
                      data-invalid={isInvalid}
                      className="lg:col-span-2"
                    >
                      <FieldLegend variant="label">Applies to</FieldLegend>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        aria-invalid={isInvalid}
                        className="grid grid-cols-2"
                      >
                        <FieldLabel htmlFor="all" className="rounded-xl!">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>All</FieldTitle>
                              <FieldDescription>
                                Apply to all items
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="all" id="all" />
                          </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="per_item" className="rounded-xl!">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Selected Items</FieldTitle>
                              <FieldDescription>
                                Apply to selected items
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="per_item" id="per_item" />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              />
              {/* type */}
              <form.Field
                name="adjustmentType"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet
                      data-invalid={isInvalid}
                      className={`lg:col-span-2 ${appliesTo !== "all" ? "hidden" : ""}`}
                    >
                      <FieldLegend variant="label">Adjustment Type</FieldLegend>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        aria-invalid={isInvalid}
                        className="grid grid-cols-2"
                      >
                        <FieldLabel htmlFor="fixed" className="rounded-xl!">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Fixed</FieldTitle>
                              <FieldDescription>
                                Adjust by fixed amount
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="fixed" id="fixed" />
                          </Field>
                        </FieldLabel>
                        <FieldLabel
                          htmlFor="percentage"
                          className="rounded-xl!"
                        >
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Percentage</FieldTitle>
                              <FieldDescription>
                                Adjust by percentage
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value="percentage"
                              id="percentage"
                            />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              />

              {/* all items */}

              <form.Field
                name="adjustmentValue"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field
                      className={`lg:col-span-2 ${appliesTo !== "all" ? "hidden" : ""}`}
                    >
                      <FieldLabel htmlFor={field.name}>
                        Adjustment Value
                      </FieldLabel>
                      <InputGroup className="rounded-xl">
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g. 10 or -5"
                        />
                        <InputGroupAddon align="inline-start">
                          {adjustmentType === "percentage" ? (
                            <Percent />
                          ) : (
                            <DollarSign />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Use positive for markup and negative for discount.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            {/* per item  */}
            {/* @ts-ignore */}
            {appliesTo === "per_item" && <ItemList form={form} />}
          </div>
          <Field className="flex flex-col-reverse gap-4 px-6 pt-4 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/**
 *
 */
const ItemList = withForm({
  defaultValues,
  render: function Render({ form }) {
    const { items } = useStore(form.store, (state) => state.values);

    return (
      <div className="mt-6 flex flex-col">
        <div className="mb-6 space-y-2 px-6">
          <div className="text-base font-semibold">Browse Products</div>
          <SelectItemDialog form={form} />
        </div>

        <form.Field
          name="items"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <>
                {/* list header */}
                {isInvalid && (
                  <FieldError
                    className="px-6"
                    errors={field.state.meta.errors}
                  />
                )}
                {items?.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">No items added</p>
                  </div>
                ) : (
                  <div className="flex w-full gap-4 border-y bg-secondary px-6 py-3 text-sm text-muted-foreground uppercase">
                    <span className="flex-1">item</span>
                    <span className="w-28 shrink-0 truncate text-right">
                      price
                    </span>
                    <span className="w-24 shrink-0 text-right">New Price</span>
                    <span className="w-10 shrink-0 text-right" />
                  </div>
                )}
                <div className="divide-y">
                  {field.state.value.map((item, i) => {
                    return (
                      <div
                        className="flex gap-4 px-6 py-2"
                        key={item.productId}
                      >
                        <div className="flex flex-1 items-start gap-3">
                          <div className="shrink-0 pt-1">
                            <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-xl after:hidden">
                              <AvatarImage src={item?.image as string} />
                              <AvatarFallback>
                                {getAvatarFallback((item.title as string)?.[0])}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="leading-tight font-medium whitespace-normal">
                              {item.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="rounded-xl border border-border uppercase"
                            >
                              {item.identifier}
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`grid w-28 self-center text-right ${item.basePrice !== item.price ? "line-through text-muted-foreground" : ""}`}
                        >
                          {formatUSD(item.basePrice)}
                        </div>
                        <div className="w-24 self-center text-right">
                          <InputGroup className="h-10 rounded-xl">
                            <form.Field
                              name={`items[${i}].price`}
                              children={(field) => (
                                <InputGroupInput
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  className="text-right"
                                  onChange={(e) => {
                                    field.handleChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                            <InputGroupAddon align="inline-start">
                              <DollarSign />
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div className="w-10 text-right">
                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => {
                              field.removeValue(i);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          }}
        />
      </div>
    );
  },
});

const SelectItemDialog = withForm({
  defaultValues,
  render: function Render({ form }) {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({ q: "", cat: "", page: "1" });

    const query = new URLSearchParams(filters);

    const { data: categories } = useCategories();
    const { data, isPending } = useProducts(query.toString());
    const { items } = useStore(form.store, (state) => state.values);

    return (
      <Dialog
        onOpenChange={() => {
          setFilters({ q: "", cat: "", page: "1" });
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="w-full justify-start rounded-xl"
            size="lg"
          >
            <Search />
            <span className="text-muted-foreground">Browse...</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="flex h-[calc(100svh-200px)] flex-col gap-0 rounded-2xl px-0 ring-ring/10 sm:max-w-xl">
          {/* header */}
          <DialogHeader className="mb-6 px-6">
            <DialogTitle className="text-2xl font-bold">Add Items</DialogTitle>
          </DialogHeader>

          {/* search and filter */}
          <div className="mb-6 flex items-center gap-6 px-6">
            <InputGroup className="h-10 rounded-xl">
              <InputGroupInput
                placeholder="Search..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <PopoverXDrawer
              open={open}
              setOpen={setOpen}
              trigger={
                <Button
                  variant="secondary"
                  size="lg"
                  type="button"
                  className="rounded-xl border-border px-4 text-sm"
                >
                  All Categories <ListFilter />
                </Button>
              }
              className="no-scrollbar max-h-80 overflow-auto"
            >
              <Button
                variant={!filters.cat ? "secondary" : "ghost"}
                className="rounded-xl"
                type="button"
                onClick={() => setFilters({ ...filters, cat: "" })}
              >
                All
                <Check
                  data-selected={!filters.cat}
                  className="ml-auto opacity-0 data-[selected=true]:opacity-100"
                />
              </Button>
              {categories?.data?.map((cat, i) => (
                <Button
                  variant={filters.cat === cat ? "secondary" : "ghost"}
                  className="rounded-xl"
                  type="button"
                  key={cat + i}
                  onClick={() => setFilters({ ...filters, cat })}
                >
                  {cat}
                  <Check
                    data-selected={cat === filters.cat}
                    className="ml-auto opacity-0 data-[selected=true]:opacity-100"
                  />
                </Button>
              ))}
            </PopoverXDrawer>
          </div>

          {/* item list */}
          <div className="flex w-full gap-4 border-y bg-secondary px-6 py-3 text-sm text-muted-foreground uppercase">
            <span className="flex-1">item</span>
            <span className="w-28 shrink-0 text-right">price</span>
            <span className="w-28 shrink-0 text-right">action</span>
          </div>

          <div className="no-scrollbar mb-6 flex-1 divide-y overflow-auto">
            {isPending && (
              <div className="h-1 animate-pulse rounded-full bg-primary" />
            )}
            <form.Field
              name="items"
              children={(field) =>
                data?.data?.map((line, i) => {
                  const isAdded =
                    items?.findIndex((i) => i.productId === line.id) >= 0;
                  return (
                    <div
                      className={`flex gap-4 px-6 py-2 ${
                        isAdded ? "bg-primary/10" : ""
                      }`}
                      key={line.id}
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <div className="shrink-0 pt-1">
                          <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-xl after:hidden">
                            <AvatarImage src={line?.image!} />
                            <AvatarFallback>
                              {getAvatarFallback(line.title)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 leading-tight font-medium whitespace-normal">
                            {line.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="rounded-xl border border-border uppercase"
                          >
                            {line.identifier}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-28 self-center text-right">
                        {formatUSD(15)}
                      </div>
                      <div className="w-28 self-center text-right">
                        <Button
                          type="button"
                          variant={isAdded ? "outline" : "default"}
                          className="rounded-lg"
                          size="icon-sm"
                          onClick={() => {
                            if (isAdded) {
                              const filtered = items?.filter(
                                (i) => i.productId !== line.id,
                              );
                              form.setFieldValue("items", filtered);
                            } else {
                              field.pushValue({
                                title: line.title,
                                identifier: line.identifier,
                                image: line.image as string,
                                basePrice: line.basePrice,
                                productId: line.id,
                                price: line.basePrice,
                              });
                            }
                          }}
                        >
                          {isAdded ? <X /> : <Plus />}
                        </Button>
                      </div>
                    </div>
                  );
                })
              }
            />
          </div>

          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-start">
            <Tooltip content="Previous page">
              <Button
                className="size-8! rounded-lg"
                size="icon"
                variant="outline"
                disabled={Number(filters.page) <= 1}
                onClick={() => {
                  setFilters({
                    ...filters,
                    page: String(Number(filters.page) - 1),
                  });
                }}
              >
                <ArrowLeft />
              </Button>
            </Tooltip>

            <Tooltip content="Next page">
              <Button
                className="size-8! rounded-lg"
                size="icon"
                variant="outline"
                disabled={
                  Number(filters.page) >= (data?.pagination?.totalPages ?? 1)
                }
                onClick={() => {
                  setFilters({
                    ...filters,
                    page: String(Number(filters.page) + 1),
                  });
                }}
              >
                <ArrowRight />
              </Button>
            </Tooltip>

            <DialogClose asChild>
              <Button
                type="button"
                className="ml-auto w-20! rounded-lg"
                size="lg"
              >
                Done
              </Button>
            </DialogClose>
          </Field>
        </DialogContent>
      </Dialog>
    );
  },
});
