"use client";

import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import React from "react";
import Link from "next/link";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { AlertCircleIcon, Eye, EyeOff, Loader, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

const schema = z.object({
  email: z.email("Enter valid email"),
  password: z.string().min(2, "Enter password"),
  showPass: z.boolean(),
  error: z.string(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      showPass: false,
      error: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      const toastId = toast.loading("Logging in...");

      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(error.message, { id: toastId });
        form.setFieldValue("error", error.message ?? "Login failed!");
      } else {
        toast.success("Login successfull, redirecting...", { id: toastId });
        window.location.reload();
      }
    },
  });

  const showPass = useStore(form.store, (state) => state.values.showPass);
  const loginError = useStore(form.store, (state) => state.values.error);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-20 lg:max-w-xl lg:px-16"
    >
      <h2 className="font-heading text-3xl font-bold">Welcome back</h2>
      <p className="mb-10">
        Use your email address or phone number to access your account.
      </p>

      <FieldGroup>
        <form.AppField
          name="email"
          children={(field) => (
            <field.TextField
              label="Email"
              placeholder="me@email.com"
              className="*:data-[slot=input]:rounded-xl *:data-[slot=input]:bg-background"
            />
          )}
        />

        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <InputGroup className="rounded-xl bg-background">
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    type={showPass ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      className="rounded-2xl"
                      onClick={() => form.setFieldValue("showPass", !showPass)}
                    >
                      {showPass ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

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
                className="rounded-xl bg-sidebar-accent"
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
          <Button type="button" size="xl" className="rounded-xl">
            Login with OTP
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
