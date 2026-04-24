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
import { useRouter } from "next/navigation";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { AlertCircleIcon, Loader, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const schema = z.object({
  username: z.union(
    [
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),
      z.email("Enter valid email"),
    ],
    "Enter valid email or phone number",
  ),
  otp: z.string().min(6, "Enter valid otp"),
  error: z.string(),
});

export function OTPLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      otp: "",
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
  const loginError = useStore(form.store, (state) => state.values.error);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-20 lg:px-16"
    >
      <h2 className="font-heading text-3xl font-bold">Sign in with OTP</h2>
      <p className="mb-10">
        Enter your email or phone number and we’ll send you a secure one-time
        passcode.
      </p>
      <FieldGroup>
        <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Email"
              placeholder="email or phone number"
              className="*:data-[slot=input]:rounded-xl *:data-[slot=input]:bg-background"
            />
          )}
        />

        <form.Field
          name="otp"
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
                  <InputOTPGroup className="bg-background w-full flex-1 *:flex-1! *:h-11 *:w-auto! *:data-[active=true]:ring-border *:data-[active=true]:ring-2 ">
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
                className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Generate OTP"
                )}
              </Button>
            )}
          />
        </Field>
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex-[1_1_0] border-b "></div>
          <span className="shrink-0">OR</span>
          <span className="flex-[1_1_0] border-b"></span>
        </div>

        <Button asChild size="xl" className="rounded-xl w-full">
          <Link href="/signin">Login with password</Link>
        </Button>
      </FieldGroup>
    </form>
  );
}
