import React from "react";
import { Resend } from "resend";
import JobApplied from "@/components/email/job-applied";
import CustomerNew from "@/components/email/customer-new";
import JobRejected from "@/components/email/job-rejected";
import JobInterview from "@/components/email/job-interview";
import JobAgreement from "@/components/email/job-agreement";
import CustomerHold from "@/components/email/customer-hold";
import CustomerAdmin from "@/components/email/customer-admin";
import CustomerApproved from "@/components/email/customer-approved";
import CustomerDeclined from "@/components/email/customer-declined";
import { CustomerSelectType, JobApplicationSelectType } from "../db/schema";

export const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Jimenez Produce <no-reply@jimenezproduce.com>";

export const ADMIN_EMAILS = [
  "jorge@jimenezproduce.com",
  "elizabeth@jimenezproduce.com",
];

interface EmailConfig {
  to: string | string[];
  subject: string;
  template: React.FC<any>;
  variables: Record<string, any>;
}

export async function sendEmail({
  to,
  subject,
  template,
  variables = {},
}: EmailConfig) {
  const element = React.createElement(template, variables);

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject,
    react: element,
  });

  return result;
}

export async function sendApplicationStatusEmails({
  officerFirst,
  officerEmail,
  officerMobile,
  companyName,
  companyPhone,
  companyEmail,
  companyStreet,
  companyState,
  companyCity,
  companyZip,
  status,
  statusReason,
  statusDetails,
  internalNotes,
}: CustomerSelectType) {
  const baseCustomerVars = {
    name: officerFirst,
    company: companyName,
  };

  const statusConfig = {
    new: {
      subject: "Application Submitted",
      template: CustomerNew,
      extraVars: {},
    },
    approved: {
      subject: "Application Approved",
      template: CustomerApproved,
      extraVars: {},
    },
    rejected: {
      subject: "Application Declined",
      template: CustomerDeclined,
      extraVars: {
        reason: statusReason,
        reasonDetails: statusDetails,
      },
    },
    on_hold: {
      subject: "Application On Hold",
      template: CustomerHold,
      extraVars: {
        reason: statusReason,
        reasonDetails: statusDetails,
      },
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  if (config) {
    await sendEmail({
      to: [companyEmail, officerEmail],
      subject: config.subject,
      template: config.template,
      variables: {
        ...baseCustomerVars,
        ...config.extraVars,
      },
    });
  }
  // Send admin email

  await sendEmail({
    to: ADMIN_EMAILS,
    subject: "Application Status Updated",
    template: CustomerAdmin,
    variables: {
      name: companyName,
      phone: companyPhone,
      email: companyEmail,
      address: [companyStreet, companyCity, companyState, companyZip].join(" "),
      primaryContact: officerFirst,
      primaryEmail: officerEmail,
      primaryPhone: officerMobile,
      status: status,
      ...(!["new", "approved"].includes(status) && {
        statusDetails: statusDetails,
        statusReason: statusReason,
        internalNotes: internalNotes,
      }),
    },
  });
}

export const sendJobStatusEmail = async ({
  firstName,
  position,
  email,
  status,
  statusReason,
  statusDetails,
}: JobApplicationSelectType) => {
  const baseVariables = { name: firstName, email, position };

  const jobApplicationEmailMap = {
    new: {
      subject: "Application Received – Jimenez Produce",
      template: JobApplied,
      extraVars: {},
    },

    interview: {
      subject: "Interview Invitation – Jimenez Produce",
      template: JobInterview,
      extraVars: { details: statusDetails },
    },

    pending: {
      subject: "Next Steps – Employment Application",
      template: JobAgreement,
      extraVars: {},
    },

    rejected: {
      subject: "Application Status Update – Jimenez Produce",
      template: JobRejected,
      extraVars: {
        reason: statusReason,
        detailedReason: statusDetails,
      },
    },
  };
  const config =
    jobApplicationEmailMap[status as keyof typeof jobApplicationEmailMap];

  if (!config) return;

  sendEmail({
    to: [email],
    subject: config.subject,
    template: config.template,
    variables: {
      ...baseVariables,
      ...config.extraVars,
    },
  });
};
