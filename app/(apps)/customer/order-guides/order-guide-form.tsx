"use client";

import z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  ChevronLeft,
  GripVerticalIcon,
  LayoutGrid,
  Loader,
  Search,
  TextAlignJustify,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/form-context";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { createOrderGuide } from "@/server/order-guide";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { ProductSelectorCustomer } from "../../../../components/admin/product-selector-customer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      categories: z.array(z.string()),
      image: z.string(),
      basePrice: z.string(),
    }),
  ),
  layout: z.string(),
});

export const OrderGuideForm = ({
  initialData,
}: {
  initialData?: z.infer<typeof schema> & { id: number | undefined };
}) => {
  const {
    id,
    name = "",
    description = "",

    items = [],
    layout: itemLayout = "list",
  } = initialData || {};
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      name,
      description,

      items,
      layout: itemLayout,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { items, layout, ...rest } = value;

      const productIds = items.map((item) => Number(item.id));

      if (id) {
        // const { success } = await updateOrderGuide({ ...rest, productIds });
        toast.success("(Demo) Update order guide successfully", {
          id: toastId,
        });
      } else {
        const { success, error, data } = await createOrderGuide({
          ...rest,
          productIds,
        });

        if (success) {
          router.push(`/customer/order-guides/${data.id}`);
          toast.success("Order guide created successfully", { id: toastId });
        } else {
          toast.error(error.message, { id: toastId });
        }
      }
    },
  });

  const {
    name: valueName,
    description: valueDescription,
    layout,
    items: valueItems,
  } = useStore(form.store, ({ values }) => values);

  return (
    <div className="grid grid-cols-7 gap-6">
      <div className="col-span-7 space-y-6 lg:col-span-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full flex-col gap-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
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
              <h1 className="text-lg font-semibold">
                {valueName || "New Order Guide"}
              </h1>
            </div>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit, isDirty }) => ({
                isSubmitting,
                canSubmit,
                isDirty,
              })}
              children={({ isSubmitting, canSubmit, isDirty }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="w-32 rounded-lg"
                  disabled={isSubmitting || !canSubmit || !isDirty}
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </div>
          <Card className="rounded-2xl">
            <FieldGroup className="px-6">
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
          </Card>
          <Card className="rounded-2xl">
            <CardContent>
              <div className="space-y-4">
                <form.Field
                  name="items"
                  mode="array"
                  children={(field) => {
                    const items = field.state.value || [];
                    return (
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">Items</p>
                        <div className="flex gap-4">
                          <ProductSelectorCustomer
                            // @ts-expect-error
                            selected={form.getFieldValue("items")}
                            setSelectedChange={(value) => {
                              const index = items.findIndex(
                                (item) => String(item.id) === String(value.id),
                              );
                              if (index >= 0) {
                                field.removeValue(index);
                              } else {
                                // @ts-expect-error
                                field.pushValue(value);
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="xl"
                              type="button"
                              className="flex-1 justify-start text-muted-foreground"
                            >
                              <Search />
                              Browse catalog
                            </Button>
                          </ProductSelectorCustomer>

                          <form.Field
                            name="layout"
                            children={(field) => (
                              <ToggleGroup
                                type="single"
                                variant="outline"
                                value={field.state.value}
                                onValueChange={(v) => field.setValue(v)}
                              >
                                <ToggleGroupItem
                                  value="list"
                                  className="size-11"
                                >
                                  <TextAlignJustify />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="grid"
                                  className="size-11"
                                >
                                  <LayoutGrid />
                                </ToggleGroupItem>
                              </ToggleGroup>
                            )}
                          />
                        </div>
                      </div>
                    );
                  }}
                />
                <Sortable
                  strategy={layout === "grid" ? "grid" : "vertical"}
                  value={valueItems}
                  onValueChange={(v) => {
                    form.setFieldValue("items", v);
                  }}
                  getItemValue={(item) => item.id}
                  className="space-y-1 group"
                  data-layout={layout}
                >
                  {valueItems?.map((item, index) => {
                    return (
                      <SortableItem
                        key={item.id}
                        value={String(item.id)}
                        className="flex flex-1 border rounded-lg p-2 items-center gap-3 bg-background"
                      >
                        <SortableItemHandle>
                          <GripVerticalIcon className="size-4" />
                        </SortableItemHandle>
                        <div className="shrink-0">
                          <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                            <AvatarImage src={item?.image || undefined} />
                            <AvatarFallback>
                              {getAvatarFallback((item.title as string)?.[0])}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p>{item.title}</p>
                          <div className="flex items-center gap-1">
                            {item.categories?.map((cat, i) => (
                              <Badge
                                key={cat + i}
                                variant="outline"
                                className="rounded-xl border border-border bg-primary/20"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="w-28 self-center text-right font-semibold text-primary">
                          {formatUSD(item.basePrice)}
                        </div>
                        <Button
                          size="xs"
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            form.removeFieldValue("items", index);
                          }}
                        >
                          Remove
                        </Button>
                      </SortableItem>
                    );
                  })}
                </Sortable>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <div className="col-span-7 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-col gap-3 relative">
            <CardTitle className="text-base font-semibold">
              {valueName || "New Order Guide"}
            </CardTitle>
            <CardDescription>
              {valueDescription || "No description"}
            </CardDescription>
            <Separator />
            <span className="font-medium">{valueItems.length} Items</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
