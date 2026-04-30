"use client";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import React, { useState } from "react";

import { authClient } from "@/lib/auth/client";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "../ui/field";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { getInitialsAvatar } from "@/lib/utils";
import { phoneSchema } from "@/lib/form-schema/common";
import { Warehouse } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  phone: phoneSchema,
  email: z.email("Invalid email"),
});

export const WarehouseDialog = ({
  data,
  children,
}: {
  data?: Warehouse;
  children: React.ReactNode;
}) => {
  const isEdit = !!data;
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: data?.name || "",
      street: data?.metadata?.street || "",
      city: data?.metadata?.city || "",
      state: data?.metadata?.state || "",
      zip: data?.metadata?.zip || "",
      phone: data?.phone || "",
      email: data?.email || "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { name, phone, email, ...metadata } = value;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const toastId = toast.loading("Please wait...");
      if (isEdit) {
        const { error } = await authClient.organization.update({
          organizationId: data.id,
          data: {
            name,
            phone,
            email,
            metadata,
            logo: getInitialsAvatar(name),
          },
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Warehouse updated successfully", { id: toastId });
        setOpen(false);
        form.reset();
      } else {
        const { error } = await authClient.organization.create({
          name,
          slug,
          phone,
          email,
          logo: getInitialsAvatar(name),
          metadata,
          keepCurrentActiveOrganization: true,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Warehouse created successfully", { id: toastId });
          setOpen(false);
          form.reset();
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl px-0 ring-ring/10 sm:max-w-xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Warehouse" : "Create Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of the warehouse."
              : "Enter the details of the new warehouse."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="no-scrollbar grid max-h-[400px] grid-cols-2 overflow-auto px-6">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  placeholder="Warehouse"
                  className="col-span-2"
                />
              )}
            />
            <form.AppField
              name="phone"
              children={(field) => (
                <field.PhoneField
                  label="Phone"
                  placeholder="xxxx-xxx-xxx"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  placeholder="name@email.com"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="street"
              children={(field) => (
                <field.TextField
                  label="Address"
                  placeholder="123 Main St"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="city"
              children={(field) => (
                <field.TextField
                  label="City"
                  placeholder="New York"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="state"
              children={(field) => (
                <field.TextField
                  label="State"
                  placeholder="New York"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="zip"
              children={(field) => (
                <field.TextField
                  label="Zip"
                  placeholder="xxxx"
                  className="col-span-2 lg:col-span-1"
                />
              )}
            />
          </FieldGroup>
          <Field className="mt-10 flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </DialogClose>
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
