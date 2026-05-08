"use client";

import z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertCircleIcon,
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
  CardFooter,
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
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuide,
} from "@/server/order-guide";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { ProductSelectorCustomer } from "@/components/admin/product-selector-customer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";

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
        queryKey: ["order-guides"],
      });
    },
  });

  const {
    name: valueName,
    description: valueDescription,
    items: valueItems,
  } = useStore(form.store, ({ values }) => values);

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
        } else {
          toast.error(error.message, { id: toastId });
        }
      },
    });
  };

  return (
    <div className="grid grid-cols-6 gap-6">
      <div className="col-span-6 space-y-6 lg:col-span-4">
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
              {/* if read only */}
              {id && !teamId && (
                <Badge
                  variant="secondary"
                  className="border border-amber-200 bg-amber-100"
                >
                  Suggested
                </Badge>
              )}
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
                  disabled={
                    isSubmitting || !canSubmit || !isDirty || !!(id && !teamId)
                  }
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
                            selected={field.state.value}
                            setSelectedChange={(value) => {
                              const index = items.findIndex(
                                (item) => item.productId === value.productId,
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
                              size="xl"
                              type="button"
                              className="flex-1 justify-start text-muted-foreground"
                            >
                              <Search />
                              Browse catalog
                            </Button>
                          </ProductSelectorCustomer>

                          <ToggleGroup
                            type="single"
                            variant="outline"
                            value={layout}
                            onValueChange={(v) => {
                              if (v) setLayout(v);
                            }}
                          >
                            <ToggleGroupItem value="list" className="size-11">
                              <TextAlignJustify />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="grid" className="size-11">
                              <LayoutGrid />
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    );
                  }}
                />
                <Sortable
                  strategy={layout === "grid" ? "grid" : "vertical"}
                  value={valueItems}
                  onValueChange={(v) => {
                    const reordered = v.map((i) => ({
                      ...i,
                      productId: Number(i.productId),
                    }));
                    form.setFieldValue("items", reordered);
                  }}
                  getItemValue={(item) => String(item.productId)}
                  className="group space-y-1"
                  data-layout={layout}
                >
                  {valueItems?.map((item, index) => {
                    return (
                      <SortableItem
                        key={item.productId}
                        value={String(item.productId)}
                        className="flex flex-1 items-center gap-3 rounded-lg border bg-background p-2"
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
                          {formatUSD(item.price)}
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
      <div className="col-span-2 space-y-6">
        <Card className="hidden flex-col gap-6 lg:flex">
          <CardContent className="flex-1 space-y-3">
            <CardTitle className="text-lg font-semibold">
              {valueName || "New Order Guide"}
            </CardTitle>

            {/* {!item.teamId && (
              <Badge
                variant="secondary"
                className="h-6 border border-amber-200 bg-amber-100"
              >
                Suggested
              </Badge>
            )} */}
            <CardDescription>
              {valueDescription || "No description"}
            </CardDescription>
          </CardContent>

          <CardFooter className="border-t font-medium">
            {valueItems.length} Items
          </CardFooter>
        </Card>
        <div className="bg-background">
          {id && teamId && (
            <Alert
              variant="destructive"
              className="border-destructive bg-destructive/2"
            >
              <AlertCircleIcon />
              <AlertTitle>Delete this order guide</AlertTitle>
              <AlertDescription className="text-muted-foreground!">
                This action cannot be undone. This will permanently delete the
                order guide.
              </AlertDescription>
              <AlertAction>
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </AlertAction>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
