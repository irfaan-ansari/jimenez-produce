"use client";

import {
  Field,
  FieldContent,
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
import {
  X,
  Check,
  Loader,
  Trash2,
  ImageUp,
  AlertCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { deleteBlob } from "@/server/blob";
import { upload } from "@vercel/blob/client";
import { capitalizeWords } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { AnyFieldApi } from "@tanstack/react-form";
import { useCategories } from "@/hooks/use-product";
import { type AdminProductType } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, updateProduct } from "@/server/product";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { Switch } from "../ui/switch";

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
  unitSize: z.string(),
});

export const ProductDialog = ({
  children,
  product,
}: {
  product?: AdminProductType;
  children: React.ReactNode;
}) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

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
      unitSize: product?.unitSize || "",
      basePrice: product?.basePrice || "",
      image: product?.image || "",
    },
    validators: {
      onSubmit: schema,
    },

    onSubmit: async ({ value }) => {
      const { ...rest } = value;
      const status = rest.status.toLowerCase();
      const toastId = toast.loading("Please wait...");

      if (file && file instanceof File) {
        toast.loading("Uploading image...", { id: toastId });
        const blob = await upload(`products/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        if (blob.url) {
          toast.success("Image uploaded.", { id: toastId });
          rest.image = blob.url;
        } else {
          toast.error("Failed to upload the image.", {
            id: toastId,
          });
        }
      }

      toast.loading("Saving product...", { id: toastId });
      if (product && product.id) {
        const { success, error } = await updateProduct(product.id, {
          ...rest,
          status,
        });
        if (success) {
          toast.success("Product saved successfully.", { id: toastId });
          setOpen(false);
          form.reset();
        } else {
          toast.error(error.message);
        }
      } else {
        const { success, error } = await createProduct({ ...rest, status });
        if (success) {
          toast.success("Product saved successfully.", { id: toastId });
          setOpen(false);
          form.reset();
        } else {
          toast.error(error.message, { id: toastId });
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
      toast.error("Upload a valid image.");
      return;
    }
    setFile(file);
    const url = URL.createObjectURL(file);
    form.setFieldValue("image", url);
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
      <DialogContent className="px-0 rounded-2xl ring-ring/10 sm:max-w-2xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-xl font-bold">
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[max(70svh,560px)] flex-col gap-6"
        >
          <div className="flex-1 px-6 overflow-y-auto no-scrollbar">
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
              <form.Field
                name="image"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field aria-invalid={isInvalid} className="lg:col-span-2">
                      {field.state.value ? (
                        <div className="relative flex justify-center w-full p-2 border border-dashed z-1 h-28 rounded-lg bg-secondary">
                          <Image
                            src={field.state.value}
                            width={112}
                            height={112}
                            alt="Product Image"
                            className="w-auto h-full"
                          />
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="outline"
                            className="absolute top-2 right-2 rounded-lg"
                            onClick={() => handleDeleteImage(field.state.value)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ) : (
                        <FieldLabel
                          htmlFor={field.name}
                          className="h-28 flex-col hover:*:data-[slot=field-legend]:underline pt-6 justify-center rounded-lg border-2 border-dashed bg-secondary/40 transition"
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
                    className="**:data-[slot=input]:rounded-lg lg:col-span-2"
                  />
                )}
              />

              <form.AppField
                name="identifier"
                children={(field) => (
                  <field.TextField
                    label="Product Code"
                    className="**:data-[slot=input]:rounded-lg"
                  />
                )}
              />
              <form.AppField
                name="status"
                children={(field) => (
                  <field.SelectField
                    label="Status"
                    className="**:data-[slot=select-trigger]:rounded-lg"
                    options={["Active", "Private", "Archived"]}
                  />
                )}
              />
              <form.AppField
                name="basePrice"
                children={(field) => (
                  <field.TextField
                    label="Price"
                    className="**:data-[slot=input]:rounded-lg"
                    placeholder="e.g. 4.69"
                  />
                )}
              />
              <form.AppField
                name="pack"
                children={(field) => (
                  <field.TextField
                    label="Pack Count"
                    className="**:data-[slot=input]:rounded-lg"
                    placeholder="e.g. 6"
                  />
                )}
              />
              <form.AppField
                name="unit"
                children={(field) => (
                  <field.TextField
                    label="Unit"
                    className="**:data-[slot=input]:rounded-lg"
                    placeholder="e.g. LB"
                  />
                )}
              />

              <form.AppField
                name="unitSize"
                children={(field) => (
                  <field.TextField
                    label="Unit Size"
                    className="**:data-[slot=input]:rounded-lg"
                    placeholder="e.g. 12"
                  />
                )}
              />
              <form.Field
                name="isTaxable"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldLabel
                      htmlFor={field.name}
                      data-invalid={isInvalid}
                      className="lg:col-span-2 rounded-xl!"
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>
                            Is this product taxable?
                          </FieldLabel>
                          <FieldDescription>
                            Enable if tax should be applied on this product.
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Switch
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                          aria-invalid={isInvalid}
                        />
                      </Field>
                    </FieldLabel>
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
                              className="pr-1 text-sm h-7 rounded-lg"
                            >
                              {v}
                              <Button
                                size="icon-xs"
                                type="button"
                                variant="destructive"
                                className="size-5 rounded-lg"
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
                        className="resize-none min-h-24 rounded-lg"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
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
              className="rounded-lg"
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
        className="rounded-lg"
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
        className={`absolute no-scrollbar overflow-auto max-h-36 z-5 **:rounded-lg shadow-xl h-auto **:justify-between no-scrolllbar p-2 flex-col gap-0.5 top-[calc(100%+2px)] inset-x-0 border rounded-2xl bg-white ${
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
