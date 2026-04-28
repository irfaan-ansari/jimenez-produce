"use client";

import z from "zod";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { phoneSchema } from "@/lib/form-schema/common";
import { AlertCircleIcon, Loader, X } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

const schema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().length(6, "OTP must be 6 digits"),
  step: z.number(),
  error: z.string(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
      code: "",
      step: 1,
      error: "Invalid phone number",
    },
    validators: {
      onChange: ({ formApi, value }) => {
        if (value.step === 1) {
          if (value.phoneNumber.length === 10) {
            formApi.handleSubmit();
          } else {
            return formApi.parseValuesWithSchema(schema);
          }
        }
      },
    },
    onSubmit: async ({ formApi, value }) => {
      const { phoneNumber } = value;
      const toastId = toast.loading("Logging in...");

      // send otp

      formApi.setFieldValue("step", 2);
      //   toast.success("Login successfull, redirecting...", { id: toastId });
      //   window.location.reload();
    },
  });

  const { error: loginError, step } = useStore(
    form.store,
    (state) => state.values,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex h-full flex-1 flex-col items-start justify-center gap-6 px-6 py-20 lg:px-16"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Enter phone number</h2>
        <p className="text-sm text-muted-foreground">
          Enter phone number to access your account.
        </p>
      </div>

      <FieldGroup>
        {step === 1 ? (
          <form.AppField
            name="phoneNumber"
            children={(field) => (
              <field.PhoneField
                label="Phone Number"
                placeholder="xxx-xxx-xxxx"
                className="*:data-[slot=input]:rounded-lg *:data-[slot=input]:bg-background"
              />
            )}
          />
        ) : (
          <form.Field
            name="code"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                  <InputOTP
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="w-full flex-1 bg-background *:h-11 *:w-auto! *:flex-1! *:data-[active=true]:ring-2 *:data-[active=true]:ring-border ">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />

                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        )}
        {/* alert */}
        {loginError && (
          <Alert
            variant="destructive"
            className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
          >
            <AlertCircleIcon />
            <AlertTitle>Phone number not found</AlertTitle>
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
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            )}
          />
        </Field>
      </FieldGroup>
      <Field className="mt-auto text-center">
        <Link
          href="/forgot-password"
          className="block text-sm font-medium text-muted-foreground underline hover:text-foreground"
        >
          Forgot Password?
        </Link>
      </Field>
    </form>
  );
}
