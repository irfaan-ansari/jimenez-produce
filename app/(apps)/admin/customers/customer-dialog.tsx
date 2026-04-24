"use client";

import z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/lib/types";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceLevels } from "@/hooks/use-product";
import { phoneSchema } from "@/lib/form-schema/common";
import { addTeamWithUser } from "@/server/auth";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  managerName: z.string().min(1, "Manager Name is required"),
  phone: phoneSchema,
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  priceLevelId: z.string(),
  groupId: z.string(),
});

export const CustomerDialog = ({
  data,
  children,
}: {
  data?: Team;
  children: React.ReactNode;
}) => {
  const isEdit = !!data;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: levels } = usePriceLevels();

  const form = useAppForm({
    defaultValues: {
      name: data?.name || "",
      managerName: data?.managerName || "",
      phone: data?.phone || "",
      email: data?.email || "",
      password: "",
      priceLevelId: String(data?.priceLevelId || ""),
      groupId: "",
    },
    validators: {
      onSubmit: ({ formApi, value }) => {
        if (isEdit) value.password = "00000000";
        return formApi.parseValuesWithSchema(schema);
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      if (isEdit) {
        const { error } = await authClient.organization.updateTeam({
          teamId: data.id as string,
          data: { ...value, priceLevelId: Number(value.priceLevelId) },
        });

        if (error) {
          toast.error(error.message, {
            id: toastId,
          });
        } else {
          setOpen(false);
          form.reset();
          toast.success("Customer updated successfully", { id: toastId });
        }
      } else {
        const { error } = await addTeamWithUser({
          ...value,
          pricelevelId: value.priceLevelId!,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        } else {
          setOpen(false);
          form.reset();
          toast.success("Customer created successfully", { id: toastId });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col justify-start"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-2xl font-bold">
              {isEdit ? "Edit Customer" : "Create Customer"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details of the customer."
                : "Enter the details of the new customer."}
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar flex-1 overflow-auto px-6">
            <FieldGroup className="grid grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    placeholder="Acme"
                    label="Company Name"
                    className="col-span-2"
                  />
                )}
              />
              <form.AppField
                name="managerName"
                children={(field) => (
                  <field.TextField
                    label="Manager Name"
                    placeholder="John"
                    className="col-span-2"
                  />
                )}
              />

              <form.AppField
                name="phone"
                children={(field) => (
                  <field.PhoneField label="Phone" placeholder="xxxx-xxx-xxx" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" placeholder="name@email.com" />
                )}
              />

              <form.AppField
                name="password"
                children={(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="••••••"
                    className={isEdit ? "hidden" : "col-span-2"}
                  />
                )}
              />

              <form.Field
                name="groupId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Group</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className="h-11! rounded-xl!"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="item-aligned"
                          className="rounded-xl p-2"
                        >
                          <Skeleton className="h-11" />
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="priceLevelId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Price Level</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        {levels?.data?.length ? (
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            className="h-11! rounded-xl!"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        ) : (
                          <Skeleton className="h-11! w-full" />
                        )}
                        <SelectContent
                          position="item-aligned"
                          className="rounded-xl p-2"
                        >
                          {levels?.data?.map((level) => (
                            <SelectItem
                              key={level.id}
                              className="h-10 rounded-lg"
                              value={String(level.id)}
                            >
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>
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
