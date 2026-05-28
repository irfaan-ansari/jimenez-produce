import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export * from "./send";
export * from "./job-application";

export * from "./templates/password-reset-email";

export * from "./templates/customer-declined";
export * from "./templates/customer-new";
export * from "./templates/customer-invite";
export * from "./templates/customer-approved";
export * from "./templates/customer-hold";
export * from "./templates/customer-admin";

export * from "./templates/job-invite";
export * from "./templates/job-applied";
export * from "./templates/job-rejected";
export * from "./templates/job-interview";
export * from "./templates/job-agreement";
export * from "./templates/job-notifications";
export * from "./templates/job-agreement-submit";

export * from "./templates/catalog-request-new";
export * from "./templates/catalog-request-update";
