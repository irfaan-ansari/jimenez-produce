"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { JobApplicationStatus } from "@/lib/types";
import { jobApplications, JobApplicationInsertType } from "@/lib/db/schema";
import { sendJobStatusEmail } from "@/lib/email";
import { handleAction } from "@/lib/helper/error-handler";

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
