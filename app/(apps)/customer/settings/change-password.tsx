"use client";

import z from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";

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

const ChangePasswordForm = () => {
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
        },
      );
    },
  });
  return (
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

      <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
  );
};

export default ChangePasswordForm;
