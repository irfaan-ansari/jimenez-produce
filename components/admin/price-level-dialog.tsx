"use client";

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
} from "../ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

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
  X,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip } from "../tooltip";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useStore } from "@tanstack/react-form";
import { useDebounce } from "@/hooks/use-debounce";
import { PopoverXDrawer } from "../popover-x-drawer";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { useAppForm, withForm } from "@/hooks/form-context";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useCategories, useProducts } from "@/hooks/use-product";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const defaultValues = {
  name: "",
  type: "fixed", // fixed | percentage
  value: "",
  scope: "all", // all | per_item
  status: "active",
  items: [] as Record<string, any>[],
};

export const PriceLevelDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log(value);
      setOpen(false);
      //   form.reset();
    },
  });

  const { values } = useStore(form.store, (state) => state);

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
            <DialogTitle className="text-xl font-semibold">
              <form.Subscribe
                selector={(state) => state.values.name}
                children={(name) => name || "Price Level"}
              />
            </DialogTitle>
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

              {/* type */}
              <form.Field
                name="type"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet
                      data-invalid={isInvalid}
                      className="lg:col-span-2"
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

              {/* scope */}
              <form.Field
                name="scope"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet
                      data-invalid={isInvalid}
                      className="lg:col-span-2"
                    >
                      <FieldLegend variant="label">Scope</FieldLegend>
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

              {/* all items */}
              {values.scope === "all" && (
                <form.Field
                  name="value"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field className="lg:col-span-2">
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
                          <InputGroupAddon align="inline-end">
                            {values.type === "percentage" ? (
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
              )}
            </FieldGroup>

            {/* per item  */}
            {values.scope === "per_item" && <ItemList form={form} />}
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
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
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

const ItemList = withForm({
  defaultValues,
  render: function Render({ form }) {
    const { items, type } = useStore(form.store, (state) => state.values);

    return (
      <div className="mt-6 flex flex-col">
        <div className="mb-6 space-y-2 px-6">
          <div className="text-base font-semibold">Browse Products</div>
          <SelectItemDialog form={form} />
        </div>
        <div className="flex w-full gap-4 border-y bg-secondary px-6 py-3 text-sm text-muted-foreground uppercase">
          <span className="flex-1">item</span>
          <span className="w-28 shrink-0 truncate text-right">price</span>
          <span className="w-24 shrink-0 text-right">Inc/Dec</span>
        </div>

        <div className="divide-y">
          {items.map((line, i) => (
            <div className="flex gap-4 px-6 py-2" key={line.id}>
              <div className="flex flex-1 items-start gap-3">
                <div className="shrink-0 pt-1">
                  <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                    <AvatarImage src={line?.image as string} />
                    <AvatarFallback>
                      {getAvatarFallback((line.title as string)?.[0])}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="leading-tight font-medium whitespace-normal">
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
              <div className="grid w-28 self-center text-right">
                <span>{formatUSD(20)}</span>
                <span>{formatUSD(20)}</span>
              </div>
              <div className="w-24 self-center text-right">
                <InputGroup className="h-10 rounded-xl">
                  <form.Field
                    name={`items[${i}].value`}
                    children={(field) => (
                      <InputGroupInput
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  />
                  <InputGroupAddon align="inline-end">
                    {type === "percentage" ? <Percent /> : <DollarSign />}
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No items added</p>
            </div>
          )}
        </div>
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
    // use debounce on search
    const { data: categories } = useCategories();
    const { data, isPending, isError } = useProducts(query.toString());
    const { items } = useStore(form.store, (state) => state.values);

    return (
      <Dialog>
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
            <DialogTitle className="text-xl font-semibold">
              Add Items
            </DialogTitle>
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

          <div className="mb-6 no-scrollbar flex-1 divide-y overflow-auto">
            {isPending && (
              <div className="h-1 animate-pulse rounded-full bg-primary" />
            )}
            {data?.data?.map((line, i) => {
              const isAdded = items.findIndex((i) => i.id === line.id) >= 0;
              return (
                <div
                  className={`flex gap-4 px-6 py-2 ${
                    isAdded ? "bg-primary/10" : ""
                  }`}
                  key={line.id}
                >
                  <div className="flex flex-1 items-start gap-3">
                    <div className="shrink-0 pt-1">
                      <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                        <AvatarImage src={line?.image!} />
                        <AvatarFallback>
                          {getAvatarFallback(line.title?.[0])}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0">
                      <h4 className="leading-tight font-medium whitespace-normal">
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
                    {isAdded ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        size="icon-sm"
                        onClick={() => {
                          const filtered = items.filter(
                            (i) => i.id !== line.id,
                          );
                          form.setFieldValue("items", filtered);
                        }}
                      >
                        <X />
                      </Button>
                    ) : (
                      <AddItemDialog form={form} item={line} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end  sm:[&>*]:size-8">
            {(data?.pagination.page ?? 1) >
              (data?.pagination?.totalPages ?? 1) && (
              <Tooltip content="Previous page">
                <Button
                  className="rounded-xl"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      page: String((data?.pagination.page ?? 1) - 1),
                    });
                  }}
                >
                  <ArrowLeft />
                </Button>
              </Tooltip>
            )}
            {(data?.pagination.page ?? 1) <
              (data?.pagination?.totalPages ?? 1) && (
              <Tooltip content="Next page">
                <Button
                  className="rounded-xl"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      page: String((data?.pagination.page ?? 1) + 1),
                    });
                  }}
                >
                  <ArrowRight />
                </Button>
              </Tooltip>
            )}
          </Field>
        </DialogContent>
      </Dialog>
    );
  },
});

const AddItemDialog = withForm({
  defaultValues,
  props: {} as {
    item: Record<string, any>;
  },
  render: function ({ form, item }) {
    const { items, type } = useStore(form.store, (state) => state.values);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      const updatedItems = [...items];
      updatedItems.push({ ...item, value });
      form.setFieldValue("items", updatedItems);
      setOpen(false);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-xl" size="sm">
            <Plus />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl ring-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Item
            </DialogTitle>
          </DialogHeader>
          <InputGroup className="rounded-xl">
            <InputGroupInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick();
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              {type === "percentage" ? <Percent /> : <DollarSign />}
            </InputGroupAddon>
          </InputGroup>
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end  sm:[&>*]:w-28">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="button"
              size="xl"
              className="rounded-xl"
              onClick={handleClick}
            >
              Add
            </Button>
          </Field>
        </DialogContent>
      </Dialog>
    );
  },
});
