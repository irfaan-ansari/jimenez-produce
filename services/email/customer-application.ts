import { CustomerSelectType } from "@/services/db";
import CustomerNew from "./templates/customer-new";
import CustomerApproved from "./templates/customer-approved";
import CustomerDeclined from "./templates/customer-declined";
import CustomerHold from "./templates/customer-hold";
import { ADMIN_EMAILS, sendEmail } from "./send";
import CustomerAdmin from "./templates/customer-admin";

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
