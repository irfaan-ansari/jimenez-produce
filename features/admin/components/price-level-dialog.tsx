"use client";

import z from "zod";
import {
  DollarSign,
  ImageOff,
  Loader,
  Percent,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import React, { useState } from "react";
import { PriceLevelType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAppForm, withForm } from "@/hooks/form-context";
import { createPriceLevel, updatePriceLevel } from "@/server/price-level";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductSelector } from "@/components/admin/product-selector";
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";

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
        if (value.appliesTo === "per_item") {
          value.adjustmentValue = "";
          value.adjustmentType = "";
          value.items = value.items.filter(
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
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="rounded-2xl ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="max-h-[min(700px,90svh)] flex  flex-col overflow-hidden gap-4 md:gap-6"
        >
          <AppDialogHeader>
            <AppDialogTitle className="text-xl font-bold">
              Price level
            </AppDialogTitle>
          </AppDialogHeader>
          <div className="flex-1 overflow-auto no-scrollbar">
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
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
              {/* per item  */}
              {/* @ts-ignore */}
              {appliesTo === "per_item" && <ItemList form={form} />}
            </FieldGroup>
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
      </AppDialogContent>
    </AppDialog>
  );
};

/**
 *
 */
const ItemList = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col space-y-4 lg:col-span-2">
        <form.Field
          name="items"
          mode="array"
          children={(field) => (
            <ProductSelector
              selected={field.state.value.map((t) => t.productId)}
              setSelectedChange={(value) => {
                const {
                  id: productId,
                  title,
                  identifier,
                  basePrice,
                  image,
                } = value;

                const index = field.state.value.findIndex(
                  (t) => t.productId == productId,
                );

                if (index === -1) {
                  field.pushValue({
                    productId,
                    title,
                    identifier,
                    image,
                    basePrice,
                    price: "",
                  });
                }
              }}
            >
              <Button
                size="xl"
                variant="outline"
                className="justify-start rounded-xl text-muted-foreground"
              >
                <Plus /> Select products...
              </Button>
            </ProductSelector>
          )}
        />

        <form.Field
          name="items"
          mode="array"
          children={(field) => {
            return (
              <div className="divide-y">
                {field.state.value.map((item, i) => {
                  return (
                    <div
                      className="flex gap-3 not-first:pt-2 not-last:pb-2"
                      key={item.productId}
                    >
                      <div className="flex items-start flex-1 gap-3">
                        <div className="pt-1 shrink-0">
                          <Avatar className="size-9 rounded-lg ring-2 ring-ring ring-offset-1 **:rounded-lg after:hidden">
                            <AvatarImage src={item?.image as string} />
                            <AvatarFallback>
                              <ImageOff className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-medium leading-tight whitespace-normal">
                            {item.title}
                          </h4>
                          <span className="text-xs font-medium text-muted-foreground">
                            {item.identifier}
                          </span>
                        </div>
                      </div>

                      <div className="self-center w-20 text-right">
                        <form.Field
                          name={`items[${i}].price`}
                          children={(field) => (
                            <InputGroup className="h-9">
                              <InputGroupAddon>$</InputGroupAddon>
                              <InputGroupInput
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                className="text-right h-9"
                                placeholder={item.basePrice ?? "0"}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                              />
                            </InputGroup>
                          )}
                        />
                      </div>
                      <div className="self-center w-10 text-right">
                        <Button
                          size="icon-xs"
                          variant="destructive"
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
            );
          }}
        />
      </div>
    );
  },
});
