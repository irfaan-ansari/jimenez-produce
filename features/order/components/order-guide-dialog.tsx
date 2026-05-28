"use client";

import z from "zod";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import { formatUSD } from "@/lib/utils";
import { File } from "@duo-icons/react";
import { ImageOff, Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { Field, FieldGroup } from "@/components/ui/field";
import { ProductSelector } from "@/features/order/components/product-selector";
import { createOrderGuide, updateOrderGuide } from "@/server/order-guide";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export const OrderGuideDialog = ({
  children,
  initialValue,
  onSuccess,
}: {
  children: React.ReactNode;
  initialValue?: z.infer<typeof schema> & { id?: number };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const isEdit = initialValue?.id !== undefined;

  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: initialValue ?? {
      name: "",
      description: "",
      items: [] as z.infer<typeof schema>["items"],
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const { name, description, items } = value;
      const toastId = toast.loading("Please wait...");
      const productIds = items.map((p) => Number(p.productId));

      let success, error;

      if (isEdit) {
        const res = await updateOrderGuide(initialValue.id!, {
          name,
          description,
          productIds,
        });
        success = res.success;
        error = res.error;
      } else {
        const res = await createOrderGuide({
          name,
          description,
          productIds,
        });
        success = res.success;
        error = res.error;
      }

      if (success) {
        toast.success("Order guide saved successfully!", { id: toastId });
        setOpen(false);
        form.reset();
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [
            "customer-products",
            "customer-order-guides",
            "order-guide",
          ],
        });
      } else {
        toast.error(error?.message, { id: toastId });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full max-h-[min(800px,90svh)] flex-col gap-6 py-6"
        >
          <DialogHeader className="flex-row items-center gap-3 px-6">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-5">
              <File />
            </span>
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Edit guide" : "Create guide"}
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="flex-1 px-6 overflow-auto no-scrollbar">
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
              name="items"
              mode="array"
              children={(field) => {
                return (
                  <div className="space-y-4">
                    <ProductSelector
                      selected={field.state.value.map((item) => item.productId)}
                      setSelectedChange={(value) => {
                        const current = field.state.value || [];

                        const index = current.findIndex(
                          (item) =>
                            String(item.productId) === String(value.productId),
                        );
                        if (index >= 0) {
                          field.removeValue(index);
                        } else {
                          field.pushValue({
                            ...value,
                            price: Number(value.price),
                            image: value.image ?? "",
                          });
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="xl"
                        type="button"
                        className="justify-start w-full text-muted-foreground"
                      >
                        <Search />
                        Browse catalog
                      </Button>
                    </ProductSelector>
                    <form.Subscribe
                      selector={({ values }) => ({ items: values.items })}
                      children={({ items }) => {
                        return (
                          <Sortable
                            strategy="vertical"
                            value={items}
                            onValueChange={(value) => {
                              form.setFieldValue("items", value);
                            }}
                            getItemValue={(item) => String(item.productId)}
                            className="divide-y"
                          >
                            {items?.map((item) => {
                              return (
                                <SortableItem
                                  key={item.productId}
                                  value={String(item.productId)}
                                  className="flex items-center flex-1 gap-3 py-2 bg-background first:pt-0 last:pb-0"
                                >
                                  <SortableItemHandle>
                                    <GripVerticalIcon className="size-4" />
                                  </SortableItemHandle>
                                  <div className="shrink-0">
                                    <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                                      <AvatarImage
                                        src={item?.image as string}
                                      />
                                      <AvatarFallback>
                                        <ImageOff className="size-4" />
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-[15px] font-medium">
                                      {item.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1">
                                      {item.categories?.map((cat, i) => (
                                        <span
                                          key={cat + i}
                                          className="min-w-0 text-xs leading-3.5 font-medium whitespace-nowrap text-muted-foreground uppercase not-first:pl-1 not-last:border-r-2 not-last:pr-1"
                                        >
                                          {cat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="self-center font-semibold text-right w-28 text-primary">
                                    {formatUSD(item.price)}
                                  </div>
                                  <Button
                                    size="xs"
                                    variant="destructive"
                                    type="button"
                                  >
                                    Remove
                                  </Button>
                                </SortableItem>
                              );
                            })}
                          </Sortable>
                        );
                      }}
                    />
                  </div>
                );
              }}
            />
          </FieldGroup>

          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogClose>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit, isDirty }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-lg"
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
