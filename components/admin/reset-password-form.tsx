"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
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
import { Eye, EyeOff, Loader, X } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import z from "zod";

import { useStore } from "@tanstack/react-form";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
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
        router.replace("/admin/forgot-password");
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
            router.replace("/admin/signin");
          },
        }
      );
    },
  });

  const showPass = useStore(form.store, (state) => state.values.showPass);

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
        <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below. Make sure it’s strong and secure.
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
                          onClick={() =>
                            form.setFieldValue("showPass", !showPass)
                          }
                        >
                          {showPass ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                          onClick={() =>
                            form.setFieldValue("showPass", !showPass)
                          }
                        >
                          {showPass ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
