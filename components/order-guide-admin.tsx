"use client";

import {
  ChevronsUpDown,
  GripVerticalIcon,
  ImageOff,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "./app-dialog";
import z from "zod";
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuide,
} from "@/server/order-guide";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { formatUSD } from "@/lib/utils";
import React, { useState } from "react";
import { FieldGroup } from "./ui/field";
import { useAppForm } from "@/hooks/form-context";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { CustomersSelector } from "./admin/customers-selector";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ProductSelectorAdmin } from "./admin/product-selector-admin";
import { Sortable, SortableItem, SortableItemHandle } from "./reui/sortable";

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
  items: z.array(
    z.object({
      productId: z.number(),
      title: z.string(),
      categories: z.array(z.string()),
      image: z.any(),
      price: z.string().optional(),
    }),
  ),
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
  const [open, onOpenChange] = useState(false);

  const confirm = useConfirm();
  const queryClient = useQueryClient();

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
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { items, teams, ...rest } = value;

      const teamIds = teams.map((t) => t.teamId);
      const productIds = items.map((item) => Number(item.productId));
      if (id) {
        const { success, error } = await updateOrderGuide(id, {
          ...rest,
          productIds,
          teamIds,
        });

        if (success) {
          toast.success("Order guide saved successfully", { id: toastId });
        } else {
          toast.error(error.message, { id: toastId });
        }
      } else {
        const { success, error, data } = await createOrderGuide({
          ...rest,
          productIds,
          teamIds,
        });

        if (success) {
          toast.success("Order guide saved successfully", { id: toastId });
        } else {
          toast.error(error.message, { id: toastId });
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-order-guides"],
      });
    },
  });

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="sm:max-w-2xl lg:max-h-[min(800px,90vh)]">
        <AppDialogHeader>
          <AppDialogTitle className="text-xl font-semibold">
            Order Guideee
          </AppDialogTitle>
          <AppDialogDescription className="sr-only">
            Order Guide Admin
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="no-scrollbar flex-1 overflow-auto">
          <FieldGroup className="">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="Weekly essentials" />
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
                        className="w-full justify-start text-muted-foreground"
                      >
                        <Plus /> Select Accounts
                        <ChevronsUpDown className="ml-auto" />
                      </Button>
                    </CustomersSelector>
                    {teams.length > 0 ? (
                      <div className="space-y-1">
                        {teams?.map((team, i) => (
                          <div
                            key={team.teamId}
                            className="flex items-center gap-2 rounded-lg border p-3"
                          >
                            <div className="flex flex-1 flex-col gap-1">
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
              children={(field) => (
                <ProductSelectorAdmin
                  selected={field.state.value.map((item) => item.productId)}
                  setSelectedChange={(value) => {
                    const index = field.state.value.findIndex(
                      (item) => Number(item.productId) === Number(value.id),
                    );

                    if (index >= 0) {
                      field.removeValue(index);
                    } else {
                      field.pushValue({
                        ...value,
                        productId: value.id,
                        image: value.image ?? "",
                      });
                    }
                  }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    type="button"
                    className="w-full justify-start text-muted-foreground"
                  >
                    <Plus />
                    Add products...
                    <ChevronsUpDown className="ml-auto" />
                  </Button>
                </ProductSelectorAdmin>
              )}
            />
            <form.Subscribe
              selector={(state) => state.values.items}
              children={(items) => {
                return (
                  <Sortable
                    value={items}
                    className="space-y-1"
                    onValueChange={(v) => {
                      const reordered = v.map((i) => ({
                        ...i,
                        productId: Number(i.productId),
                      }));
                      form.setFieldValue("items", reordered);
                    }}
                    getItemValue={(item) => String(item.productId)}
                    strategy="vertical"
                  >
                    {items.map((subField, idx) => (
                      <SortableItem
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
                          <p className="text-sm leading-tight font-medium">
                            {subField.title}
                          </p>
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            {subField.categories?.join(" • ")}
                          </span>
                        </div>
                        <div className="self-center text-right text-primary">
                          {formatUSD(Number(subField.price ?? 0))}
                        </div>
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          type="button"
                        >
                          <Trash2 />
                        </Button>
                      </SortableItem>
                    ))}
                  </Sortable>
                );
              }}
            />
          </FieldGroup>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
};
