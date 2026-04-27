"use client";

import z from "zod";
import { Loader } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";

import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

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
      await authClient.updateUser(
        { name: value.name },
        {
          onSuccess: () => {
            toast.success("User created successfully!");
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong!");
          },
        },
      );
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
      </FieldGroup>

      <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
              {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
            </Button>
          )}
        />
      </Field>
    </form>
  );
};
