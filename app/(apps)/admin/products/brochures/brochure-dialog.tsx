"use client";
import React from "react";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ProductSelectorAdmin } from "@/components/admin/product-selector-admin";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, ImageOff, Loader, Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";
import z from "zod";
import { createBrochure, updateBrochure } from "@/server/brochure";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().min(1, "Enter name"),
  effectiveTo: z.string().min(1, "Enter effective to date"),
  products: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      identifier: z.string(),
      basePrice: z.string(),
      image: z.string().optional(),
    }),
  ),
});

const BrochureDialog = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: z.infer<typeof schema>;
}) => {
  const [open, setOpen] = React.useState(false);
  const {
    id,
    name = "",
    effectiveTo = "",
    products = [],
  } = defaultValues || {};

  const queryClient = useQueryClient();

  const form = useAppForm({
    validators: {
      onChange: schema,
    },
    defaultValues: {
      name: name,
      effectiveTo: effectiveTo,
      products: products as Record<string, any>[],
    },
    onSubmit: async ({ value }) => {
      const productIds = value.products.map((p) => p.id);
      const toastId = toast.loading("Please wait...");
      if (id) {
        const { success, error } = await updateBrochure(id, {
          name: value.name,
          effectiveTo: value.effectiveTo,
          productIds,
        });

        if (success) {
          toast.success("Brochure updated successfully", { id: toastId });
          setOpen(false);
        } else {
          toast.error(error.message, { id: toastId });
        }
      } else {
        const { success, error } = await createBrochure({
          name: value.name,
          effectiveTo: value.effectiveTo,
          productIds,
        });

        if (success) {
          toast.success("Brochure created successfully", { id: toastId });
          setOpen(false);
        } else {
          toast.error(error.message, { id: toastId });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["brochures"] });
    },
  });

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-xl font-bold">
            New brochure
          </AppDialogTitle>
        </AppDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full max-h-[min(520px,90svh)] flex-col gap-6 overflow-auto"
        >
          <FieldGroup className="no-scrollbar flex-1 overflow-y-auto">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="name" />
              )}
            />
            <form.AppField
              name="effectiveTo"
              children={(field) => (
                <field.DateField
                  label="Effective to"
                  placeholder="YYYY-MM-DD"
                />
              )}
            />

            <form.Field
              name="products"
              mode="array"
              children={(field) => {
                const products = field.state.value;

                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>Featured products</FieldLabel>
                      <ProductSelectorAdmin
                        selected={field.state.value.map((item) => item.id)}
                        setSelectedChange={(value) => {
                          const index = field.state.value.findIndex(
                            (s) => s.id === value.id,
                          );
                          if (index >= 0) {
                            field.removeValue(index);
                          } else {
                            // @ts-ignore
                            field.pushValue({ ...value, id: value.id });
                          }
                        }}
                      >
                        <Button variant="outline" size="xl" className="w-full">
                          <Plus /> Select products...
                          <ChevronsUpDown className="ml-auto" />
                        </Button>
                      </ProductSelectorAdmin>
                    </div>
                    {products.length > 0 ? (
                      <div className="space-y-1">
                        {products?.map((item, i) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 p-2 border rounded-xl bg-secondary/20"
                          >
                            <div className="flex items-start flex-1 gap-3">
                              <div className="shrink-0">
                                <Avatar className="size-9 rounded-lg ring-2 ring-ring ring-offset-1 **:rounded-lg after:hidden">
                                  <AvatarImage src={item?.image as string} />
                                  <AvatarFallback>
                                    <ImageOff className="size-4" />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium leading-tight whitespace-normal">
                                  {item.title}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className="uppercase border rounded-xl border-border"
                                >
                                  {item.identifier}
                                </Badge>
                              </div>
                            </div>
                            <div className="self-center font-medium text-right w-28 text-muted-foreground">
                              {formatUSD(item.basePrice)}
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
                  </div>
                );
              }}
            />
          </FieldGroup>
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <AppDialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </AppDialogClose>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
};

export default BrochureDialog;
