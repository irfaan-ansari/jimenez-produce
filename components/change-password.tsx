"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import z from "zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { Field, FieldGroup } from "./ui/field";
import { useAppForm } from "@/hooks/form-context";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(1, "New password required"),
    confirmPassword: z.string().min(1, "Confirm password required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.confirmPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: () => {
            toast.success("Password successfully!");
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong!");
          },
        }
      );
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl overflow-hidden sm:max-w-md">
        <DialogHeader className="flex flex-row gap-6 items-center pt-4 pb-6">
          <DialogTitle className="text-xl font-semibold">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="currentPassword"
              children={(field) => (
                <field.TextField
                  label="Current Password"
                  // @ts-ignore
                  type="password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="newPassword"
              children={(field) => (
                <field.TextField
                  label="New Password"
                  // @ts-ignore
                  type="password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <field.TextField
                  label="Confirm Password"
                  // @ts-ignore
                  type="password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
          </FieldGroup>

          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
