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
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { AlertCircleIcon, ArrowLeft, Loader, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { phoneSchema } from "@/lib/form-schema/common";
import { sendOtp, verifyOtp } from "@/server/auth";
import { useRouter } from "next/navigation";

const phone = z.object({
  phoneNumber: phoneSchema,
});

const schema = z.object({
  ...phone.shape,
  step: z.string(),
  code: z.string().min(6, "Enter valid otp"),
  error: z.string(),
  seconds: z.number(),
  canResend: z.boolean(),
});

export function OTPLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
      step: "send",
      code: "",
      error: "",
      seconds: 60,
      canResend: false,
    },
    validators: {
      onChange: ({ formApi, value }) => {
        if (value.step === "send") {
          return formApi.parseValuesWithSchema(phone as typeof schema);
        }
        if (value.step === "verify") {
          return formApi.parseValuesWithSchema(schema);
        }
      },
    },
    onSubmit: async ({ formApi, value }) => {
      const { step, phoneNumber, code } = value;

      // send otp
      if (step == "send") {
        await handleSendOtp();
      }

      // verify otp
      if (step === "verify") {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await verifyOtp({
          phoneNumber,
          code,
        });

        if (success) {
          // clear error
          form.setFieldValue("error", "");

          toast.success("Login successfull, redirecting...", { id: toastId });
          window.location.reload();
        } else {
          toast.error(error?.message, {
            id: toastId,
          });
          form.setFieldValue("error", error?.message);
        }
      }
    },
  });

  const step = useStore(form.store, (state) => state.values.step);
  const error = useStore(form.store, (state) => state.values.error);

  const canResend = useStore(form.store, (state) => state.values.canResend);
  const seconds = useStore(form.store, (state) => state.values.seconds);

  /**
   * @description handle send otp
   */
  const handleSendOtp = async () => {
    const phoneNumber = form.state.values.phoneNumber;
    const toastId = toast.loading("Please wait...");

    const { success, error } = await sendOtp({
      phoneNumber,
    });

    if (success) {
      // clear error
      form.setFieldValue("error", "");

      // go to next step
      form.setFieldValue("step", "verify");
      form.setFieldValue("canResend", false);
      toast.success("OTP sent successfully!", {
        id: toastId,
      });
    } else {
      toast.error(error?.message, {
        id: toastId,
      });
      form.setFieldValue("error", error?.message);
    }
  };

  React.useEffect(() => {
    if (seconds === 0) {
      form.setFieldValue("canResend", true);
      return;
    }
    const timer = setTimeout(() => {
      form.setFieldValue("seconds", seconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex h-full flex-1 flex-col items-start justify-start gap-6 px-6 py-20 lg:px-16"
    >
      {step === "send" && (
        <FieldGroup>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Login with Phone Number</h2>
            <p className="text-sm text-muted-foreground">
              Enter your phone number and we’ll send you a secure one-time
              passcode.
            </p>
          </div>
          <form.AppField
            name="phoneNumber"
            children={(field) => {
              return (
                <field.PhoneField
                  label="Phone Number"
                  placeholder="(xxx)-yyy-zzzz"
                  className="*:data-[slot=input]:rounded-xl *:data-[slot=input]:bg-background"
                />
              );
            }}
          />
        </FieldGroup>
      )}
      {step === "verify" && (
        <FieldGroup>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Verify phone number</h2>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Enter the 6-digit one-time passcode sent to </span>
              <span> {form.state.values.phoneNumber}.</span>
              <Button
                size="sm"
                variant="link"
                className="h-4 px-0"
                onClick={() => form.setFieldValue("step", "send")}
                type="button"
              >
                Change
              </Button>
            </div>
          </div>

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
          <div className="flex items-center justify-start text-sm">
            <span className="text-muted-foreground"> Didn't receive OTP?</span>
            <Button
              variant="link"
              size="sm"
              type="button"
              disabled={!canResend}
              onClick={handleSendOtp}
            >
              Resend
            </Button>
            {!canResend && <span>in {seconds}s</span>}
          </div>
        </FieldGroup>
      )}
      {/* alert */}
      {error && (
        <Alert
          variant="destructive"
          className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
        >
          <AlertCircleIcon />
          <AlertTitle>{error}</AlertTitle>

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
          selector={({ isSubmitting, canSubmit, values }) => ({
            isSubmitting,
            canSubmit,
            step: values.step,
          })}
          children={({ isSubmitting, canSubmit, step }) => (
            <Button
              type="submit"
              size="xl"
              className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? (
                <Loader className="animate-spin" />
              ) : step === "send" ? (
                "Generate OTP"
              ) : (
                "Verify OTP"
              )}
            </Button>
          )}
        />
      </Field>

      <div className="flex w-full flex-row items-center justify-center gap-4">
        <div className="flex-[1_1_0] border-b "></div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          OR
        </span>
        <span className="flex-[1_1_0] border-b"></span>
      </div>

      <Field className="text-center">
        <Button type="button" size="xl" className="rounded-xl" asChild>
          <Link href="/signin">Login with password</Link>
        </Button>
      </Field>
    </form>
  );
}
