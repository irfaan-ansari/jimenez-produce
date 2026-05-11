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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { FieldGroup } from "@/components/ui/field";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm, withForm } from "@/hooks/form-context";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductSelectorCustomer } from "@/components/admin/product-selector-customer";
import { EmptyComponent } from "@/components/admin/placeholder-component";

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
  items: z.array(
    z.object({
      productId: z.number(),
      title: z.string(),
      categories: z.array(z.string()),
      image: z.any(),
      price: z.string().or(z.number()),
    }),
  ),
});

type OrderGuide = z.infer<typeof schema>;
export const OrderGuideForm = ({
  initialData,
}: {
  initialData?: z.infer<typeof schema> & {
    id: number | undefined;
    teamId: string | null;
  };
}) => {
  const confirm = useConfirm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [layout, setLayout] = React.useState("list");

  const {
    id,
    teamId,
    name = "",
    description = "",
    items = [],
  } = initialData || {};

  const form = useAppForm({
    defaultValues: {
      name,
      description,
      items,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { items, ...rest } = value;

      const productIds = items.map((item) => Number(item.productId));

      if (id) {
        const { success, error } = await updateOrderGuide(id, {
          ...rest,
          productIds,
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
        });

        if (success) {
          router.push(`/customer/order-guides/${data.id}`);
          toast.success("Order guide saved successfully", { id: toastId });
        } else {
          toast.error(error.message, { id: toastId });
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["customer-order-guides"],
      });
    },
  });

  const isOwned = !!id && !!teamId;
  const isSuggested = !!id && !teamId;
  const isNew = !id && !teamId;

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
          router.replace("/customer/order-guides");
          queryClient.invalidateQueries({
            queryKey: ["customer-order-guides"],
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
            <div className="flex items-center gap-4 flex-1">
              <Button
                size="sm"
                asChild
                variant="outline"
                className="shrink-0 rounded-xl"
              >
                <Link href="/customer/order-guides">
                  <ChevronLeft /> Back
                </Link>
              </Button>

              <form.Field
                name="name"
                children={(field) => (
                  <h1 className="text-lg font-semibold flex-1">
                    {field.state.value || "New"}
                  </h1>
                )}
              />

              {/* if read only */}
              {isSuggested && (
                <Badge
                  variant="secondary"
                  className="border border-amber-200 bg-amber-100"
                >
                  Suggested
                </Badge>
              )}
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
                const showSubmit = isOwned || isNew;

                return (
                  <>
                    {showSubmit && (
                      <Button
                        type="submit"
                        size="xl"
                        className="w-32 rounded-lg"
                        disabled={
                          isSubmitting || !canSubmit || (isOwned && !isDirty)
                        }
                      >
                        {isSubmitting ? (
                          <Loader className="animate-spin" />
                        ) : isOwned ? (
                          "Update"
                        ) : (
                          "Save"
                        )}
                      </Button>
                    )}

                    {isOwned && (
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
                    )}
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
              </FieldGroup>
            </CardContent>
          </Card>

          {/* item list */}
          <div
            className="group/card @container bg-background p-6 rounded-2xl border shadow-sm"
            data-layout={layout}
          >
            <div className="flex gap-4 items-center mb-6">
              <form.Field
                name="items"
                mode="array"
                children={(field) => (
                  <ProductSelectorCustomer
                    selected={field.state.value}
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
        className="flex data-[dragging=true]:opacity-100! overflow-hidden animate-in relative cursor-pointer items-center bg-background gap-4 rounded-xl border p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0"
      >
        <SortableItemHandle className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-3 group-data-[layout=grid]/card:left-3 z-1">
          <GripVerticalIcon className="size-4" />
        </SortableItemHandle>
        <div className="relative aspect-square inline-flex items-center justify-center w-12 shrink-0 overflow-hidden rounded-t-lg group-data-[layout=list]/card:rounded-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              width={200}
              height={200}
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
            />
          ) : (
            <ImageOff className="opacity-40 size-4 group-data-[layout=grid]/card:size-6" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-start gap-4 group-data-[layout=grid]/card:w-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:justify-between group-data-[layout=grid]/card:p-3">
          <div className="w-full min-w-0 flex flex-col gap-1">
            <h4 className="leading-tight text-sm font-medium group-data-[layout=grid]/card:order-2">
              {item.title}
            </h4>

            <div className="flex w-full items-center gap-2">
              <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
                {item.categories?.map((cat, i) => (
                  <span
                    key={cat + i}
                    className="inline-block text-xs leading-[1.1] font-medium whitespace-nowrap text-muted-foreground uppercase not-last:border-r-2 not-last:pr-1"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-24 self-center font-bold text-primary text-right group-data-[layout=grid]/card:hidden">
            {formatUSD(item.price ?? 0)}
          </div>
          {/* remove action */}
          <Button
            type="submit"
            size="icon-xs"
            variant="destructive"
            className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-2 group-data-[layout=grid]/card:right-2 group-data-[layout=grid]/card:z-1 self-center"
            onClick={handleRemove}
          >
            <Trash2 />
          </Button>

          <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
            <div className="flex flex-1 flex-col">
              <div className="font-bold text-primary w-auto self-start">
                {formatUSD(item.price ?? 0)}
              </div>
            </div>
          </div>
        </div>
      </SortableItem>
    );
  },
});
