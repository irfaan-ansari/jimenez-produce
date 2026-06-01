"use client";
import z from "zod";
import React from "react";
import Image from "next/image";
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import { useAppForm } from "@/hooks/form-context";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { CustomersSelector } from "@/components/admin/customers-selector";
import { Button } from "@/components/ui/button";
import { ImageUp, Loader, Plus, Trash2, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { deleteBlob } from "@/server/blob";
import { upload } from "@vercel/blob/client";
import { createPromotion, updatePromotion } from "@/server/promotion";
import { useQueryClient } from "@tanstack/react-query";
import { ProductSelectorAdmin } from "@/components/admin/product-selector-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string(),
  description: z.string(),
  badge: z.string(),
  media: z.string(),
  target: z.string(),
  status: z.string(),
  placement: z.string(),
  teams: z.array(
    z.object({
      teamId: z.string(),
      name: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
  ),
  products: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      image: z.string(),
      identifier: z.string(),
      basePrice: z.string(),
    }),
  ),
});

type FormSchema = z.infer<typeof schema>;

const PromotionDialog = ({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: FormSchema & { id?: number };
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const {
    id,
    name = "",
    title = "",
    description = "",
    badge = "",
    status = "active",
    media = "",
    target = "all",
    placement = "new-order",
    teams = [],
    products = [],
  } = initialData || {};

  const form = useAppForm({
    validators: {
      onChange: schema,
    },
    defaultValues: {
      name,
      title,
      description,
      badge,
      media,
      target,
      status,
      teams,
      products,
      placement,
    },
    onSubmit: async ({ value }) => {
      const { teams, products, placement, ...rest } = value;

      const teamIds = teams.map((t) => t.teamId);
      const productIds = products.map((p) => p.id);

      const toastId = toast.loading("Please wait...");

      if (file && file instanceof File) {
        toast.loading("Uploading image...", { id: toastId });
        const blob = await upload(`products/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        if (blob.url) {
          toast.success("Image uploaded.", { id: toastId });
          rest.media = blob.url;
        } else {
          toast.error("Failed to upload the image.", {
            id: toastId,
          });
        }
      }

      toast.loading("Saving promotion...", { id: toastId });

      if (id) {
        const { success, error } = await updatePromotion(id, {
          ...rest,
          placement: [placement],
          teamIds,
          productIds,
        });
        if (!success) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Promotion saved successfully.", { id: toastId });
          setOpen(false);
          form.reset();
        }
      } else {
        const { success, error } = await createPromotion({
          ...rest,
          placement: [placement],
          teamIds,
          productIds,
        });
        if (!success) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Promotion saved successfully.", { id: toastId });
          setOpen(false);
          form.reset();
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });
    },
  });

  /**
   * Handles the deletion of a product image.
   */
  const handleDeleteImage = async (url: string) => {
    form.setFieldValue("media", "");
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
    form.setFieldValue("media", url);
  };

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 md:gap-6 max-h-[min(800px,90svh)] flex-1"
        >
          <AppDialogHeader className="flex-row items-center gap-3">
            <AppDialogTitle className="text-xl font-bold">
              Promotion
            </AppDialogTitle>
          </AppDialogHeader>
          <div className="flex-1 px-6 -mx-6 space-y-1 overflow-y-auto no-scrollbar">
            <FieldGroup>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    placeholder="Promotion name"
                    description="for internal use only"
                  />
                )}
              />
              <form.Field
                name="media"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field aria-invalid={isInvalid}>
                      {field.state.value ? (
                        <div className="relative flex justify-center w-full p-2 border border-dashed z-1 h-28 rounded-xl bg-secondary">
                          <Image
                            src={field.state.value}
                            width={112}
                            height={112}
                            alt="Promotion media"
                            className="w-auto h-full"
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
                name="status"
                children={(field) => (
                  <field.RadioField
                    label="Status"
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                  />
                )}
              />

              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextField label="Title" placeholder="product launch" />
                )}
              />
              <form.AppField
                name="description"
                children={(field) => (
                  <field.TextAreaField
                    label="Description"
                    placeholder="access our newest product"
                  />
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField
                  name="badge"
                  children={(field) => (
                    <field.TextField label="Badge" placeholder="Coming soon" />
                  )}
                />
                <form.Field
                  name="placement"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field orientation="vertical" data-invalid={isInvalid}>
                        <FieldLabel>Placement</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            aria-invalid={isInvalid}
                            className="w-full! h-11!"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value="sidebar">
                              Sidebar card
                            </SelectItem>
                            <SelectItem value="banner">
                              Dashborad Banner
                            </SelectItem>
                            <SelectItem value="new-order">
                              New order page
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
              </div>
              <form.Field
                name="products"
                mode="array"
                children={(field) => {
                  const items = field.state.value;
                  return (
                    <div className="space-y-4">
                      <ProductSelectorAdmin
                        selected={items.map((i) => i.id)}
                        setSelectedChange={(value) => {
                          console.log(items);
                          const index = field.state.value.findIndex(
                            (s) => s.id === value.id,
                          );
                          if (index >= 0) {
                            field.removeValue(index);
                          } else {
                            field.pushValue({ ...value, id: value.id });
                          }
                        }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          type="button"
                          className="justify-start w-full text-muted-foreground"
                        >
                          <Plus /> Select Products
                        </Button>
                      </ProductSelectorAdmin>
                      {items.length > 0 ? (
                        <div className="space-y-1">
                          {items?.map((item, i) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 p-2 border rounded-xl bg-secondary/20"
                            >
                              <div className="flex items-start flex-1 gap-3">
                                <div className="shrink-0">
                                  <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
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
              <form.AppField
                name="target"
                children={(field) => (
                  <field.RadioField
                    label="Visibility"
                    options={[
                      {
                        label: "All",
                        value: "all",
                        description: "Visible to all customers",
                      },
                      {
                        label: "Selected",
                        value: "selected",
                        description: "Visible to selected customers",
                      },
                    ]}
                  />
                )}
              />
              <form.Subscribe
                selector={(state) => state.values.target}
                children={(values) => {
                  if (values !== "selected") return null;
                  return (
                    <form.Field
                      name="teams"
                      mode="array"
                      children={(field) => {
                        const teams = field.state.value;
                        return (
                          <div className="space-y-4">
                            <CustomersSelector
                              selected={teams.map((t) => ({
                                id: t.teamId,
                              }))}
                              setSelectedChange={(value) => {
                                const index = field.state.value.findIndex(
                                  (s) => s.teamId === value.id,
                                );
                                if (index >= 0) {
                                  field.removeValue(index);
                                } else {
                                  field.pushValue({
                                    ...value,
                                    teamId: value.id,
                                  });
                                }
                              }}
                            >
                              <Button
                                variant="outline"
                                size="lg"
                                type="button"
                                className="justify-start w-full text-muted-foreground"
                              >
                                <Plus /> Select Accounts
                              </Button>
                            </CustomersSelector>
                            {teams.length > 0 ? (
                              <div className="space-y-1">
                                {teams?.map((team, i) => (
                                  <div
                                    key={team.teamId}
                                    className="flex items-center gap-2 p-3 border rounded-lg"
                                  >
                                    <div className="flex flex-col flex-1 gap-1">
                                      <span className="font-medium">
                                        {team.name}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {team.email} • {team.phone}
                                      </span>
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
                  );
                }}
              />
            </FieldGroup>
          </div>
          <Field className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting }) => (
                <Button
                  type="submit"
                  size="xl"
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit()}
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

export default PromotionDialog;
