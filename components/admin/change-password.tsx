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
      const toastId = await toast.loading("Please wait...");
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.confirmPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error?.message, {
          id: toastId,
        });
      } else {
        toast.success("Password updated successfully!", {
          id: toastId,
        });
      }
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
            <field.PasswordField
              label="Current Password"
              placeholder="••••••"
              className="**:data-[slot=input]:rounded-xl"
            />
          )}
        />
        <form.AppField
          name="newPassword"
          children={(field) => (
            <field.PasswordField
              label="New Password"
              placeholder="••••••"
              className="**:data-[slot=input]:rounded-xl"
            />
          )}
        />
        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.PasswordField
              label="Confirm Password"
              placeholder="••••••"
              className="**:data-[slot=input]:rounded-xl"
            />
          )}
        />

        <div className="flex *:w-full sm:*:w-32 items-center justify-end">
          <form.Subscribe
            selector={({ isSubmitting, canSubmit, isDirty }) => ({
              isSubmitting,
              canSubmit,
              isDirty,
            })}
            children={({ isSubmitting, canSubmit, isDirty }) => {
              return (
                <Button
                  type="submit"
                  className="w-28"
                  size="lg"
                  disabled={isSubmitting || !isDirty || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              );
            }}
          />
        </div>
      </FieldGroup>
    </form>
  );
};

export default ChangePasswordForm;
