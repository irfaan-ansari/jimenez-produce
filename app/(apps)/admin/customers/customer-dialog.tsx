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
import { Team } from "@/lib/types";
import { Loader, User, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { phoneSchema } from "@/lib/form-schema/common";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { getInitialsAvatar } from "@/lib/utils";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-visible rounded-2xl px-0 ring-ring/10 sm:max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex max-h-[min(700px,90svh)] flex-col justify-start gap-6"
        >
          <DialogHeader className="flex-row items-center gap-3 px-6">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-4">
              <User />
            </span>
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Edit Customer" : "Create Customer"}
            </DialogTitle>
          </DialogHeader>

          <div className="no-scrollbar flex-1 overflow-auto px-6">
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
          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
