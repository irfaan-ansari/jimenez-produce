"use client";

import z from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useAppForm } from "@/hooks/form-context";
import { createCustomer } from "@/server/customer";
import { defaultValues } from "@/lib/constants/customer";
import { fileSchema } from "@/lib/form-schema/customer-schema";
import {
  LanguageSelector,
  Translations,
  useTranslation,
} from "../ui/language-selector";

const translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Provide Company Information",
      manager: "Manager",
      ordering: "Ordering & Receiving",
      companyName: "Company Name",
      companyPhone: "Company Phone",
      companyEmail: "Company Email",
      officerFirst: "Full Name",
      officerMobile: "Phone Number",
      officerEmail: "Email",
      orderingName: "Ordering Contact Name",
      orderingPhone: "Ordering Contact Phone",
      receivingName: "Receiving Contact Name",
      receivingPhone: "Receiving Phone",
      certificate: "Resale Certificate",
      certificateDesc: "Upload a PDF or image of resale certificate.",
    },
  },

  es: {
    dir: "ltr",
    values: {
      title: "Proporcionar información de la empresa",
      manager: "Gerente",
      ordering: "Pedidos y Recepción",
      companyName: "Nombre de la empresa",
      companyPhone: "Número de la empresa",
      companyEmail: "Correo electrónico de la empresa",
      officerFirst: "Nombre completo",
      officerMobile: "Número de teléfono",
      officerEmail: "Correo electrónico",
      orderingName: "Nombre del contacto de pedidos",
      orderingPhone: "Teléfono del contacto de pedidos",
      receivingName: "Nombre del contacto de recepción",
      receivingPhone: "Teléfono de recepción",
      certificate: "Certificado de reventa",
      certificateDesc: "Sube un PDF o imagen del certificado de reventa.",
    },
  },
} as const;
const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) // keep digits only
  .refine((val) => val.length === 10, {
    message: "Phone must be 10 digits",
  });

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyPhone: phoneSchema,
  companyEmail: z.email("Invalid email"),
  officerFirst: z.string().min(1, "Officer first name is required"),
  officerLast: z.string(),
  officerEmail: z.email("Invalid email"),
  officerMobile: phoneSchema,
  orderingName: z.string().min(1, "Ordering contact name is required"),
  orderingPhone: phoneSchema,
  deliverySchedule: z.array(
    z.object({
      day: z.string(),
      window: z.string(),
      receivingName: z.string().min(1, "Receiving contact name is required"),
      receivingPhone: phoneSchema,
      instructions: z.string(),
    })
  ),
  certificate: fileSchema,
  status: z.string(),
});

export const CustomerDataForm = ({ name }: { name: string }) => {
  const router = useRouter();

  const { t, dir, setLanguage, language } = useTranslation(
    translations as Translations,
    "en"
  );

  const form = useAppForm({
    defaultValues: {
      companyName: name ?? "",
      companyPhone: "",
      companyEmail: "",
      officerFirst: "",
      officerLast: "",
      officerMobile: "",
      officerEmail: "",
      orderingName: "",
      orderingPhone: "",
      deliverySchedule: [
        {
          day: "Anytime",
          window: "Anytime",
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
      const { certificate, ...rest } = value;

      const blob = await upload(`customer/${certificate.name}`, certificate, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      // @ts-ignore
      const { success, error } = await createCustomer(
        { ...defaultValues, ...rest, certificateUrl: blob.url },
        false
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
      className="overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-semibold">{t["title"]}</h2>
        <LanguageSelector
          value={language}
          onValueChange={(v) => setLanguage(v)}
          className="mb-8 ml-auto"
        />
      </div>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <form.AppField
          name="companyName"
          children={(field) => (
            <field.TextField
              label={t["companyName"]}
              className="md:col-span-2"
            />
          )}
        />

        <form.AppField
          name="companyPhone"
          children={(field) => <field.PhoneField label={t["companyPhone"]} />}
        />
        <form.AppField
          name="companyEmail"
          children={(field) => <field.TextField label={t["companyEmail"]} />}
        />
        <div className="md:col-span-2 text-xl font-semibold">
          {t["manager"]}
        </div>
        <form.AppField
          name="officerFirst"
          children={(field) => (
            <field.TextField
              label={t["officerFirst"]}
              className="md:col-span-2"
            />
          )}
        />

        <form.AppField
          name="officerMobile"
          children={(field) => <field.PhoneField label={t["officerMobile"]} />}
        />
        <form.AppField
          name="officerEmail"
          children={(field) => <field.TextField label={t["officerEmail"]} />}
        />

        <div className="md:col-span-2 text-xl font-semibold">
          {t["ordering"]}
        </div>
        <form.AppField
          name="orderingName"
          children={(field) => <field.TextField label={t["orderingName"]} />}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => <field.PhoneField label={t["orderingPhone"]} />}
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
                        name={`deliverySchedule[${i}].receivingName`}
                        children={(field) => (
                          <field.TextField label={t["receivingName"]} />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingPhone`}
                        children={(field) => (
                          <field.PhoneField label={t["receivingPhone"]} />
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
              label={t["certificate"] + new Date().getFullYear()}
              description={t["certificateDes"]}
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
