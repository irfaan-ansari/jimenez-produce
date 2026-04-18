"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { del } from "@vercel/blob";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import { upload } from "@vercel/blob/client";
import { capitalizeWords } from "@/lib/utils";
import { useLocations } from "@/hooks/use-config";
import { useAppForm } from "@/hooks/form-context";
import { AnyFieldApi } from "@tanstack/react-form";
import { useCategories } from "@/hooks/use-product";
import { type AdminProductType } from "@/lib/types";
import { createProduct, updateProduct } from "@/server/product";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Check, Loader, Trash2, Warehouse, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  identifier: z.string(),
  title: z.string().min(1, "Enter title"),
  description: z.string(),
  categories: z.array(z.string()),
  status: z.string().min(1, "Select status"),
  image: z.string(),
  imageObj: z.file().mime(["image/png", "image/jpeg"]).or(z.any()),
  inventory: z
    .object({
      locationId: z.number(),
      name: z.string(),
      offerPrice: z.any(),
      price: z.string(),
      stock: z.string(),
    })
    .array(),
});

export const ProductDialog = ({
  trigger,
  product,
}: {
  product?: AdminProductType;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: locations } = useLocations();

  const form = useAppForm({
    defaultValues: {
      title: product?.title || "",
      identifier: product?.identifier || "",
      description: product?.description || "",
      categories: product?.categories || ([] as any),
      status: product?.status ? capitalizeWords(product.status) : "",
      image: product?.image || "",
      imageObj: null as any,
      inventory: product
        ? (product.inventory.map((inv) => ({
            ...inv,
            name: locations?.data?.find((loc) => loc.id === inv.locationId)
              ?.name,
          })) ?? [])
        : locations?.data?.map((loc) => ({
            locationId: loc.id,
            name: loc.name,
            price: "",
            offerPrice: "",
            stock: "",
          })),
    },
    validators: {
      onSubmit: schema,
    },

    onSubmit: async ({ value }) => {
      const { imageObj, ...rest } = value;
      const status = rest.status.toLowerCase();

      // if has new file upload it to blob
      if (imageObj instanceof File) {
        const blob = await upload(`products/${imageObj.name}`, imageObj, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        rest.image = blob.url;
      }

      if (product && product.id) {
        // @ts-expect-error
        const { data, success, error } = await updateProduct(product.id, {
          ...rest,
          status,
        });
        if (success) {
          toast.success("Product has been saved!");
          setOpen(false);
        } else {
          toast.error(error.message ?? "Failed to update product");
        }
      } else {
        // @ts-expect-error
        const { success, error } = await createProduct({ ...rest, status });
        if (success) {
          toast.success("Product has been saved!");

          setOpen(false);
          form.reset();
        } else {
          toast.error(error.message ?? "Failed to updatee product");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDeleteImage = () => {
    const url = form.getFieldValue("image");
    if (url?.includes("blob.vercel-storage")) del(url);

    form.setFieldValue("image", "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-xl font-semibold">
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col"
        >
          <div className="no-scrollbar flex-1 overflow-y-auto px-6">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <form.AppField
                    name="title"
                    children={(field) => (
                      <field.TextField
                        label="Title"
                        className="**:data-[slot=input]:rounded-xl"
                      />
                    )}
                  />

                  <form.AppField
                    name="identifier"
                    children={(field) => (
                      <field.TextField
                        label="Product Code"
                        className="**:data-[slot=input]:rounded-xl"
                      />
                    )}
                  />
                  <form.AppField
                    name="status"
                    children={(field) => (
                      <field.SelectField
                        label="Status"
                        className="**:data-[slot=select-trigger]:rounded-xl"
                        options={["Active", "Private", "Archived"]}
                      />
                    )}
                  />
                </div>
                <form.Field
                  name="image"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field aria-invalid={isInvalid}>
                        {field.state.value ? (
                          <div className="relative z-1 flex h-full w-full justify-center rounded-xl border border-dashed bg-sidebar p-2">
                            <Image
                              src={field.state.value}
                              width={112}
                              height={112}
                              alt="Product Image"
                              className="h-full w-auto"
                            />
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="outline"
                              className="absolute top-2 right-2 rounded-xl"
                              onClick={handleDeleteImage}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ) : (
                          <FieldLabel
                            htmlFor={field.name}
                            className="h-full justify-center rounded-xl border border-dashed bg-sidebar transition hover:border-solid hover:ring-1 hover:ring-ring/50"
                          >
                            <FieldLegend>Upload Image</FieldLegend>

                            <Input
                              className="sr-only"
                              type="file"
                              accept="image/*"
                              id={field.name}
                              onChange={(e) => {
                                form.setFieldValue(
                                  "imageObj",
                                  e.target.files?.[0],
                                );
                                const url = URL.createObjectURL(
                                  e.target.files?.[0]!,
                                );
                                form.setFieldValue("image", url);
                              }}
                            />
                          </FieldLabel>
                        )}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              <form.Field
                name="categories"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Categories</FieldLabel>
                      <CategorySelector field={field} />
                      {field.state.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(field.state.value as string[]).map((v, i) => (
                            <Badge
                              key={v}
                              variant="secondary"
                              className="h-7 rounded-xl pr-1 text-sm"
                            >
                              {v}
                              <Button
                                size="icon-xs"
                                variant="destructive"
                                className="size-5 rounded-xl"
                                onClick={() => field.removeValue(i)}
                              >
                                <X />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value!}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field name="inventory" mode="array">
                {(field) =>
                  Array.isArray(field?.state?.value) &&
                  field?.state?.value.map((subField, i) => {
                    return (
                      <div className="rounded-2xl border bg-muted p-4" key={i}>
                        <div className="mb-3 font-semibold">
                          Price at {subField.name}
                        </div>
                        <form.AppField
                          name={`inventory[${i}].price`}
                          children={(field) => (
                            <field.TextField
                              className="**:data-[slot=input]:rounded-xl"
                              description={`Set price this product at ${subField.name}`}
                            />
                          )}
                        />
                      </div>
                    );
                  })
                }
              </form.Field>
            </FieldGroup>
          </div>
          <Field className="mt-4 flex flex-col-reverse gap-4 px-6 pt-4 sm:flex-row sm:justify-end  sm:[&>*]:w-28">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

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
      </DialogContent>
    </Dialog>
  );
};

const CategorySelector = ({ field }: { field: AnyFieldApi }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { data, isPending } = useCategories();

  const filtered =
    data?.data?.filter((i) =>
      i?.toLowerCase().includes(value?.toLowerCase()),
    ) ?? [];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Input
        className="rounded-xl"
        onFocus={() => setOpen(true)}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            field.pushValue(value);
            setValue("");
          }
        }}
      />
      <div
        className={`absolute no-scrollbar overflow-auto max-h-36 z-5 **:rounded-xl shadow-xl h-auto **:justify-between no-scrolllbar p-2 flex-col gap-0.5 top-[calc(100%+2px)] inset-x-0 border rounded-2xl bg-white ${
          open ? "flex" : "hidden"
        }`}
      >
        {isPending ? (
          <Loader className="mx-auto size-4 animate-spin" />
        ) : filtered.length > 0 ? (
          filtered.map((cat) => (
            <Button
              key={cat}
              type="button"
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                const exists = field.state.value.includes(cat);

                if (!exists) field.pushValue(cat);
              }}
            >
              {cat}
              {field.state.value.includes(cat) && <Check />}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              const exists = field.state.value.includes(value);
              if (!exists) field.pushValue(value);
              setOpen(false);
              setValue("");
            }}
          >
            Create "{value}"
          </Button>
        )}
      </div>
    </div>
  );
};
