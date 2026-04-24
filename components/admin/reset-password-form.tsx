"use client";

import z from "zod";
import React from "react";
import Link from "next/link";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Loader } from "lucide-react";
import { useRouterStuff } from "@/hooks/use-router-stuff";

const schema = z
  .object({
    password: z.string().min(2, "Enter new password"),
    confirmPassword: z.string().min(2, "Confirm new password"),
    showPass: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { searchParamsObj } = useRouterStuff();

  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      showPass: false,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (!searchParamsObj.token) {
        router.replace("/forgot-password");
      }

      await authClient.resetPassword(
        {
          newPassword: value.confirmPassword,
          token: searchParamsObj.token,
        },
        {
          onError: (error) => {
            toast.error(error?.error?.message);
          },
          onSuccess: () => {
            toast.success("Password reset successfully");
            router.replace("/signin");
          },
        },
      );
    },
  });

  const showPass = useStore(form.store, (state) => state.values.showPass);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-20 lg:max-w-xl lg:px-16"
    >
      <h2 className="font-heading text-3xl font-bold">Create Password</h2>
      <p className="mb-10 text-muted-foreground">
        Enter your new password below. Make sure it’s strong and secure.
      </p>
      <FieldGroup>
        <form.AppField
          name="password"
          children={(field) => (
            <field.PasswordField
              label="New Password"
              placeholder="••••••"
              className="*:data-[slot=input-group]:bg-background"
            />
          )}
        />
        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.PasswordField
              label="Confirm Password"
              placeholder="••••••"
              className="*:data-[slot=input-group]:bg-background"
            />
          )}
        />

        <Field>
          <form.Subscribe
            selector={({ isSubmitting, canSubmit }) => ({
              isSubmitting,
              canSubmit,
            })}
            children={({ isSubmitting, canSubmit }) => (
              <Button
                type="submit"
                size="xl"
                className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Change Password"
                )}
              </Button>
            )}
          />
        </Field>

        <Field className="text-center">
          <Link
            href="/signin"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Back to signin
          </Link>
        </Field>
      </FieldGroup>
    </form>
  );
}
