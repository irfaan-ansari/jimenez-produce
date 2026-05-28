"use client";

import z from "zod";
import { toast } from "sonner";

import { Team } from "@/lib/types";
import React, { useState } from "react";
import { Loader, User } from "lucide-react";
import { authClient } from "@/services/auth";
import { getInitialsAvatar } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { phoneSchema } from "@/lib/form-schema/common";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  managerName: z.string().min(1, "Manager Name is required"),
  phone: phoneSchema,
  email: z.email("Invalid email"),
});

export const CustomerDialog = ({
  data,
  children,
}: {
  data?: Team;
  children: React.ReactNode;
}) => {
  const isEdit = !!data;

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: data?.name || "",
      managerName: data?.managerName || "",
      phone: data?.phone || "",
      email: data?.email || "",
    },
    validators: {
      onSubmit: ({ formApi }) => {
        return formApi.parseValuesWithSchema(schema);
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");

      if (isEdit) {
        const { error } = await authClient.organization.updateTeam({
          teamId: data.id as string,
          data: {
            ...value,
          },
        });

        if (error) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          setOpen(false);
          form.reset();
          toast.success("Customer updated successfully", { id: toastId });
        }
      } else {
        const { error } = await authClient.organization.createTeam({
          ...value,
          logo: getInitialsAvatar(value.name),
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
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-visible rounded-2xl ring-ring/10 sm:max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <AppDialogHeader className="flex-row items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-4">
              <User />
            </span>
            <AppDialogTitle className="text-xl font-bold">
              {isEdit ? "Edit Customer" : "Create Customer"}
            </AppDialogTitle>
          </AppDialogHeader>

          <div className="flex-1 overflow-auto no-scrollbar">
            <FieldGroup className="grid">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField placeholder="Acme" label="Company Name" />
                )}
              />
              <form.AppField
                name="managerName"
                children={(field) => (
                  <field.TextField label="Manager Name" placeholder="John" />
                )}
              />

              <form.AppField
                name="phone"
                children={(field) => (
                  <field.PhoneField label="Phone" placeholder="xxx-xxx-xxxx" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" placeholder="name@email.com" />
                )}
              />
            </FieldGroup>
          </div>
          <Field className="flex flex-col-reverse sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
