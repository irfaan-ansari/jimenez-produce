import { ApplicantConfirmation } from "@/components/job-forms/applicant-confirmation";
import {
  applicantAddressSchema,
  applicantSchema,
  authorizationSchema,
  educationSchema,
  employementSchema,
  licenseSchema,
} from "../form-schema/job-schema";
import { ApplicantEducation } from "@/components/job-forms/applicant-education";
import { ApplicantExperience } from "@/components/job-forms/applicant-experience";

import { ApplicantLicense } from "@/components/job-forms/applicant-license";
import { ApplicantAddress } from "@/components/job-forms/applicant-address";
import { ApplicantDetails } from "@/components/job-forms/applicant-details";
import z from "zod";

type StepsType = {
  title: string;
  description: string;
  component: React.ComponentType<any>;

  schema: z.ZodObject<any>;
}[];
export const steps: StepsType = [
  {
    title: "Applicant Information",
    description:
      "Provide your personal details so we can identify and contact you regarding your application.",
    component: ApplicantDetails,
    schema: applicantSchema,
  },
  {
    title: "Residence Address",
    description:
      "Provide your  residence address, including street, city, state, and ZIP code.",
    component: ApplicantAddress,
    schema: applicantAddressSchema,
  },
  {
    title: "License Information",
    description:
      "Enter your license details, including state of issue and expiration date.",
    component: ApplicantLicense,
    schema: licenseSchema,
  },
  {
    title: "Employment History",
    description:
      "Provide your employment history, including employers, job titles, and dates of employment.",
    component: ApplicantExperience,
    schema: employementSchema,
  },
  {
    title: "Education",
    description:
      "Enter your educational background, including highest level completed.",
    component: ApplicantEducation,
    schema: educationSchema,
  },
  {
    title: "Documents & Confirmation",
    description:
      "Upload your documents, verify all information is accurate, and confirm to complete your application.",
    component: ApplicantConfirmation,
    schema: authorizationSchema,
  },
];
