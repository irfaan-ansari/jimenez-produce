"use client";

import { z } from "zod";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAppForm } from "@/hooks/form-context";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_TYPES } from "@/lib/constants/customer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createRequest } from "@/server/catalog-access";

export const CONTACT_SCHEMA = z.object({
  name: z.string().min(2, "Name is required"),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  message: z.string().trim().min(1, "Message is required"),
});

export const ContactForm = () => {
  const router = useRouter();
  const { success } = useConfirm();

  const form = useAppForm({
    defaultValues: {
      name: "",
      businessName: "",
      businessType: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      const res = await createRequest(value);

      if (!res.success) {
        toast.error(res.error.message);
        return;
      }

      success({
        title: "Application Submitted Successfully",
        description: `Your application has been successfully submitted and is now under review.
                If additional information is required, our team will contact you.`,
        actionLabel: "Back to home",
        action: () => router.push("/"),
      });
      form.reset();
    },
    validators: {
      onChange: CONTACT_SCHEMA,
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="name"
        children={(field) => {
          return <field.TextField label="Name" placeholder="Enter name" />;
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.AppField
          name="businessName"
          children={(field) => {
            return (
              <field.TextField
                label="Business Name"
                placeholder="Enter business name"
              />
            );
          }}
        />
        <form.AppField
          name="businessType"
          children={(field) => (
            <field.SelectField
              label="Business Type"
              placeholder="Select business type"
              options={BUSINESS_TYPES}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.AppField
          name="email"
          children={(field) => {
            return <field.TextField label="Email" placeholder="Enter email" />;
          }}
        />
        <form.AppField
          name="phone"
          children={(field) => {
            return <field.TextField label="Phone" placeholder="Enter phone" />;
          }}
        />
      </div>
      <form.Field
        name="message"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="gap-2">
              <FieldLabel htmlFor={field.name}>Message</FieldLabel>

              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Type here...."
                rows={6}
                className="min-h-24 resize-none"
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Subscribe
        selector={({ isSubmitting, canSubmit }) => ({
          isSubmitting,
          canSubmit,
        })}
      >
        {({ isSubmitting, canSubmit }) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            size="xl"
            className="min-w-40 self-end"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
