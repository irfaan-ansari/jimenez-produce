import z from "zod";
import { ApplicantConfirmation } from "@/components/job-forms/applicant-confirmation";
import {
  accidentHistorySchema,
  applicantAddressSchema,
  applicantSchema,
  authorizationSchema,
  drivingExperienceSchema,
  educationSchema,
  employementSchema,
  licenseSchema,
  trafficConvictionsSchema,
} from "../form-schema/job-schema";
import { ApplicantEducation } from "@/components/job-forms/applicant-education";
import { ApplicantExperience } from "@/components/job-forms/applicant-experience";
import { ApplicantTrafficConvictions } from "@/components/job-forms/applicant-traffic-convistions";
import { ApplicantAccidentHistory } from "@/components/job-forms/applicant-accident-history";
import { ApplicantDrivingExperience } from "@/components/job-forms/applicant-driving-experience";
import { ApplicantLicense } from "@/components/job-forms/applicant-license";
import { ApplicantAddress } from "@/components/job-forms/applicant-address";
import { ApplicantDetails } from "@/components/job-forms/applicant-details";

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
      "Enter your driver’s license details, including state of issue and expiration date.",
    component: ApplicantLicense,
    schema: licenseSchema,
  },
  {
    title: "Driving Experience",
    description:
      "Share your commercial and non-commercial driving experience, including vehicle types and years driven.",
    component: ApplicantDrivingExperience,
    schema: drivingExperienceSchema,
  },
  {
    title: "Accident Records",
    description:
      "Report all accidents you have been involved in during the last three years.",
    component: ApplicantAccidentHistory,
    schema: accidentHistorySchema,
  },
  {
    title: "Traffic Convictions & Forfeitures",
    description:
      "Disclose any traffic violations, convictions, or bond forfeitures from the past three years.",
    component: ApplicantTrafficConvictions,
    schema: trafficConvictionsSchema,
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
