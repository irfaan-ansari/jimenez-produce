"use client";

import {
  ChevronsUpDown,
  GripVerticalIcon,
  ImageOff,
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "../app-dialog";
import z from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { formatUSD } from "@/lib/utils";
import React, { useState } from "react";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { CustomersSelector } from "./customers-selector";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { ProductSelectorAdmin } from "./product-selector-admin";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createOrderGuide, updateOrderGuide } from "@/server/order-guide";
import { Sortable, SortableItem, SortableItemHandle } from "../reui/sortable";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  teams: z
    .object({
      teamId: z.string(),
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })
    .array(),
  items: z
    .array(
      z.object({
        productId: z.number(),
        title: z.string(),
        categories: z.array(z.string()),
        image: z.any(),
        price: z.string().optional(),
      }),
    )
    .min(1, "At least one product must be added"),
});

export const OrderGuideAdmin = ({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: z.infer<typeof schema> & {
    id: number | undefined;
  };
}) => {
  const queryClient = useQueryClient();
  const [open, onOpenChange] = useState(false);

  const {
    id,
    name = "",
    description = "",
    items = [],
    teams = [],
  } = initialData || {};

  const form = useAppForm({
    defaultValues: {
      name,
      description,
      items,
      teams,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { items, teams, ...rest } = value;

      const teamIds = teams.map((t) => t.teamId);
      const productIds = items.map((item) => Number(item.productId));

      const { success, error } = id
        ? await updateOrderGuide(id, {
            ...rest,
            productIds,
            teamIds,
          })
        : await createOrderGuide({
            ...rest,
            productIds,
            teamIds,
          });

      if (success) {
        queryClient.invalidateQueries({
          queryKey: ["admin-order-guides"],
        });
        onOpenChange(false);
        toast.success("Order guide saved successfully", { id: toastId });
        form.reset();
      } else {
        toast.error(error.message, { id: toastId });
      }
    },
  });

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden sm:max-w-2xl">
        <div className="max-h-[min(700px,90svh)] flex  flex-col overflow-hidden gap-6">
          <AppDialogHeader>
            <AppDialogTitle className="text-xl font-semibold">
              Order Guide
            </AppDialogTitle>
          </AppDialogHeader>
          <div className="flex-1 overflow-auto no-scrollbar">
            <FieldGroup className="">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    placeholder="Weekly essentials"
                  />
                )}
              />
              <form.AppField
                name="description"
                children={(field) => (
                  <field.TextAreaField
                    label="Description"
                    placeholder="Daily produce, dairy and basic dry goods for line service"
                  />
                )}
              />

              <form.Field
                name="teams"
                mode="array"
                children={(field) => {
                  const teams = field.state.value;
                  return (
                    <div className="space-y-4">
                      <CustomersSelector
                        selected={field.state.value.map((t) => ({
                          id: t.teamId,
                        }))}
                        setSelectedChange={(value) => {
                          const index = field.state.value.findIndex(
                            (s) => s.teamId === value.id,
                          );
                          if (index >= 0) {
                            field.removeValue(index);
                          } else {
                            field.pushValue({
                              ...value,

                              teamId: value.id,
                            });
                          }
                        }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          type="button"
                          className="justify-start w-full text-muted-foreground"
                        >
                          <Plus /> Select customers...
                          <ChevronsUpDown className="ml-auto" />
                        </Button>
                      </CustomersSelector>
                      {teams.length > 0 ? (
                        <div className="space-y-1">
                          {teams?.map((team, i) => (
                            <div
                              key={team.teamId}
                              className="flex items-center gap-2 p-3 border rounded-lg"
                            >
                              <div className="flex flex-col flex-1 gap-1">
                                <span className="font-medium">{team.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {team.email} • {team.phone}
                                </span>
                              </div>

                              <Button
                                size="icon-xs"
                                type="button"
                                variant="destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  field.removeValue(i);
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }}
              />

              <form.Field
                name="items"
                mode="array"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const items = field.state.value;
                  return (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <ProductSelectorAdmin
                          selected={items.map((item) => item.productId)}
                          setSelectedChange={(value) => {
                            const index = items.findIndex(
                              (item) =>
                                Number(item.productId) === Number(value.id),
                            );

                            if (index >= 0) {
                              field.removeValue(index);
                            } else {
                              field.pushValue({
                                ...value,
                                productId: value.id,
                                image: value.image ?? "",
                                price: value.basePrice,
                              });
                            }
                          }}
                        >
                          <Button
                            variant="outline"
                            size="lg"
                            type="button"
                            className="justify-start w-full text-muted-foreground"
                          >
                            <Plus />
                            Select products...
                            <ChevronsUpDown className="ml-auto" />
                          </Button>
                        </ProductSelectorAdmin>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </div>
                      <Sortable
                        value={items}
                        className="space-y-1"
                        onValueChange={(v) => {
                          const reordered = v.map((i) => ({
                            ...i,
                            productId: Number(i.productId),
                          }));
                          field.handleChange(reordered);
                        }}
                        getItemValue={(item) => String(item.productId)}
                        strategy="vertical"
                      >
                        {items.map((subField, idx) => (
                          <SortableItem
                            key={String(subField.productId)}
                            value={String(subField.productId)}
                            className="relative flex animate-in cursor-pointer items-center gap-3 overflow-hidden rounded-xl border bg-background p-3 transition fade-in-50 select-none slide-in-from-bottom-10 data-[dragging=true]:opacity-100!"
                          >
                            <SortableItemHandle className="z-1">
                              <GripVerticalIcon className="size-4" />
                            </SortableItemHandle>

                            <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-ring ring-offset-1 **:rounded-lg after:hidden">
                              <AvatarImage src={subField?.image as string} />
                              <AvatarFallback>
                                <ImageOff className="size-4 " />
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-tight">
                                {subField.title}
                              </p>
                              <span className="text-xs font-medium uppercase text-muted-foreground">
                                {subField.categories?.join(" • ")}
                              </span>
                            </div>
                            <div className="self-center font-medium text-right text-primary">
                              {formatUSD(Number(subField.price ?? 0))}
                            </div>
                            <Button
                              size="icon-xs"
                              variant="destructive"
                              type="button"
                              onClick={() => field.removeValue(idx)}
                            >
                              <Trash2 />
                            </Button>
                          </SortableItem>
                        ))}
                      </Sortable>
                    </div>
                  );
                }}
              />
            </FieldGroup>
          </div>
          <Field className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
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
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
};
