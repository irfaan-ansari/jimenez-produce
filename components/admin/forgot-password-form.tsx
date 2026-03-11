"use client";

import z from "zod";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config";
import { authClient } from "@/lib/auth/client";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { CardContent } from "@/components/ui/card";
import { AlertCircleIcon, Loader, X } from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Alert, AlertAction, AlertDescription } from "../ui/alert";

const schema = z.object({
  email: z.email("Enter valid email"),
  error: z.string(),
  success: z.boolean(),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      error: "",
      success: false,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      form.setFieldValue("error", "");
      form.setFieldValue("success", false);
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL + "/admin/reset-password",
        },
        {
          onError: (error) => {
            form.setFieldValue(
              "error",
              error?.error?.message ?? "Something went wrong"
            );
          },
          onSuccess: () => {
            form.setFieldValue("success", true);
            toast.success("Password reset email sent!");
          },
        }
      );
    },
  });

  const error = useStore(form.store, (state) => state.values.error);
  const success = useStore(form.store, (state) => state.values.success);

  return (
    <Card className={cn("rounded-2xl relative", className)} {...props}>
      <CardHeader>
        <Image
          src={SITE_CONFIG.logo}
          alt={SITE_CONFIG.name}
          width={200}
          height={40}
          className="max-w-14 mb-4 ring-2 ring-primary aspect-square object-contain rounded-full ring-offset-2"
        />
        <CardTitle className="text-2xl font-semibold">
          Forgot Password
        </CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  placeholder="me@email.com"
                  className="*:data-[slot=input]:rounded-xl"
                />
              )}
            />

            {/* success */}
            {success && (
              <Alert
                variant="default"
                className="rounded-xl bg-green-500/5 border-green-500/5 text-green-500 has-data-[slot=alert-action]:pr-8"
              >
                <AlertCircleIcon />
                <AlertDescription className="text-green-500">
                  Password reset instructions have been sent to your email. If
                  not received, please try again.
                </AlertDescription>
              </Alert>
            )}
            {/* alert */}
            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl bg-destructive/5 border-destructive/5 has-data-[slot=alert-action]:pr-8"
              >
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
                <AlertAction>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="rounded-xl"
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
                    className="rounded-xl"
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
                href="/admin/signin"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Back to signin
              </Link>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
