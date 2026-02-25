"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { CardContent } from "@/components/ui/card";
import { AlertCircleIcon, Loader, X } from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";
import z from "zod";

import { useStore } from "@tanstack/react-form";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

const schema = z.object({
  email: z.email("Enter valid email"),
  error: z.string(),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      email: "",
      error: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: (process.env.NEXT_PUBLIC_SITE_URL =
            "/admin/reset-password"),
        },
        {
          onError: (error) => {
            form.setFieldValue(
              "error",
              error?.error?.message ?? "Something went wrong"
            );
          },
          onSuccess: () => {
            toast.success("Password Reset Email Sent!");
            router.replace("/admin/reset-password");
          },
        }
      );
    },
  });

  const loginError = useStore(form.store, (state) => state.values.error);

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

            {/* alert */}
            {loginError && (
              <Alert
                variant="destructive"
                className="rounded-xl bg-destructive/5 border-destructive/5 has-data-[slot=alert-action]:pr-8"
              >
                <AlertCircleIcon />
                <AlertDescription>{loginError}</AlertDescription>
                <AlertAction>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => form.setFieldValue("error", "")}
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
