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
import { AlertCircleIcon, Eye, EyeOff, Loader, X } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import z from "zod";

import { useStore } from "@tanstack/react-form";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { useSignin } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

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
  const { mutate, isPending } = useSignin();
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
      mutate(value, {
        onError: (err) =>
          form.setFieldValue("error", err.message ?? "Login failed!"),
        onSuccess: () => {
          toast.success("Login successfull, redirecting...");
          router.replace("/admin/overview");
        },
      });
    },
  });

  const showPass = useStore(form.store, (state) => state.values.showPass);
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
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard.
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

            {/* alert */}
            {loginError && (
              <Alert
                variant="destructive"
                className="rounded-xl bg-destructive/5 border-destructive/5 has-data-[slot=alert-action]:pr-8"
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
                    className="rounded-xl"
                    disabled={isSubmitting || !canSubmit}
                  >
                    {isSubmitting || isPending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                )}
              />
            </Field>

            <Field className="text-center">
              <Link
                href="/admin/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
