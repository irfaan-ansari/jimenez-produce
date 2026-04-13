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
import { Eye, EyeOff, Loader } from "lucide-react";
import { useRouterStuff } from "@/hooks/use-router-stuff";

const schema = z
  .object({
    password: z.string().min(2, "Enter password"),
    confirmPassword: z.string().min(2, "Enter password"),
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
      <p className="mb-10">
        Enter your new password below. Make sure it’s strong and secure.
      </p>
      <FieldGroup>
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <InputGroup className="rounded-xl">
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

        <form.Field
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Re-enter Password</FieldLabel>
                <InputGroup className="rounded-xl">
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
