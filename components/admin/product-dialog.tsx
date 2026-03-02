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
import React from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { del } from "@vercel/blob";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { upload } from "@vercel/blob/client";
import { useAppForm } from "@/hooks/form-context";
import { AnyFieldApi } from "@tanstack/react-form";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/use-product";
import { Check, Loader, Trash2, X } from "lucide-react";

import { ProductSelectType } from "@/lib/db/schema";
import MultipleSelector from "@/components/multiple-select";

const schema = z.object({
  identifier: z.string(),
  title: z.string().min(1, "Enter title"),
  description: z.string().min(1, "Enter description"),
  categories: z.array(z.string()).min(1, "Select categories"),
  price: z.string().min(1, "Enter price"),
  offerPrice: z.string(),
  status: z.string().min(1, "Select status"),
  image: z.string(),
  imageObj: z.file().mime(["image/png", "image/jpeg"]).or(z.any()),
});

export const ProductDialog = ({
  trigger,
  product,
}: {
  product?: ProductSelectType;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: create, isPending: createPending } = useCreateProduct();
  const { mutate: update, isPending: updatePending } = useUpdateProduct();

  const form = useAppForm({
    defaultValues: {
      title: product?.title || "",
      identifier: product?.identifier || "",
      description: product?.description || "",
      categories: product?.categories || ([] as any),
      price: product?.price || "",
      offerPrice: product?.offerPrice || "",
      status: product?.status
        ? product.status.charAt(0).toUpperCase() + product.status.slice(1)
        : "",
      image: product?.image || "",
      imageObj: null as any,
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
        update(
          { id: product.id, ...rest, status },
          {
            onSuccess: () => {
              toast.success("Product has been saved!");
              setOpen(false);
            },
            onError: (err) => toast.error(err.message),
          }
        );
      } else {
        for (let i = 0; i < 50; i++) {
          create(
            { ...rest, status, title: rest.title + i },
            {
              onSuccess: () => {
                toast.success("Product has been saved!");
                setOpen(false);
                form.reset();
              },
              onError: (err) => toast.error(err.message),
            }
          );
        }
      }
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
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="no-scrollbar -mx-4 max-h-[min(440px,60vh)] -my-1 py-1  overflow-y-auto px-4">
            <FieldGroup>
              <form.Field
                name="image"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field aria-invalid={isInvalid}>
                      {field.state.value ? (
                        <div className="rounded-xl border-dashed border bg-sidebar h-28 justify-center relative z-1 w-full flex">
                          <Image
                            src={field.state.value}
                            width={112}
                            height={112}
                            alt="Product Image"
                            className="w-auto h-28"
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
                          className="rounded-xl border-dashed border bg-sidebar h-28 justify-center hover:ring-1 hover:border-solid hover:ring-ring/50 transition"
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
                                e.target.files?.[0]
                              );
                              const url = URL.createObjectURL(
                                e.target.files?.[0]!
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
              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextField
                    label="Title"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <form.AppField
                  name="price"
                  children={(field) => (
                    <field.TextField
                      label="Price"
                      className="**:data-[slot=input]:rounded-xl"
                    />
                  )}
                />
                <form.AppField
                  name="offerPrice"
                  children={(field) => (
                    <field.TextField
                      label="Offer Price"
                      className="**:data-[slot=input]:rounded-xl"
                    />
                  )}
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
                        <div className="flex gap-2 flex-wrap">
                          {(field.state.value as string[]).map((v, i) => (
                            <Badge
                              key={v}
                              variant="secondary"
                              className="rounded-xl h-7 text-sm pr-1"
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
            </FieldGroup>
          </div>
          <Field className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
                  disabled={
                    isSubmitting || !canSubmit || createPending || updatePending
                  }
                >
                  {isSubmitting || createPending || updatePending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Save"
                  )}
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
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { data } = useCategories();
  const filtered =
    data?.data?.filter((i) =>
      i?.toLowerCase().includes(value?.toLowerCase())
    ) ?? [];

  return (
    <div className="relative">
      <Input
        className="rounded-xl"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
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
        className={`absolute overflow-auto max-h-36 z-5 **:rounded-xl shadow-xl h-auto **:justify-between no-scrolllbar p-2 flex-col gap-0.5 top-[calc(100%+2px)] inset-x-0 border rounded-2xl bg-white ${
          open ? "flex" : "hidden"
        }`}
      >
        {filtered.map((cat) => (
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
        ))}
      </div>
    </div>
  );
};
