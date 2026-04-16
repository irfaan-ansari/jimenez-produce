"use client";

import z from "zod";
import { toast } from "sonner";
import {
  defaultValues,
  DELIVERY_DAYS,
  DELIVERY_TIME,
} from "@/lib/constants/customer";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useAppForm } from "@/hooks/form-context";
import { createCustomer } from "@/server/customer";
import { fileSchema } from "@/lib/form-schema/customer-schema";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyEmail: z.email("Invalid email"),
  officerFirst: z.string().min(1, "Officer first name is required"),
  officerLast: z.string().min(1, "Officer last name is required"),
  officerEmail: z.email("Invalid email"),
  orderingName: z.string().min(1, "Ordering contact name is required"),
  orderingPhone: z.string().min(1, "Ordering contact phone is required"),
  deliverySchedule: z.array(
    z.object({
      day: z.string().min(1, "Day is required"),
      window: z.string().min(1, "Window is required"),
      receivingName: z.string().min(1, "Receiving contact name is required"),
      receivingPhone: z.string().min(1, "Receiving contact phone is required"),
      instructions: z.string(),
    }),
  ),
  certificate: fileSchema,
  status: z.string(),
});

export const CustomerDataForm = ({ name }: { name: string }) => {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      companyName: name ?? "",
      companyPhone: "",
      companyEmail: "",
      officerFirst: "",
      officerLast: "",
      officerEmail: "",
      orderingName: "",
      orderingPhone: "",
      deliverySchedule: [
        {
          day: "",
          window: "",
          receivingName: "",
          receivingPhone: "",
          instructions: "",
        },
      ],
      certificate: null as any,
      status: "submitted",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (!name) {
        toast("Invalid request.");
        return;
      }

      const blob = await upload(
        `customer/${value.certificate.name}`,
        value.certificate,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
        },
      );

      // @ts-ignore
      const { success, error } = await createCustomer(
        { ...defaultValues, ...value, certificateUrl: blob.url },
        false,
      );

      if (success) {
        toast.success("Information updated successfully.");
        router.replace("/");
      } else {
        toast.error(error.message ?? "Failed to update information.");
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
      <h2 className="mb-8 text-2xl font-semibold">
        Provide Company Information
      </h2>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <form.AppField
          name="companyName"
          children={(field) => (
            <field.TextField label="Company Name" className="md:col-span-2" />
          )}
        />

        <form.AppField
          name="companyPhone"
          children={(field) => <field.TextField label="Company Number" />}
        />
        <form.AppField
          name="companyEmail"
          children={(field) => <field.TextField label="Company Email" />}
        />

        <form.AppField
          name="officerFirst"
          children={(field) => <field.TextField label="Manager First Name" />}
        />
        <form.AppField
          name="officerLast"
          children={(field) => <field.TextField label="Manager Last Name" />}
        />
        <form.AppField
          name="officerEmail"
          children={(field) => (
            <field.TextField label="Manager Email" className="md:col-span-2" />
          )}
        />

        <form.AppField
          name="orderingName"
          children={(field) => (
            <field.TextField label="Ordering Contact Name" />
          )}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => (
            <field.TextField label="Ordering Contact Phone" />
          )}
        />
        <form.AppField
          name="deliverySchedule"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <div
                      className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2"
                      key={i}
                    >
                      <form.AppField
                        name={`deliverySchedule[${i}].day`}
                        children={(field) => (
                          <field.SelectField
                            label="Delivery Day"
                            options={DELIVERY_DAYS}
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].window`}
                        children={(field) => (
                          <field.SelectField
                            options={DELIVERY_TIME}
                            label="Delivery Window"
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingName`}
                        children={(field) => (
                          <field.TextField label="Receiving Contact Name" />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingPhone`}
                        children={(field) => (
                          <field.TextField label="Receiving Phone" />
                        )}
                      />
                    </div>
                  );
                })}
              </>
            );
          }}
        />
        <form.AppField
          name="certificate"
          children={(field) => (
            <field.FileField
              className="md:col-span-2"
              label={`Resale Certificate ${new Date().getFullYear()}`}
              description="Upload a PDF or image of resale certificate."
            />
          )}
        />
        <div className="text-right md:col-span-2">
          <form.Subscribe
            children={({ isSubmitting }) => (
              <Button
                size="xl"
                className="min-w-32"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Submit"}
              </Button>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  );
};
