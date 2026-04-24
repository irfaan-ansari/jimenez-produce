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

import { useRouter } from "next/navigation";

import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { AlertCircleIcon, Eye, EyeOff, Loader, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

import { toast } from "sonner";

const schema = z
  .object({
    name: z.string().min(2, "Enter name"),
    email: z.email("Enter valid email"),
    password: z.string().min(2, "Enter password"),
    confirmPassword: z.string().min(2, "Enter password"),
    showPass: z.boolean(),
    error: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPass: false,
      error: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      // const { data, success, error } = await signUp(value);
      // if (success) {
      //   toast.success("Account created successfully!");
      //   router.push("/signin");
      // } else {
      //   form.setFieldValue(
      //     "error",
      //     error.message ?? "You are not authorized to create an account.",
      //   );
      //   toast.error(error.message);
      // }
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
      <h2 className="font-heading text-3xl font-bold">Create your account</h2>
      <p className="mb-10">
        Create an account to start placing orders and managing your deliveries.
      </p>

      <FieldGroup>
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Name"
              placeholder=""
              className="*:data-[slot=input]:rounded-xl"
            />
          )}
        />
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
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>

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

        {/* alert */}
        {loginError && (
          <Alert
            variant="destructive"
            className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
          >
            <AlertCircleIcon />
            <AlertTitle>Access denied.</AlertTitle>
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
                  "Register"
                )}
              </Button>
            )}
          />
        </Field>

        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex-[1_1_0] border-b "></div>
          <span className="shrink-0 bg-background">OR</span>
          <span className="flex-[1_1_0] border-b"></span>
        </div>

        <div className="flex flex-row items-center justify-center gap-2 ">
          Already have an account?
          <Link href="/signin" className="underline-offset-4 hover:underline">
            Signin.
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
