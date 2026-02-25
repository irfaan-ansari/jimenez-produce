import React from "react";
import { Resend } from "resend";

// Customer Templates
import CustomerNew from "@/components/email/customer-new";
import CustomerHold from "@/components/email/customer-hold";
import CustomerInvite from "@/components/email/customer-invite";
import CustomerDeclined from "@/components/email/customer-declined";
import CustomerApproved from "@/components/email/customer-approved";

// Job Templates
import JobInterview from "@/components/email/job-interview";
import JobAgreement from "@/components/email/job-agreement";
import JobRejected from "@/components/email/job-rejected";

import CustomerNewAdmin from "@/components/email/customer-new-admin";
import CustomerApprovedAdmin from "@/components/email/customer-approved-admin";
import CustomerHoldAdmin from "@/components/email/customer-hold-admin";
import CustomerDeclinedAdmin from "@/components/email/customer-declined-admin";
import JobApplied from "@/components/email/job-applied";

export const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Jimenez Produce <info@jimenezproduce.com>";
const ADMIN_EMAILS = [
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

const CUSTOMER_EMAIL_TEMPLATES = {
  new: {
    template: CustomerNew,
    subject: " Application Received – Jimenez Produce",
    adminTemplate: CustomerNewAdmin,
    adminSubject: "New Customer Application Submitted – Jimenez Produce",
  },
  active: {
    template: CustomerApproved,
    subject: " Application Approved – Welcome to Jimenez Produce",
    adminTemplate: CustomerApprovedAdmin,
    adminSubject: "Customer Application Approved – Jimenez Produce",
  },
  on_hold: {
    template: CustomerHold,
    subject: "Additional Information Required – Account Application",
    adminTemplate: CustomerHoldAdmin,
    adminSubject: "Customer Application On Hold - Jimenez Produce",
  },
  rejected: {
    template: CustomerDeclined,
    subject: "Application Status Update – Jimenez Produce",
    adminTemplate: CustomerDeclinedAdmin,
    adminSubject: "Application Status Update – Jimenez Produce",
  },
  applied: {
    template: CustomerNew,
    subject: " Application Received – Jimenez Produce",
    adminTemplate: CustomerNewAdmin,
    adminSubject: "New Catalog Application Submitted – Jimenez Produce",
  },
};

export async function sendCustomerEmail({
  status,
  emails,
  name,
  companyName,
  reason,
  detailedReason,
  internalNotes,
}: Record<string, any>) {
  if (!status) return;
  const config =
    CUSTOMER_EMAIL_TEMPLATES[status as keyof typeof CUSTOMER_EMAIL_TEMPLATES];

  if (!config) return;

  return await Promise.all([
    sendEmail({
      to: emails,
      subject: config.subject,
      template: config.template,
      variables: {
        name,
        companyName,
        reason,
        detailedReason,
        internalNotes,
      },
    }),
    sendEmail({
      to: ADMIN_EMAILS,
      subject: config.adminSubject,
      template: config.adminTemplate,
      variables: {
        name,
        companyName,
        reason,
        detailedReason,
        internalNotes,
      },
    }),
  ]);
}

/**
 * send customer invite email
 */
export const sendInviteEmail = async ({
  emails,
  name,
  message,
}: {
  emails: string[];
  name: string;
  message: string;
}) => {
  await sendEmail({
    to: emails,
    subject: "Invitation to Apply – Jimenez Produce Food Distribution Account",
    template: CustomerInvite,
    variables: {
      name,
      message,
    },
  });
};

const JOB_EMAIL_TEMPLATES = {
  interview: {
    template: JobInterview,
    subject: "Interview Schedule – Employment Application",
  },
  pending: {
    template: JobAgreement,
    subject: " Next Steps – Employment Application",
  },
  rejected: {
    template: JobRejected,
    subject: "Application Status – Jimenez Produce",
  },
  new: {
    template: JobApplied,
    subject: "Application Received – Jimenez Produce",
  },
};

export const sendJobEmail = async ({
  emails,
  name,
  status,
  message,
}: {
  emails: string[];
  name: string;
  status: string;
  message: string;
}) => {
  if (!status) return;
  const config =
    JOB_EMAIL_TEMPLATES[status as keyof typeof JOB_EMAIL_TEMPLATES];

  if (!config) return;

  await sendEmail({
    to: emails,
    subject: config.subject,
    template: CustomerInvite,
    variables: {
      name,
      message,
    },
  });
};

export const sendOnboardingCompleteAdmin = async ({
  emails,
  name,
  position,
  phone,
  email,
  dateAvailable,
}: {
  emails: string[];
  name: string;
  position: string;
  phone: string;
  email: string;
  dateAvailable: string;
}) => {
  await sendEmail({
    to: emails,
    subject: "Onboarding Completed - Employment Application",
    template: CustomerInvite,
    variables: {
      name,
      position,
      phone,
      email,
      dateAvailable,
    },
  });
};
