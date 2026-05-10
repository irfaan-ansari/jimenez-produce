"use client";
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
import { File } from "@duo-icons/react";
import { Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";
import { Badge } from "@/components/reui/badge";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { ProductSelectorCustomer } from "./product-selector-customer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import z from "zod";

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
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      items: [] as z.infer<typeof schema>["items"],
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("(Demo) order guide saved successfully", { id: toastId });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl p-0 ring-ring/10 sm:max-w-2xl">
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
              Add order guide
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="no-scrollbar flex-1 overflow-auto px-6">
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
                    <ProductSelectorCustomer
                      selected={field.state.value}
                      setSelectedChange={(value) => {
                        const current = field.state.value || [];
                        const index = current.findIndex(
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
                        className="w-full justify-start text-muted-foreground"
                      >
                        <Search />
                        Browse catalog
                      </Button>
                    </ProductSelectorCustomer>
                    <form.Subscribe
                      selector={({ values }) => ({ items: values.items })}
                      children={({ items }) => {
                        return (
                          <Sortable
                            strategy="vertical"
                            value={items}
                            onValueChange={(v) => {
                              form.setFieldValue("items", v);
                              console.log(v);
                            }}
                            getItemValue={(item) => String(item.productId)}
                            className="divide-y"
                          >
                            {items?.map((item, index) => {
                              return (
                                <SortableItem
                                  key={index}
                                  value={String(item.productId)}
                                  className="flex flex-1 items-center gap-3 bg-background py-2 first:pt-0 last:pb-0"
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
                                        {getAvatarFallback(
                                          (item.title as string)?.[0],
                                        )}
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
                isDirty,
              })}
              children={({ isSubmitting, canSubmit, isDirty }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-lg"
                  disabled={isSubmitting || !canSubmit || !isDirty}
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
