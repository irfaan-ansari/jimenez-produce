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
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { addOrderGuideItem } from "@/server/order-guide";
import { Field, FieldGroup } from "@/components/ui/field";
import { ChevronsUpDown, ImageOff, Loader } from "lucide-react";
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

          <FieldGroup className="px-6 no-scrollbar flex-1 overflow-auto">
            {/* selected product */}
            <form.Field
              name="item"
              children={(field) => (
                <div className="rounded-xl border bg-secondary/20 gap-3 p-2 flex items-center justify-center">
                  <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                    <AvatarImage src={field.state.value.image as string} />
                    <AvatarFallback>
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{field.state.value.title}</p>
                  </div>
                  <span className="text-primary font-medium">
                    {formatUSD(Number(field.state.value.finalPrice))}
                  </span>
                </div>
              )}
            />

            <form.Field
              name="orderGuide"
              children={(field) => (
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
                    className="w-full rounded-lg justify-start text-muted-foreground"
                  >
                    {field.state.value?.name || "Select existing"}

                    <ChevronsUpDown className="ml-auto text-muted-foreground" />
                  </Button>
                </OrderGuideSelector>
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
