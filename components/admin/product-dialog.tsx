"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import { upload } from "@vercel/blob/client";
import { capitalizeWords } from "@/lib/utils";
import { useAppForm } from "@/hooks/form-context";
import { AnyFieldApi } from "@tanstack/react-form";
import { useCategories } from "@/hooks/use-product";
import { type AdminProductType } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  Check,
  ImageUp,
  Loader,
  Trash2,
  X,
} from "lucide-react";
import { createProduct, deleteProduct, updateProduct } from "@/server/product";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteBlob } from "@/server/blob";

const schema = z.object({
  identifier: z.string(),
  title: z.string().min(1, "Enter title"),
  description: z.string(),
  isTaxable: z.boolean(),
  categories: z.array(z.string()),
  status: z.string().min(1, "Select status"),
  image: z.string().or(z.any()),
  basePrice: z.string().min(1, "Enter base price"),
  type: z.string(),
  pack: z.string(),
  unit: z.string(),
});

export const ProductDialog = ({
  children,
  product,
}: {
  product?: AdminProductType;
  children: React.ReactNode;
}) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      title: product?.title || "",
      identifier: product?.identifier || "",
      description: product?.description || "",
      isTaxable: product?.isTaxable ?? true,
      categories: product?.categories || ([] as any),
      status: product?.status ? capitalizeWords(product.status) : "Active",
      type: product?.type || "",
      pack: product?.pack || "",
      unit: product?.unit || "",
      basePrice: product?.basePrice || "",
      image: product?.image || "",
    },
    validators: {
      onSubmit: schema,
    },

    onSubmit: async ({ value }) => {
      const { ...rest } = value;
      const status = rest.status.toLowerCase();

      if (product && product.id) {
        const { success, error } = await updateProduct(product.id, {
          ...rest,
          status,
        });
        if (success) {
          toast.success("Product updated successfully.");
          setOpen(false);
          form.reset();
        } else {
          toast.error(error.message);
        }
      } else {
        const { success, error } = await createProduct({ ...rest, status });
        if (success) {
          toast.success("Product added successfully.");
          setOpen(false);
          form.reset();
        } else {
          toast.error(error.message);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  /**
   * Handles the deletion of a product image.
   */
  const handleDeleteImage = async (url: string) => {
    form.setFieldValue("image", "");
    await deleteBlob(url);
  };

  /**
   * Handles the change of a product image.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please upload a valid image.");
      return;
    }
    const toastId = toast.loading("Please wait...");

    const url = URL.createObjectURL(file);
    form.setFieldValue("image", url);

    const blob = await upload(`products/${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    if (blob.url) {
      toast.success("Image uploaded successfully.", { id: toastId });
      form.setFieldValue("image", blob.url);
    } else {
      toast.error("Failed to upload the upload the image.", { id: toastId });
    }
  };

  /**
   * Handles the deletion of a product.
   */
  const handleDeleteProduct = () => {
    if (!product?.id) return;
    confirm.delete({
      title: "Delete Product",
      description:
        "This action will permanently delete the selected product and this cannot be undone.",
      actionLabel: "Yes, Delete",
      action: async () => {
        const { success, error } = await deleteProduct(product.id);
        if (success) {
          toast.success("Product has been deleted!");
          setOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
        } else {
          toast.error(error.message);
        }
      },
      cancelLabel: "Cancel",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-2xl font-bold">
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details."
              : "Add a new product with all required details"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col gap-6"
        >
          <div className="no-scrollbar flex-1 overflow-y-auto px-6">
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
              <form.Field
                name="image"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field aria-invalid={isInvalid} className="lg:col-span-2">
                      {field.state.value ? (
                        <div className="relative z-1 flex h-28 w-full justify-center rounded-xl border border-dashed bg-secondary p-2">
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
                            onClick={() => handleDeleteImage(field.state.value)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ) : (
                        <FieldLabel
                          htmlFor={field.name}
                          className="h-28 flex-col hover:*:data-[slot=field-legend]:underline pt-6 justify-center rounded-xl border-2 border-dashed bg-secondary/40 transition"
                        >
                          <ImageUp className="size-6 text-muted-foreground" />
                          <FieldLegend className="text-muted-foreground text-sm! ">
                            Click to upload image
                          </FieldLegend>

                          <Input
                            className="sr-only"
                            type="file"
                            accept="image/*"
                            id={field.name}
                            onChange={handleFileChange}
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
                    className="**:data-[slot=input]:rounded-xl lg:col-span-2"
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
              <form.AppField
                name="basePrice"
                children={(field) => (
                  <field.TextField
                    label="Price"
                    className="**:data-[slot=input]:rounded-xl lg:col-span-2"
                  />
                )}
              />
              <form.Field
                name="isTaxable"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="lg:col-span-2">
                      <Field
                        orientation="horizontal"
                        data-invalid={isInvalid}
                        className="items-start pt-0.5"
                      >
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                        />
                        <div className="flex flex-col gap-2 -mt-0.5">
                          <FieldLabel htmlFor={field.name}>
                            Is this product taxable?
                          </FieldLabel>
                          <FieldDescription>
                            Enable if tax should be applied on this product.
                          </FieldDescription>
                        </div>
                      </Field>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="categories"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field
                      aria-invalid={isInvalid}
                      className="gap-2 lg:col-span-2"
                    >
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
                                type="button"
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
                    <Field className="lg:col-span-2">
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

              <form.AppField
                name="pack"
                children={(field) => (
                  <field.TextField
                    label="Pack"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              <form.AppField
                name="unit"
                children={(field) => (
                  <field.TextField
                    label="Unit"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              {product?.id && (
                <Alert
                  variant="destructive"
                  className="lg:col-span-2 border-destructive bg-destructive/2"
                >
                  <AlertCircleIcon />
                  <AlertTitle>Delete product</AlertTitle>
                  <AlertDescription className="text-muted-foreground!">
                    This action cannot be undone. This will permanently delete
                    the product.
                  </AlertDescription>
                  <AlertAction>
                    <Button
                      size="sm"
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteProduct}
                    >
                      Delete
                    </Button>
                  </AlertAction>
                </Alert>
              )}
            </FieldGroup>
          </div>
          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end  sm:[&>*]:w-28">
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
