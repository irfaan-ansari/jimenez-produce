import { z } from "zod";
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export const step1Schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyDBA: z.string().min(2, "Company DBA is required"),
  companyEin: z.string().min(2, "Company EIN is required"),
  companyStreet: z.string().min(2, "Street is required"),
  companyCity: z.string().min(2, "City is required"),
  companyState: z.string().min(2, "State is required"),
  companyZip: z.string().min(2, "Zip code is required"),
  companyPhone: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  // new field
  companyType: z.string().min(2, "Business type is required"),
  companyEmail: z.string().min(2, "Email is required"),
});

export const step2Schema = z.object({
  officerFirst: z.string().min(2, "First name is required"),
  officerLast: z.string().min(2, "Last name is required"),
  officerRole: z.string().min(2, "Title is required"),
  officerMobile: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  officerEmail: z.email("Email is required"),
  officerStreet: z.string().min(2, "Street address is required"),
  officerCity: z.string().min(2, "City is required"),
  officerState: z.string().min(2, "State is required"),
  officerZip: z.string().min(2, "Zip code is required"),
});

export const step3Schema = z.object({
  orderingName: z.string().min(2, "Name is required"),
  orderingPhone: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  accountPayableEmail: z.email("Email is required"),
  guarantorName: z.string().min(2, "Name is required"),
  guarantorRole: z.string().min(2, "Title is required"),
  salesRepresentative: z.string().optional(),
});

export const step4Schema = z.object({
  lockboxPermission: z.string().min(2, "Lockbox prefrence is required"),
  deliverySchedule: z.array(
    z.object({
      day: z.string().min(2, "Delivery day is required"),
      window: z.string().min(2, "Delivery time is required"),
      receivingName: z.string().min(2, "Name is required"),
      receivingPhone: z
        .string()
        .min(1, "Phone is required")
        .trim()
        .regex(
          /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
          "Invalid phone number"
        ),
      instructions: z.string().min(2, "Instruction is required"),
    })
  ),
});

export const step5Schema = z.object({
  signatureName: z.string().min(2, "Signature name is required"),
  acknowledge: z.boolean().refine((val) => val === true, {
    message: "Guarantee agreement is required",
  }),
  // files
  certificate: z
    .file("Resale certificate is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dlFront: z
    .file("Driver's licence is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dlBack: z
    .file("Driver's licence is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  signature: z
    .file("Signature is required")
    .mime(["image/png"], "File type is not allowed"),
});

export const customerSchema = z.object({
  step: z.number(),
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
});

export type BusinessDetailsType = z.infer<typeof step1Schema>;
export type BusinessContactType = z.infer<typeof step2Schema>;
export type BusinessAdditionalContactType = z.infer<typeof step3Schema>;
export type BusinessDeliveryType = z.infer<typeof step4Schema>;
export type BusinessAuthorizationType = z.infer<typeof step5Schema>;

export type CustomerFormType = z.infer<typeof customerSchema>;
