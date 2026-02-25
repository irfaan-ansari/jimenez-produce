"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { headers } from "next/headers";
import { sendJobEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { JobApplicationStatus } from "@/lib/types";
import {
  jobApplications,
  JobApplicationInsertType,
  JobPostInsertType,
  jobPost,
} from "@/lib/db/schema";

/**
 * Create job application
 * @param data
 * @returns
 */
export const createJobApplication = async (data: JobApplicationInsertType) => {
  const headersList = await headers();

  const realIp = headersList.get("x-real-ip");
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  const values = {
    ...data,
    ipAddress: ip,
    userAgent: headersList.get("user-agent"),
  };

  const [result] = await db
    .insert(jobApplications)
    .values(values)
    .returning({ id: jobApplications.id });
  return result;
};

/**
 * update application
 * @param id
 * @param data
 * @returns
 */
export const updateJobApplication = async (
  id: number,
  data: Partial<JobApplicationInsertType>
) => {
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

  if (nextStatus && nextStatus !== existing.status) {
    waitUntil(
      sendJobEmail({
        emails: [result.email],
        name: result.firstName + " " + result.lastName,
        status: result.status!,
        message: result.statusDetails!,
      })
    );
  }

  return result;
};

/**
 * delete job application
 * @param id
 * @returns
 */
export const deleteJobApplication = async (id: number) => {
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
};

/**========================================================
 * JOB POST
 =========================================================*/

/**
 * Create job post
 * @param data
 * @returns
 */
export const createJobPost = async (data: JobPostInsertType) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const [result] = await db
    .insert(jobPost)
    .values(data)
    .returning({ id: jobPost.id });
  return result;
};

/**
 * update job post
 * @param id
 * @param data
 * @returns
 */
export const updateJobPost = async (
  id: number,
  data: Partial<JobPostInsertType>
) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const existing = await db.query.jobPost.findFirst({
    where: eq(jobPost.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .update(jobPost)
    .set(data)
    .where(eq(jobPost.id, id))
    .returning();

  return result;
};

/**
 * delete job post
 * @param id
 * @returns
 */
export const deleteJobPost = async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const existing = await db.query.jobPost.findFirst({
    where: eq(jobPost.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .delete(jobPost)
    .where(eq(jobPost.id, id))
    .returning({ id: jobPost.id });

  return result;
};
