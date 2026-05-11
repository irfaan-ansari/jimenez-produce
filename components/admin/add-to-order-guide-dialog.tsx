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
import { formatUSD } from "@/lib/utils";
import { File } from "@duo-icons/react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { Field, FieldGroup } from "@/components/ui/field";
import { ChevronsUpDown, ImageOff, Loader, X } from "lucide-react";
import { addOrderGuideItem, createOrderGuide } from "@/server/order-guide";
import { OrderGuideSelector } from "@/components/admin/order-guide-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const schema = z
  .object({
    item: z.object({
      id: z.string(),
      title: z.string(),
      image: z.string(),
      finalPrice: z.string(),
    }),
    name: z.string(),
    description: z.string(),
    orderGuide: z.object({
      id: z.string(),
      name: z.string(),
    }),
  })
  .refine(
    (data) => {
      return (
        data.name.trim().length > 0 || data.orderGuide.id.trim().length > 0
      );
    },
    {
      message: "Enter name or select existing order guide",
      path: ["name"],
    },
  );

type Form = z.infer<typeof schema>;

export const AddToOrderGuideDialog = ({
  children,
  item = {
    id: "",
    title: "",
    image: "",
    finalPrice: "",
  },
}: {
  children: React.ReactNode;
  item: Form["item"];
}) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      item,
      name: "",
      description: "",
      orderGuide: {
        id: "",
        name: "",
      },
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { item, orderGuide } = value;

      // if selected existing order guide
      if (orderGuide.id) {
        const { error, success } = await addOrderGuideItem({
          orderGuideId: Number(orderGuide.id),
          productId: Number(item.id),
        });

        if (success) {
          toast.success("Item added successfully", { id: toastId });

          queryClient.invalidateQueries({
            queryKey: ["customer-products", "customer-order-guides"],
          });

          setOpen(false);
        } else {
          toast.error(error.message, { id: toastId });
        }
      } else {
        // create new order guide
        const { error, success } = await createOrderGuide({
          name: value.name,
          description: value.description,
          productIds: [Number(item.id)],
        });

        if (success) {
          toast.success("Order guide created successfully", { id: toastId });

          queryClient.invalidateQueries({
            queryKey: ["customer-order-guides"],
          });

          setOpen(false);
        } else {
          toast.error(error.message, { id: toastId });
        }
      }
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
              Add to order guide
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="no-scrollbar flex-1 overflow-auto px-6">
            {/* selected product */}
            <form.Field
              name="item"
              children={(field) => (
                <div className="flex items-center justify-center gap-3 rounded-xl border bg-secondary/20 p-2">
                  <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                    <AvatarImage src={field.state.value.image as string} />
                    <AvatarFallback>
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{field.state.value.title}</p>
                  </div>
                  <span className="font-medium text-primary">
                    {formatUSD(Number(field.state.value.finalPrice))}
                  </span>
                </div>
              )}
            />

            <form.Field
              name="orderGuide"
              children={(field) => (
                <div className="relative">
                  <OrderGuideSelector
                    value={form.getFieldValue("orderGuide")?.id}
                    onValueChange={(value) =>
                      field.handleChange({
                        id: String(value.id),
                        name: value.name,
                      })
                    }
                  >
                    <Button
                      size="xl"
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-lg text-muted-foreground"
                    >
                      {field.state.value?.name || "Select existing"}

                      <ChevronsUpDown className="ml-auto text-muted-foreground" />
                    </Button>
                  </OrderGuideSelector>

                  <Tooltip content="Clear">
                    <Button
                      type="button"
                      size="icon-xs"
                      className={`absolute top-1/2 right-8 -translate-y-1/2 [&>svg]:size-4! ${field.state.value.id ? "" : "hidden"}`}
                      variant="ghost"
                      onClick={() => {
                        field.handleChange({
                          id: "",
                          name: "",
                        });
                      }}
                    >
                      <X />
                    </Button>
                  </Tooltip>
                </div>
              )}
            />

            <div className="flex flex-row items-center justify-center gap-4">
              <div className="flex-[1_1_0] border-b "></div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                CREATE NEW
              </span>
              <span className="flex-[1_1_0] border-b"></span>
            </div>

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
