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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import React, { useState } from "react";
import {
  Check,
  DollarSign,
  ListFilter,
  Loader,
  Percent,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useAppForm, withForm } from "@/hooks/form-context";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useStore } from "@tanstack/react-form";
import { useCategories, useProducts } from "@/hooks/use-product";
import { useDebounce } from "@/hooks/use-debounce";
import { PopoverXDrawer } from "../popover-x-drawer";
import { Tooltip } from "../tooltip";

const defaultValues = {
  name: "",
  type: "fixed", // fixed | percentage
  value: "0",
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
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-2xl px-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col h-[calc(100svh-200px)]"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-xl font-semibold">
              <form.Subscribe
                selector={(state) => state.values.name}
                children={(name) => name || "Price Level"}
              />
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto no-scrollbar">
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 px-6">
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
                                Set a fixed amount
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
          <Field className="pt-4 flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
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
      <div className="flex flex-col mt-6">
        <div className="px-6 mb-6 space-y-2">
          <div className="text-base font-semibold">Browse Products</div>
          <SelectItemDialog form={form} />
        </div>
        <div className="flex w-full border-y gap-4 px-6 py-3 text-sm text-muted-foreground uppercase bg-secondary">
          <span className="flex-1">item</span>
          <span className="w-28 shrink-0 text-right truncate">price</span>
          <span className="w-28 shrink-0 text-right">new price</span>
        </div>

        <div className="divide-y">
          {items.map((line, i) => (
            <div className="flex gap-4 px-6 py-2" key={line.id}>
              <div className="flex gap-3 items-start flex-1">
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
                    className="border border-border rounded-xl uppercase"
                  >
                    {line.identifier}
                  </Badge>
                </div>
              </div>
              <div className="w-28 text-right self-center grid">
                <Tooltip content="lorem">
                  <>
                    <span>{formatUSD(20)}</span>
                    <span>{formatUSD(20)}</span>
                  </>
                </Tooltip>
              </div>
              <div className="w-28 text-right self-center">
                <InputGroup className="rounded-xl h-10">
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
        </div>
      </div>
    );
  },
});

const SelectItemDialog = withForm({
  defaultValues,
  render: function Render({ form }) {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({ q: "", cat: "" });
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
            className="rounded-xl justify-start w-full"
            size="lg"
          >
            <Search />
            <span className="text-muted-foreground">Browse...</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="ring-ring/10 gap-0 h-[calc(100svh-200px)] rounded-2xl sm:max-w-xl px-0 flex flex-col">
          {/* header */}
          <DialogHeader className="px-6 mb-6">
            <DialogTitle className="text-xl font-semibold">
              Add Items
            </DialogTitle>
          </DialogHeader>

          {/* search and filter */}
          <div className="flex gap-6 px-6 items-center mb-6">
            <InputGroup className="rounded-xl">
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
                  size="xl"
                  type="button"
                  className="rounded-xl px-4 text-sm border-border"
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
          <div className="flex w-full border-y gap-4 px-6 py-3 text-sm text-muted-foreground uppercase bg-secondary">
            <span className="flex-1">item</span>
            <span className="w-28 shrink-0 text-right">price</span>
            <span className="w-28 shrink-0 text-right">action</span>
          </div>

          <div className="overflow-auto no-scrollbar divide-y flex-1">
            {isPending && (
              <div className="h-1 bg-primary animate-pulse rounded-full" />
            )}
            {data?.data?.map((line, i) => {
              const isAdded = items.findIndex((i) => i.id === line.id) >= 0;
              return (
                <div
                  className={`flex gap-4 px-6 py-2 ${
                    isAdded ? "bg-primary/20" : ""
                  }`}
                  key={line.id}
                >
                  <div className="flex gap-3 items-start flex-1">
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
                        className="border border-border rounded-xl uppercase"
                      >
                        {line.identifier}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-28 text-right self-center">
                    {formatUSD(15)}
                  </div>
                  <div className="w-28 text-right self-center">
                    {isAdded ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        size="icon"
                        onClick={() => {
                          const filtered = items.filter(
                            (i) => i.id !== line.id
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

    const handleClick = () => {
      console.log("clicked");
      const updatedItems = [...items];
      updatedItems.push({ ...item, value });
      form.setFieldValue("items", updatedItems);
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-xl">
            <Plus />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="ring-0 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Item
            </DialogTitle>
          </DialogHeader>
          <InputGroup className="rounded-xl">
            <InputGroupInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {type === "percentage" ? <Percent /> : <DollarSign />}
            </InputGroupAddon>
          </InputGroup>
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
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
            <DialogClose asChild>
              <Button
                type="button"
                size="xl"
                className="rounded-xl"
                onClick={handleClick}
              >
                Add
              </Button>
            </DialogClose>
          </Field>
        </DialogContent>
      </Dialog>
    );
  },
});
