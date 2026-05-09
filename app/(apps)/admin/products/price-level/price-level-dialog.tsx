"use client";

import z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  DollarSign,
  Filter,
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
import { toast } from "sonner";
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
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import React, { useState } from "react";
import { PriceLevelType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { useAppForm, withForm } from "@/hooks/form-context";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useCategories, useProducts } from "@/hooks/use-product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPriceLevel, updatePriceLevel } from "@/server/price-level";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

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
          className="flex h-[min(700px,80svh)] flex-col"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Update" : "Create"} price level
            </DialogTitle>
            <DialogDescription>
              {isEdit ? "Update" : "Create"} price levels for specific customer
              groups to offer specialized pricing.
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
              <div className="lg:col-span-2">
                <form.AppField
                  name="appliesTo"
                  children={(field) => (
                    <field.RadioField
                      label="Apply To"
                      options={[
                        {
                          label: "All",
                          value: "all",
                          description: "Apply to all items",
                        },
                        {
                          label: "Selected Items",
                          value: "per_item",
                          description: "Apply to selected items",
                        },
                      ]}
                    />
                  )}
                />
              </div>

              {/* type */}
              <div
                className={`lg:col-span-2 ${appliesTo !== "all" ? "hidden" : ""}`}
              >
                <form.AppField
                  name="adjustmentType"
                  children={(field) => (
                    <field.RadioField
                      label="Adjustment Type"
                      options={[
                        {
                          label: "Fixed Amount",
                          value: "fixed",
                          description: "Adjust by fixed amount",
                        },
                        {
                          label: "Percentage",
                          value: "percentage",
                          description: "Adjust by percentage",
                        },
                      ]}
                    />
                  )}
                />
              </div>

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
    return (
      <div className="mt-6 flex flex-col px-6 space-y-4">
        <SelectItemDialog form={form} />

        <form.Field
          name="items"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}

                <div className="space-y-1">
                  {field.state.value.map((item, i) => {
                    return (
                      <div
                        className="flex gap-4 p-2 rounded-xl border"
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
                            <Badge className="rounded-md border border-border uppercase">
                              {item.identifier}
                            </Badge>
                          </div>
                        </div>

                        <div className="w-24 self-center text-right">
                          <form.Field
                            name={`items[${i}].price`}
                            children={(field) => (
                              <Input
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                className="text-right"
                                placeholder={formatUSD(item.basePrice ?? "0")}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                              />
                            )}
                          />
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

        <DialogContent className="flex h-[min(700px,80svh)] flex-col gap-0 rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
          {/* header */}
          <DialogHeader className="mb-6 px-6">
            <DialogTitle className="text-xl font-bold">Add Items</DialogTitle>
          </DialogHeader>

          {/* search and filter */}
          <div className="mb-6 flex items-center gap-6 px-6">
            <InputGroup className="h-10 rounded-lg">
              <InputGroupInput
                placeholder="Search..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <PopoverXDrawer
                  open={open}
                  setOpen={setOpen}
                  trigger={
                    <InputGroupButton variant="secondary" type="button">
                      <Filter /> All Categories <ChevronDown />
                    </InputGroupButton>
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
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="no-scrollbar mb-6 px-6 flex-1 space-y-1 overflow-auto">
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
                      className={`flex gap-4 rounded-lg border p-2 ${
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
                          <Badge className="rounded-md border border-border uppercase">
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
                                price: "",
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
