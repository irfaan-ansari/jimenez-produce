"use client";

import z from "zod";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";
import { AlertCircleIcon, Loader, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

const schema = z.object({
  username: z.union(
    [
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),
      z.email("Enter valid email"),
    ],
    "Enter valid email or phone number",
  ),
  password: z.string().min(2, "Enter password"),
  error: z.string(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
      error: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const { username, password } = value;

      const toastId = toast.loading("Logging in...");

      let response;
      if (username.includes("@")) {
        response = await authClient.signIn.email({
          email: username,
          password,
        });
      } else {
        response = await authClient.signIn.phoneNumber({
          phoneNumber: username,
          password,
        });
      }

      if (response?.error) {
        toast.error(response?.error?.message, { id: toastId });
        form.setFieldValue(
          "error",
          response?.error?.message ?? "Login failed!",
        );
      } else {
        toast.success("Login successfull, redirecting...", { id: toastId });
        window.location.reload();
      }
    },
  });

  const loginError = useStore(form.store, (state) => state.values.error);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-20 lg:px-16"
    >
      <h2 className="font-heading text-3xl font-bold">Login with password</h2>
      <p className="mb-10 text-muted-foreground">
        Use your email address or phone number to access your account.
      </p>

      <FieldGroup>
        <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Email or phone"
              placeholder="email or phone"
              className="*:data-[slot=input]:rounded-xl *:data-[slot=input]:bg-background"
            />
          )}
        />

        <div className="space-y-3">
          <form.AppField
            name="password"
            children={(field) => (
              <field.PasswordField
                label="Password"
                placeholder="••••••"
                className="*:data-[slot=input-group]:bg-background"
              />
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground font-medium block hover:underline hover:text-foreground"
          >
            Forgot Password?
          </Link>
        </div>
        {/* alert */}
        {loginError && (
          <Alert
            variant="destructive"
            className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
          >
            <AlertCircleIcon />
            <AlertTitle>Login Failed!</AlertTitle>
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
                className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Login"}
              </Button>
            )}
          />
        </Field>

        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex-[1_1_0] border-b "></div>
          <span className="shrink-0">OR</span>
          <span className="flex-[1_1_0] border-b"></span>
        </div>

        <Field className="text-center">
          <Button type="button" size="xl" className="rounded-xl" asChild>
            <Link href="/otp-login">Login with OTP</Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
