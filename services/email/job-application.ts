import { CustomerSelectType, JobApplicationSelectType } from "@/services/db";

import JobApplied from "./templates/job-applied";
import CustomerNew from "./templates/customer-new";
import JobRejected from "./templates/job-rejected";
import JobInterview from "./templates/job-interview";
import JobAgreement from "./templates/job-agreement";
import CustomerHold from "./templates/customer-hold";
import CustomerAdmin from "./templates/customer-admin";
import CustomerApproved from "./templates/customer-approved";
import CustomerDeclined from "./templates/customer-declined";
import JobApplicationAdmin from "./templates/job-notifications";
import { ADMIN_EMAILS, sendEmail } from "./send";

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
    active: {
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
  applicantName,
  firstName,
  position,
  phone,
  location,
  email,
  status,
  token,
  statusReason,
  statusDetails,
  internalNotes,
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
      extraVars: {
        agreementUrl: `https://jimenezproduce.com/careers/agreement?token=${token}`,
      },
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

  // applicant emails
  sendEmail({
    to: [email],
    subject: config.subject,
    template: config.template,
    variables: {
      ...baseVariables,
      ...config.extraVars,
    },
  });

  // send admin email
  const res = await sendEmail({
    to: ["info@jimenezproduce.com"],
    subject: "Job Application Update",
    template: JobApplicationAdmin,
    variables: {
      name: applicantName,
      position,
      location,
      email,
      phone,
      status,
      statusReason,
      statusDetails,
      internalNotes,
    },
  });

  return res;
};
