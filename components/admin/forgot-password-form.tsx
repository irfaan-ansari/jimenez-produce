"use client";

import z from "zod";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import {
  AlertCircleIcon,
  CheckCircle,
  CircleCheck,
  Loader,
  X,
} from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

const schema = z.object({
  username: z.union(
    [
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),
      z.email("Enter valid email"),
    ],
    "Enter valid email or phone number",
  ),
  error: z.string(),
  success: z.boolean(),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      error: "",
      success: true,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      form.setFieldValue("error", "");
      form.setFieldValue("success", false);
      await authClient.requestPasswordReset(
        {
          email: value.username,
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/reset-password",
        },
        {
          onError: (error) => {
            form.setFieldValue(
              "error",
              error?.error?.message ?? "Something went wrong",
            );
          },
          onSuccess: () => {
            form.setFieldValue("success", true);
            toast.success("Password reset email sent!");
          },
        },
      );
    },
  });

  const error = useStore(form.store, (state) => state.values.error);
  const success = useStore(form.store, (state) => state.values.success);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col w-full items-start justify-center gap-4 px-6 py-20 lg:max-w-xl lg:px-16"
    >
      <h2 className="font-heading text-3xl font-bold">Forgot Password</h2>
      <p className="mb-10 text-muted-foreground">
        Enter your email or phone number to reset your password.
      </p>
      <FieldGroup>
        <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Email"
              placeholder="email or phone number"
              className="*:data-[slot=input]:rounded-lg"
            />
          )}
        />

        {/* success */}
        {success && (
          <Alert
            variant="default"
            className="rounded-xl border-green-500/5 bg-green-500/5 text-green-600 has-data-[slot=alert-action]:pr-8"
          >
            <CircleCheck />
            <AlertTitle>Check your email or phone</AlertTitle>
            <AlertDescription>
              If an account exists with the provided details, you will receive
              password reset instructions via email and phone.
            </AlertDescription>
          </Alert>
        )}
        {/* alert */}
        {error && (
          <Alert
            variant="destructive"
            className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
          >
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
            <AlertAction>
              <Button
                type="button"
                size="icon-xs"
                variant="outline"
                className="rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80"
                onClick={() => {
                  form.setFieldValue("error", "");
                }}
              >
                <X />
              </Button>
            </AlertAction>
          </Alert>
        )}

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
                  "Reset Password"
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
