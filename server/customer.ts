"use server";
import { waitUntil } from "@vercel/functions";
import { db } from "@/lib/db";
import { and, count, eq, ne, or } from "drizzle-orm";
import { getSession } from "./auth";
import { headers } from "next/headers";
import { statusMap } from "@/lib/constants/customer";
import {
  type CustomerInsertType,
  CustomerInviteInsertType,
  customer,
  customerInvite,
} from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { sendCustomerEmail, sendInviteEmail } from "@/lib/email";

/**
 * create a customer - public
 * @param data - customer data to be created
 * @returns the ID of the created customer
 */
export const createCustomer = async (data: CustomerInsertType) => {
  const headersList = await headers();

  const realIp = headersList.get("x-real-ip");
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  const values = {
    ...data,
    ipAddress: ip,
    userAgent: headersList.get("user-agent"),
    thumbnail: `https://api.dicebear.com/9.x/initials/svg?seed=${data.companyName}&scale=80`,
  };

  const [result] = await db.insert(customer).values(values).returning();

  waitUntil(
    linkCustomerInvite({
      id: `${result.id}`,
      companyEmail: data.companyEmail,
      accountPayableEmail: data.accountPayableEmail!,
      officerEmail: data.officerEmail,
      status: "applied",
    })
  );

  waitUntil(
    sendCustomerEmail({
      status: "new",
      emails: [result.officerEmail, result.companyEmail],
      officerFirst: result.officerFirst,
      companyName: result.companyName,
      reason: result.statusReason,
      detailedReason: result.statusDetails,
      internalNotes: result.internalNotes,
    })
  );

  return result;
};

/**
 * link customer account
 * @param param
 */
const linkCustomerInvite = async ({
  id,
  email,
  accountPayableEmail,
  officerEmail,
  status,
}: Record<string, string>) => {
  const invite = await db.query.customerInvite.findFirst({
    where: and(
      or(
        eq(customerInvite.email, email),
        eq(customerInvite.email, accountPayableEmail),
        eq(customerInvite.email, officerEmail)
      ),
      ne(customerInvite.status, "converted")
    ),
  });
  if (invite) {
    await db.update(customerInvite).set({ customerId: Number(id), status });
  }
};

/**
 * update customer
 * @param id {number}
 * @param data
 * @returns
 */
export const updateCustomer = async (
  id: number,
  data: Partial<CustomerInsertType>
) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");

  const existing = await db.query.customer.findFirst({
    where: eq(customer.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const nextStatus = data.status;

  const canUpdate = statusMap[
    existing.status as keyof typeof statusMap
  ].actions.some((action) => action.action === data.status);

  if (!canUpdate) throw new Error("Invalid request data.");

  const [result] = await db
    .update(customer)
    .set({
      ...data,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    })
    .where(eq(customer.id, id))
    .returning();

  revalidatePath("/admin/customers");

  waitUntil(
    linkCustomerInvite({
      id: `${result.id}`,
      companyEmail: data.companyEmail!,
      accountPayableEmail: data.accountPayableEmail!,
      officerEmail: data.officerEmail!,
      status:
        result.status === "active"
          ? "converted"
          : result.status === "rejected"
          ? "rejected"
          : "",
    })
  );

  if (nextStatus && nextStatus !== existing.status) {
    waitUntil(
      sendCustomerEmail({
        status: result.status,
        emails: ["idevirfan@gmail.com", "irfanansari2114@gmail.com"],
        name: result.officerFirst,
        companyName: result.companyName,
        reason: result.statusReason,
        detailedReason: result.statusDetails,
        internalNotes: result.internalNotes,
      })
    );
  }

  return result;
};

/**
 * delete customer
 * @param id
 * @returns
 */
export const deleteCustomer = async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");

  const existing = await db.query.customer.findFirst({
    where: eq(customer.id, id),
  });

  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .delete(customer)
    .where(eq(customer.id, id))
    .returning({ id: customer.id });
  revalidatePath("/admin/customers");
  return result;
};

/**==================================================================
 * customer invites
 ===================================================================*/
/**
 * create invite
 * @param data
 * @returns
 */
export const createInvite = async (data: CustomerInviteInsertType) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");

  const existing = await db.query.customerInvite.findFirst({
    where: eq(customerInvite.email, data.email),
  });

  if (existing) throw new Error("Email already exists!");

  const headersList = await headers();
  const realIp = headersList.get("x-real-ip");
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  const values = {
    ...data,
    ipAddress: ip,
    createdBy: session.user.id,
    userAgent: headersList.get("user-agent"),
  };

  const [result] = await db.insert(customerInvite).values(values).returning();
  revalidatePath("/admin/invites");

  if (result.status === "invited") {
    waitUntil(
      sendInviteEmail({
        emails: [result.email],
        name: result.firstName,
        message: result.message!,
      })
    );
  }

  return result;
};

/**
 * update invite
 * @param id
 * @param data
 * @returns
 */
export const updateInvite = async (
  id: number,
  data: Partial<CustomerInviteInsertType>
) => {
  const existing = await db.query.customerInvite.findFirst({
    where: eq(customerInvite.id, id),
  });
  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .update(customerInvite)
    .set(data)
    .where(eq(customerInvite.id, id))
    .returning({ id: customerInvite.id });

  revalidatePath("/admin/invites");
  return result;
};

/**
 * delete invite
 * @param id
 * @returns
 */
export const deleteInvite = async (id: number) => {
  const existing = await db.query.customerInvite.findFirst({
    where: eq(customerInvite.id, id),
  });
  if (!existing) throw new Error("Resource not found.");

  const [result] = await db
    .delete(customerInvite)

    .where(eq(customerInvite.id, id))
    .returning({ id: customerInvite.id });
  revalidatePath("/admin/invites");
  return result;
};
