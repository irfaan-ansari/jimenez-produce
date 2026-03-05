"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { getSession } from "./auth";
import { headers } from "next/headers";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { JobApplicationStatus } from "@/lib/types";
import { renderToBuffer } from "@react-pdf/renderer";
import { handleAction } from "@/lib/helper/error-handler";
import { sendEmail, sendJobStatusEmail } from "@/lib/email";
import { JobAgreementPDF } from "@/components/pdf/job-agreement";
import {
  jobApplications,
  JobApplicationInsertType,
  jobInvite,
  JobInviteInsertType,
} from "@/lib/db/schema";
import InternalAgreementNotification from "@/components/email/job-agreement-submit";
import JobInvitation from "@/components/email/job-invite";

export const getJobApplication = handleAction(async (token: string) => {
  if (!token) throw new Error("Invalid token");
  const res = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.token, token),
  });

  if (!res) throw new Error("Invalid token");

  return {
    name: `${res.firstName} ${res.lastName}`,
    position: res.position,
    facility: res.location,
    signatureUrl: res.signatureUrl,
  };
});

export const submitAgreement = handleAction(async (token: string) => {
  if (!token) throw new Error("Invalid request");

  const res = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.token, token),
  });

  if (!res) throw new Error("Resource not found");

  const agreementDate = new Date().toISOString().split("T")[0];

  const buffer = await renderToBuffer(
    JobAgreementPDF({
      data: { ...res, agreementDate },
    })
  );

  const blob = await put(`job-application/agreement.pdf`, buffer, {
    access: "public",
    addRandomSuffix: true,
  });

  const [result] = await db
    .update(jobApplications)
    .set({
      agreementUrl: blob.url,
      agreementDate,
      token: null,
    })
    .where(eq(jobApplications.id, res.id))
    .returning();

  waitUntil(
    sendEmail({
      to: ["info@jimenezproduce.com"],
      subject: "New Employment Agreement Submitted",
      template: InternalAgreementNotification,
      variables: {
        name: `${result.firstName} ${result.lastName}`,
        email: result.email,
        position: result.position,
        facility: result.location,
        submittedAt: result.agreementDate,
        agreementUrl: result.agreementUrl,
      },
    })
  );

  return result;
});
/**
 * Create job application
 * @param data
 * @returns
 */
export const createJobApplication = handleAction(
  async (data: JobApplicationInsertType) => {
    const headersList = await headers();

    const realIp = headersList.get("x-real-ip");
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

    const values = {
      ...data,
      ipAddress: ip,
      status: "new",
      userAgent: headersList.get("user-agent"),
    };

    const [result] = await db
      .insert(jobApplications)
      .values(values)
      .returning();
    revalidatePath("/admin/job-applications");
    // send email
    waitUntil(sendJobStatusEmail(result));
    return result;
  }
);

/**
 * update application
 * @param id
 * @param data
 * @returns
 */
export const updateJobApplication = handleAction(
  async (id: number, data: Partial<JobApplicationInsertType>) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const existing = await db.query.jobApplications.findFirst({
      where: eq(jobApplications.id, id),
    });

    if (!existing) throw new Error("Resource not found.");

    const nextStatus: JobApplicationStatus = data.status as any;

    if (data.status === "pending") {
      data.token = randomBytes(32).toString("hex");
      data.statusReason = "";
      data.statusDetails = "";
    }

    const [result] = await db
      .update(jobApplications)
      .set({
        ...data,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      })
      .where(eq(jobApplications.id, id))
      .returning();

    revalidatePath("/admin/job-applications");

    // send email
    if (nextStatus && nextStatus !== existing.status) {
      waitUntil(sendJobStatusEmail(result));
    }

    return result;
  }
);

/**
 * delete job application
 * @param id
 * @returns
 */
export const deleteJobApplication = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const existing = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .delete(jobApplications)
    .where(eq(jobApplications.id, id))
    .returning({ id: jobApplications.id });
  revalidatePath("/admin/job-applications");
  return result;
});

export const inviteCandidate = handleAction(
  async (data: JobInviteInsertType) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const [res] = await db
      .insert(jobInvite)
      .values({ ...data, status: "invited" })
      .returning();

    waitUntil(
      sendEmail({
        to: [res.email],
        subject: "",
        template: JobInvitation,
        variables: {
          name: res.firstName,
          position: res.position,
          positionSlug: res.positionSlug,
        },
      })
    );
    return res;
  }
);
