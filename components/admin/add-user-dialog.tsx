"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useAppForm, withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { useLocations } from "@/hooks/use-config";
import { Skeleton } from "../ui/skeleton";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().min(1, "Enter name"),
    email: z.email("Enter email"),
    phone: z.string().length(10, "Enter valid phone number"),
    password: z.string().min(8, "Minimum 8 characters required"),
    confirmPassword: z.string().min(8, "Minimum 8 characters required"),
    role: z.string().min(1, "Select role"),
    managerName: z.string(),
    locationId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.role.toLowerCase() === "customer") {
      if (!data.managerName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["managerName"],
          message: "Manager name is required",
        });
      }

      if (!data.locationId?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["locationId"],
          message: "Location is required",
        });
      }
    }
  });

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "User",
  locationId: "",
  managerName: "",
};

export const AddUserDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.admin.createUser(
        {
          ...value,
          role: value.role.toLowerCase() as any,
          data: {
            image: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
              value.name,
            )}`,
            locationId: value.locationId,
            managerName: value.managerName,
          },
        },
        {
          onSuccess: ({ data }) => {
            authClient.updateUser({
              image: `https://api.dicebear.com/9.x/identicon/svg?seed=${data.user.name}`,
            });
            toast.success("Account created successfully!");
            setOpen(false);
            router.refresh();
            form.reset();
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong");
          },
        },
      );
    },
  });
  const role = useStore(form.store, (state) => state.values.role).toLowerCase();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="grid grid-cols-2">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  className="col-span-2 **:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="phone"
              children={(field) => (
                <field.PhoneField
                  label="Phone"
                  className="col-span-2 **:data-[slot=input]:rounded-xl lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  className="col-span-2 **:data-[slot=input]:rounded-xl lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField
                  label="Role"
                  className="col-span-2 **:rounded-xl"
                  options={["User", "Admin", "Customer"]}
                />
              )}
            />

            {/* customer and user */}
            {role !== "admin" && (
              <LocationSelect
                form={form}
                className={
                  role === "customer"
                    ? "col-span-2 lg:col-span-1"
                    : "col-span-2"
                }
              />
            )}

            {/* customer */}
            {role === "customer" && (
              <>
                {role === "customer" && (
                  <form.AppField
                    name="managerName"
                    children={(field) => (
                      <field.TextField
                        label="Manager Name"
                        className="col-span-2 **:data-[slot=input]:rounded-xl lg:col-span-1"
                      />
                    )}
                  />
                )}
              </>
            )}
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label="Password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />

            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <field.TextField
                  label="Confirm Password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
          </FieldGroup>

          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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

const LocationSelect = withForm({
  defaultValues,
  props: {} as { className?: string },
  render: function Render({ form, className }) {
    const { data: locations, isPending } = useLocations();

    if (isPending)
      return (
        <div className={cn("space-y-2", className)}>
          <div className="text-sm font-medium">Location</div>
          <Skeleton className="h-11" />
        </div>
      );

    return (
      <form.AppField
        name="locationId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field className={cn("gap-2", className)}>
              <FieldLabel htmlFor={field.name}>Location</FieldLabel>
              <Select
                name={field.name}
                value={String(field.state.value)}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  className="h-11! rounded-xl aria-invalid:ring-0!"
                  aria-invalid={isInvalid}
                >
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations?.data?.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  },
});
