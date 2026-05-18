"use client";
import React, { useState } from "react";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "./app-dialog";
import z from "zod";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuide,
} from "@/server/order-guide";
import { toast } from "sonner";
import { useAppForm, withForm } from "@/hooks/form-context";
import { FieldGroup } from "./ui/field";
import { CustomersSelector } from "./admin/customers-selector";
import {
  ChevronsUpDown,
  GripVerticalIcon,
  ImageOff,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { ProductSelectorCustomer } from "./admin/product-selector-customer";
import { Sortable, SortableItem, SortableItemHandle } from "./reui/sortable";
import { EmptyComponent } from "./admin/placeholder-component";
import { formatUSD } from "@/lib/utils";

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

type OrderGuideForm = z.infer<typeof schema>;

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

  const handleDelete = async () => {
    if (!id) return;
    confirm.delete({
      title: "Delete order guide",
      description: "Are you sure you want to delete this order guide?",
      action: async () => {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await deleteOrderGuide(id);

        if (success) {
          toast.success("Order guide deleted successfully", { id: toastId });

          queryClient.invalidateQueries({
            queryKey: ["admin-order-guides"],
          });
        } else {
          toast.error(error.message, { id: toastId });
        }
      },
    });
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogTrigger>{children}</AppDialogTrigger>

      <AppDialogContent className="sm:max-w-2xl lg:max-h-[min(700px,90vh)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full flex-col gap-6"
        >
          <AppDialogHeader>
            <AppDialogTitle className="text-xl font-semibold">
              Order Guideee
            </AppDialogTitle>
            <AppDialogDescription className="sr-only">
              Order Guide Admin
            </AppDialogDescription>
          </AppDialogHeader>
          <FieldGroup>
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
                    {teams.length > 0 ? (
                      <div className="space-y-1">
                        {teams?.map((team, i) => (
                          <div
                            key={team.teamId}
                            className="flex items-center gap-2 rounded-lg border p-3"
                          >
                            <div className="flex-1 flex flex-col gap-1">
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
                        size="sm"
                        className="border-2 border-dashed"
                      >
                        <Plus /> Select Accounts
                      </Button>
                    </CustomersSelector>
                  </div>
                );
              }}
            />
            <form.Field
              name="items"
              mode="array"
              children={(field) => (
                <ProductSelectorCustomer
                  selected={field.state.value.map((item) => item.productId)}
                  setSelectedChange={(value) => {
                    const index = field.state.value.findIndex(
                      (item) =>
                        Number(item.productId) === Number(value.productId),
                    );

                    if (index >= 0) {
                      field.removeValue(index);
                    } else {
                      field.pushValue({
                        ...value,
                        image: value.image ?? "",
                      });
                    }
                  }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    type="button"
                    className="flex-1 justify-start text-muted-foreground"
                  >
                    <Search />
                    Browse products...
                    <ChevronsUpDown className="ml-auto" />
                  </Button>
                </ProductSelectorCustomer>
              )}
            />
            <form.Subscribe
              selector={({ values }) => ({ items: values.items })}
              children={({ items }) => {
                if (items.length === 0)
                  return (
                    <EmptyComponent
                      variant="empty"
                      title="No items added yet"
                      description="Start by adding items to your order guide"
                    />
                  );

                return (
                  <Sortable
                    value={items}
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
                      <ItemCard
                        key={subField.productId}
                        form={form}
                        index={idx}
                      />
                    ))}
                  </Sortable>
                );
              }}
            />
          </FieldGroup>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
};

const ItemCard = withForm({
  defaultValues: {} as OrderGuideForm,
  props: {} as { index: number },
  render: function Render({ form, index }) {
    const item = form.getFieldValue("items")[index];

    const handleRemove = React.useCallback(() => {
      const items = form.getFieldValue("items") || [];
      const next = items.filter((_, i) => i !== index);
      form.setFieldValue("items", next);
    }, [form, index]);

    return (
      <SortableItem
        value={String(item.productId)}
        className="relative flex animate-in cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-background p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0 data-[dragging=true]:opacity-100!"
      >
        <SortableItemHandle className="z-1 group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-3 group-data-[layout=grid]/card:left-3">
          <GripVerticalIcon className="size-4" />
        </SortableItemHandle>
        <div className="relative inline-flex aspect-square w-12 shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full group-data-[layout=list]/card:rounded-lg">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              width={200}
              height={200}
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
            />
          ) : (
            <ImageOff className="size-4 opacity-40 group-data-[layout=grid]/card:size-6" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-start gap-4 group-data-[layout=grid]/card:w-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:justify-between group-data-[layout=grid]/card:p-3">
          <div className="flex-1 space-y-1">
            <h4 className="text-sm leading-tight font-medium group-data-[layout=grid]/card:order-2">
              {item.title}
            </h4>

            <div className="text-xs text-muted-foreground uppercase font-medium">
              {item.categories?.join(" • ")}
            </div>
          </div>

          <div className="w-24 self-center text-right font-bold text-primary group-data-[layout=grid]/card:hidden">
            {formatUSD(item.price ?? 0)}
          </div>
          {/* remove action */}
          <Button
            type="submit"
            size="icon-xs"
            variant="destructive"
            className="self-center group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-2 group-data-[layout=grid]/card:right-2 group-data-[layout=grid]/card:z-1"
            onClick={handleRemove}
          >
            <Trash2 />
          </Button>

          <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
            <div className="flex flex-1 flex-col">
              <div className="w-auto self-start font-bold text-primary">
                {formatUSD(item.price ?? 0)}
              </div>
            </div>
          </div>
        </div>
      </SortableItem>
    );
  },
});
