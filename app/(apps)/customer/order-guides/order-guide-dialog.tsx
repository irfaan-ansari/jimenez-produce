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
import { ProductSelectType } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  visibility: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      categories: z.array(z.string()),
      image: z.string(),
      basePrice: z.string(),
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
      visibility: "shared",
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
      <DialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full max-h-[min(700px,90svh)] flex-col gap-6"
        >
          <DialogHeader className="flex-row items-center gap-3">
            <span className="inline-flex *:size-5 size-9 items-center justify-center rounded-lg border bg-secondary">
              <File />
            </span>
            <DialogTitle className="text-xl font-bold">
              Add order guide
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="flex-1 overflow-auto no-scrollbar">
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
            <form.AppField
              name="visibility"
              children={(field) => (
                <field.RadioField
                  options={[
                    {
                      value: "personal",
                      label: "Private",
                      description: "Only visible to me",
                    },
                    {
                      value: "shared",
                      label: "Shared",
                      description: "Visible to all team members",
                    },
                  ]}
                  label="Visibility"
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
                      // @ts-expect-error
                      selected={field.state.value}
                      setSelectedChange={(value) => {
                        const current = field.state.value || [];

                        const index = current.findIndex(
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
                            getItemValue={(item) => item.id}
                            className="divide-y"
                          >
                            {items?.map((item, index) => {
                              return (
                                <SortableItem
                                  key={index}
                                  value={item.id}
                                  className="flex flex-1 items-center gap-3 py-2 first:pt-0 last:pb-0 bg-background"
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
                                    <div className="flex gap-1 items-center">
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

          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
