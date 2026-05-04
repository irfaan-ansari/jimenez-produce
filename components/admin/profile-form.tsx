"use client";

import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Enter name"),
  phoneNumber: z.string().min(1, "Enter name"),
  email: z.string(),
});

export const ProfileForm = () => {
  const { data } = authClient.useSession();

  const form = useAppForm({
    defaultValues: {
      id: data?.user?.id || "",
      name: data?.user?.name || "",
      phoneNumber: data?.user?.phoneNumber || "",
      email: data?.user?.email || "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { name, phoneNumber } = value;
      const toastId = toast.loading("Please wait...");
      const { error } = await authClient.updateUser({ name, phoneNumber });
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success("Profile updated successfully!", { id: toastId });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Name"
              className="**:data-[slot=input]:rounded-xl"
            />
          )}
        />
        <form.AppField
          name="phoneNumber"
          children={(field) => (
            <field.PhoneField
              label="Phone Number"
              className="**:data-[slot=input]:rounded-xl"
              // @ts-expect-error
              disabled={true}
            />
          )}
        />
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  disabled={true}
                  className="rounded-xl"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <div className="flex *:w-full sm:*:w-32 items-center justify-end">
          <form.Subscribe
            selector={({ isSubmitting, canSubmit, isDirty }) => ({
              isSubmitting,
              canSubmit,
              isDirty,
            })}
            children={({ isSubmitting, canSubmit, isDirty }) => {
              return (
                <Button
                  type="submit"
                  className="w-28"
                  size="lg"
                  disabled={isSubmitting || !isDirty || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              );
            }}
          />
        </div>
      </FieldGroup>
    </form>
  );
};
