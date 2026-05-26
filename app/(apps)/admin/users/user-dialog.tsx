"use client";

import z from "zod";
import React from "react";
import { toast } from "sonner";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import { useState } from "react";
import { capitalizeWords } from "@/lib/utils";
import { Loader, UserLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Role, UserWithMember } from "@/lib/types";
import { signupWithOrganization } from "@/server/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Field, FieldGroup } from "@/components/ui/field";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  email: z.email("Enter email"),
  phone: z.string().length(10, "Enter valid phone number"),
  role: z.string().min(1, "Select role"),
  accountType: z.string(),
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

interface CallBackAgrs {
  id: string;
  name: string;
  phoneNumber: string | null | undefined;
  email: string;
}
export const UserDialog = ({
  data,
  children,
  callback,
}: {
  children: React.ReactNode;
  data: UserWithMember | { accountType: string };
  callback?: (arg: CallBackAgrs) => void;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { id, name, phoneNumber, email, accountType, member } =
    data as UserWithMember;

  const form = useAppForm({
    defaultValues: {
      name: name ?? "",
      email: email ?? "",
      phone: phoneNumber ?? "",
      role: capitalizeWords(member?.role ?? "Member"),
      accountType: accountType ?? "admin",
      teams: [] as { id: string; name: string }[],
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      if (id) {
        toast.error("Editing user is disabled");
        return;
      }
      const role = value.role.toLowerCase() as Role;
      const toastId = toast.loading("Please wait...");

      const { error, data: createdUser } = await signupWithOrganization({
        ...value,
        role,
        phoneNumber: value.phone,
      });

      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        setOpen(false);
        callback?.(createdUser);
        form.reset();
        toast.success("User account created.", { id: toastId });
      }

      queryClient.invalidateQueries({
        queryKey: ["members", "users", "team-members"],
      });
    },
  });

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full max-h-[min(700px,90svh)] flex-col gap-6 overflow-auto"
        >
          <AppDialogHeader className="flex-row items-center gap-3 data-[slot=drawer-header]:hidden">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-4">
              <UserLock />
            </span>
            <AppDialogTitle className="text-xl font-bold">
              Add user
            </AppDialogTitle>
          </AppDialogHeader>

          <FieldGroup className="no-scrollbar grid flex-1 grid-cols-2 overflow-y-auto">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  placeholder="John"
                  className="col-span-2 **:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="phone"
              children={(field) => (
                <field.PhoneField
                  label="Phone"
                  placeholder="xxx-xxx-xxxx"
                  className="col-span-2 **:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  placeholder="name@email.com"
                  className="col-span-2 **:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField
                  label="Role"
                  className="col-span-2 **:rounded-xl"
                  options={["Member", "Sales", "Manager", "Customer"]}
                />
              )}
            />
          </FieldGroup>

          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
