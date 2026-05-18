"use client";

import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronsUpDown,
  GripVerticalIcon,
  ImageOff,
  LayoutGrid,
  Loader,
  Plus,
  Search,
  TextAlignJustify,
  Trash2,
} from "lucide-react";
import React from "react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuide,
} from "@/server/order-guide";
import { formatUSD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { FieldGroup } from "@/components/ui/field";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm, withForm } from "@/hooks/form-context";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { CustomersSelector } from "@/components/admin/customers-selector";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductSelectorCustomer } from "@/components/admin/product-selector-customer";

const LAYOUTS = [
  {
    value: "list",
    icon: TextAlignJustify,
    className: "grid-cols-1 gap-1",
    itemClassName: "",
  },
  {
    value: "grid",
    icon: LayoutGrid,
    className:
      "grid-cols-1 *:rounded-xl @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 gap-4",
    itemClassName: "",
  },
];

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

type OrderGuide = z.infer<typeof schema>;

export const OrderGuideForm = ({
  initialData,
}: {
  initialData?: z.infer<typeof schema> & {
    id: number | undefined;
  };
}) => {
  const confirm = useConfirm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [layout, setLayout] = React.useState("list");

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
          router.push(`/admin/order-guides/${data.id}`);
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
          router.replace("/admin/order-guides");
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
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full flex-col gap-6"
        >
          {/* actions */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-4">
              <Button
                size="sm"
                asChild
                variant="outline"
                className="shrink-0 rounded-xl"
              >
                <Link href="/admin/order-guides">
                  <ChevronLeft /> Back
                </Link>
              </Button>

              <form.Field
                name="name"
                children={(field) => (
                  <h1 className="flex-1 text-lg font-semibold">
                    {field.state.value || "New"}
                  </h1>
                )}
              />
            </div>

            {/* show remove and  button if owned */}
            <form.Subscribe
              selector={({ isSubmitting, canSubmit, isDirty }) => ({
                isSubmitting,
                canSubmit,
                isDirty,
              })}
            >
              {({ isSubmitting, canSubmit, isDirty }) => {
                return (
                  <>
                    <Button
                      type="submit"
                      size="xl"
                      className="w-32 rounded-lg"
                      disabled={isSubmitting || !canSubmit}
                    >
                      {isSubmitting ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="xl"
                      className="w-32 rounded-lg"
                      onClick={handleDelete}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </>
                );
              }}
            </form.Subscribe>
          </div>

          <Card className="rounded-2xl border shadow-sm">
            <CardContent>
              <FieldGroup>
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
                        {teams.length > 0 ? (
                          <div className="space-y-1">
                            {teams?.map((team, i) => (
                              <div
                                key={team.teamId}
                                className="flex items-center gap-2 rounded-lg border p-3"
                              >
                                <div className="flex-1 flex flex-col gap-1">
                                  <span className="font-medium">
                                    {team.name}
                                  </span>
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
              </FieldGroup>
            </CardContent>
          </Card>

          {/* item list */}
          <div
            className="group/card @container rounded-2xl border bg-background p-6 shadow-sm"
            data-layout={layout}
          >
            <div className="mb-6 flex items-center gap-4">
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
              <ToggleGroup
                type="single"
                variant="outline"
                value={layout}
                onValueChange={(v) => {
                  setLayout(v || "grid");
                }}
              >
                {LAYOUTS.map(({ value, icon }, i) => {
                  const Icon = icon;
                  return (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="data-[state=on]:bg-sidebar-accent data-[state=on]:text-primary-foreground"
                    >
                      <Icon />
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>

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
                    strategy={layout === "grid" ? "grid" : "vertical"}
                    className={`text-base px-0 grid ${LAYOUTS.find((l) => l.value === layout)?.className}`}
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
          </div>
        </form>
      </div>
    </div>
  );
};

const ItemCard = withForm({
  defaultValues: {} as OrderGuide,
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
