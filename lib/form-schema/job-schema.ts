import { z } from "zod";
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 10MB

const applicantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.email("Email is required"),
  dob: z.string().min(1, "DOB is required"),
  socialSecurity: z.string().min(1, "Social security is required"),
  availableStartDate: z.string().min(1, "Available date is required"),
  hasLegalRights: z.string().min(1, "Select option"),
  location: z.string().min(1, "Select location"),
});

const address = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "State is required"),
  yearsAtAddress: z
    .string()
    .min(1, "Years at address is required")
    .refine((val) => !isNaN(val as any), { message: "Must be a number" }),
});

const applicantAddressSchema = z.object({
  currentAddress: address,
  mailingAddress: address,
  addresses: z.array(address),
});

const license = z.object({
  state: z.string().min(1, "State issued is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseType: z.string().min(1, "License type is required"),
  endorsements: z.string().min(1, "Endorsements is required"),
  expiryDate: z.string().min(1, "Expiration date is required"),
});

const licenseSchema = z.object({
  currentLicense: license,
  licenses: z.array(license),
});

const drivingExperienceSchema = z.object({
  drivingExperiences: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      type: z.string().min(1, "Type is required"),
      fromDate: z.string().min(1, "From date is required"),
      toDate: z.string().min(1, "To date is required"),
      approxMilesTotal: z.string().min(1, "Estimated miles is required"),
    })
  ),
});

const accidentHistorySchema = z.object({
  accidentHistory: z.array(
    z.object({
      accidentDate: z.string().min(1, "Date of accident is required"),
      accidentNature: z.string().min(1, "Nature of accident is required"),
      fatalitiesCount: z
        .string()
        .min(1, "Fatalities is required")
        .refine((val) => !isNaN(val as any), { message: "Must be a number" }),
      injuriesCount: z
        .string()
        .min(1, "Injuries is required")
        .refine((val) => !isNaN(val as any), { message: "Must be a number" }),
      chemicalSpill: z.string().min(1, "Chemical Spills is required"),
    })
  ),
});

const trafficConvictionsSchema = z.object({
  trafficConvictions: z.array(
    z.object({
      dateConvicted: z.string().min(1, "Date of conviction is required"),
      violation: z.string().min(1, "Voilation is required"),
      state: z.string().min(1, "State of voilation is required"),
      penalty: z.string().min(1, "Penalty is required"),
      licenseDenied: z.string().min(1, "Required"),
      licenseDeniedReason: z.string().optional(),
      licenseSuspended: z.string().min(1, "Required"),
      licenseSuspendedReason: z.string().optional(),
    })
  ),
});

const employementSchema = z.object({
  experience: z.array(
    z.object({
      employerName: z.string().min(1, "Employer name is required"),
      phone: z.string().min(1, "Employer phone is required"),
      address: z.string().min(1, "Employer address is required"),
      position: z.string().min(1, "Position held is required"),
      fromDate: z.string().min(1, "From date is required"),
      toDate: z.string().min(1, "To date is required"),
      reasonForLeaving: z.string().min(1, "Reason for leaving is required"),
      salary: z.string(),
      gap: z.string().optional(),
      subjectToFmcsa: z.string().min(1, "Required"),
      safetySensitive: z.string().min(1, "Required"),
    })
  ),
});

const education = z.object({
  institutionName: z.string().min(1, "Institutaion name is required"),
  fieldOfStudy: z.string().min(1, "Course of study is required"),
  location: z.string().min(1, "Location is required"),
  yearCompleted: z.string().min(1, "Years completed is required"),
  details: z.string().optional(),
});

const educationSchema = z.object({
  highSchool: education,
  collage: education,
  educations: z.array(education),
});

const authorizationSchema = z.object({
  drivingLicenseFront: z
    .file("License is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  drivingLicenseBack: z
    .file("License is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  socialSecurityFront: z
    .file("Security card is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  socialSecurityBack: z
    .file("Security card is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dotFront: z
    .file("DOT is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dotBack: z
    .file("DOT is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 5MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  signature: z
    .file("Signature is required")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  declaration: z.boolean().refine((val) => val === true, {
    message: "Guarantee agreement is required",
  }),
  applicantName: z.string().min(1, "Applicant name is required"),
});

const jobFormSchema = z.object({
  step: z.number(),
  position: z.string(),
  ...applicantSchema.shape,
  ...applicantAddressSchema.shape,
  ...licenseSchema.shape,
  ...employementSchema.shape,
  ...educationSchema.shape,
  ...authorizationSchema.shape,
});

const driverFormSchema = z.object({
  ...drivingExperienceSchema.shape,
  ...accidentHistorySchema.shape,
  ...trafficConvictionsSchema.shape,
  ...jobFormSchema.shape,
});

export {
  jobFormSchema,
  driverFormSchema,
  applicantSchema,
  applicantAddressSchema,
  licenseSchema,
  drivingExperienceSchema,
  accidentHistorySchema,
  trafficConvictionsSchema,
  employementSchema,
  educationSchema,
  authorizationSchema,
};

export type ApplicantDetailsType = z.infer<typeof applicantSchema>;
export type ApplicantAddressType = z.infer<typeof applicantAddressSchema>;
export type ApplicantLicenseType = z.infer<typeof licenseSchema>;
export type ApplicantDrivingExperienceType = z.infer<
  typeof drivingExperienceSchema
>;
export type ApplicantAccidentHistoryType = z.infer<
  typeof accidentHistorySchema
>;
export type ApplicantTrafficConvictionsType = z.infer<
  typeof trafficConvictionsSchema
>;
export type ApplicantEmployementType = z.infer<typeof employementSchema>;
export type ApplicantEducationType = z.infer<typeof educationSchema>;
export type ApplicantAuthorizationType = z.infer<typeof authorizationSchema>;

export type CareersFormType = z.infer<typeof jobFormSchema>;
export type DriverFormType = z.infer<typeof driverFormSchema>;
