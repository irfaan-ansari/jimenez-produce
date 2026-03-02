"use server";

import { db } from "@/lib/db";
import { getSession } from "./auth";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import {
  customer,
  customerInvite,
  CustomerInviteInsertType,
  type CustomerInsertType,
} from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { handleAction } from "@/lib/helper/error-handler";
import CustomerInvite from "@/components/email/customer-invite";
import { sendApplicationStatusEmails, sendEmail } from "@/lib/email";
import CatalogRequestNew from "@/components/email/catalog-request-new";
import CatalogRequestUpdate from "@/components/email/catalog-request-update";

/**
 * create a customer - public
 * @param data - customer data to be created
 * @returns the ID of the created customer
 */
export const createCustomer = handleAction(async (data: CustomerInsertType) => {
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
  revalidatePath("/admin/customers");

  waitUntil(
    linkCustomerInvite({
      id: `${result.id}`,
      companyEmail: data.companyEmail,
      accountPayableEmail: data.accountPayableEmail!,
      officerEmail: data.officerEmail,
      status: "applied",
    })
  );

  return result;
});

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
    where: or(
      eq(customerInvite.email, email),
      eq(customerInvite.email, accountPayableEmail),
      eq(customerInvite.email, officerEmail)
    ),
  });

  // update link
  if (invite) {
    await db
      .update(customerInvite)
      .set({ customerId: Number(id), status })
      .where(eq(customerInvite.id, invite.id));
  }
};

/**
 * update customer
 * @param id {number}
 * @param data
 * @returns
 */
export const updateCustomer = handleAction(
  async (id: number, data: Partial<CustomerInsertType>) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const existing = await db.query.customer.findFirst({
      where: eq(customer.id, id),
    });

    if (!existing) throw new Error("Resource not found.");

    const nextStatus = data.status;

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
            ? "approved"
            : result.status === "rejected"
            ? "rejected"
            : "",
      })
    );

    if (nextStatus && nextStatus !== existing.status) {
      waitUntil(sendApplicationStatusEmails(result));
    }

    return result;
  }
);

/**
 * delete customer
 * @param id
 * @returns
 */
export const deleteCustomer = handleAction(async (id: number) => {
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
});

/**==================================================================
 * customer invites
 ===================================================================*/
/**
 * create invite
 * @param data
 * @returns
 */
export const createInvite = handleAction(
  async (data: Partial<CustomerInviteInsertType>) => {
    const session = await getSession();

    const existing = await db.query.customerInvite.findFirst({
      where: eq(customerInvite.email, data.email!),
    });

    if (existing) throw new Error("Duplicate request for this email.");

    const headersList = await headers();
    const realIp = headersList.get("x-real-ip");
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

    const values = {
      ...data,
      email: data.email!,
      firstName: data.firstName!,
      lastName: data.lastName || "",
      status: data.type === "request" ? "new" : "invited",
      ipAddress: ip,
      createdBy: session?.user?.id,
      userAgent: headersList.get("user-agent"),
    };

    const [result] = await db.insert(customerInvite).values(values).returning();
    revalidatePath("/admin/invites");
    revalidatePath("/admin/catalog-requests");

    if (data.type === "request") {
      // send application request received email
      waitUntil(
        sendEmail({
          to: [result.email],
          subject: "Request Submitted – Jimenez Produce Food Distribution",
          template: CatalogRequestNew,
          variables: {
            name: result.firstName,
            company: result.companyName,
            message: result.message,
          },
        })
      );
    } else {
      // send customer invite email
      waitUntil(
        sendEmail({
          to: [result.email],
          subject: "Invitation to Apply – Jimenez Produce Food Distribution",
          template: CustomerInvite,
          variables: {
            name: result.firstName,
            message: result.message,
          },
        })
      );
    }
    return result;
  }
);

/**
 * update invite
 * @param id
 * @param data
 * @returns
 */
export const updateInvite = handleAction(
  async (id: number, data: Partial<CustomerInviteInsertType>) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required");

    const existing = await db.query.customerInvite.findFirst({
      where: eq(customerInvite.id, id),
    });
    if (!existing) throw new Error("Resource not found.");

    const [result] = await db
      .update(customerInvite)
      .set({ ...data, reviewedBy: session.user.id, reviewedAt: new Date() })
      .where(eq(customerInvite.id, id))
      .returning();

    // revalidate path
    revalidatePath("/admin/invites");
    revalidatePath("/admin/catalog-requests");

    if (result.status === "rejected" || result.status === "revoked") {
      // send rejected | revoked email
      waitUntil(
        sendEmail({
          to: [result.email],
          subject: "Catalog Access Update – Jimenez Produce Food Distribution",
          template: CatalogRequestUpdate,
          variables: {
            name: result.firstName,
            status: result.status,
            company: result.companyName,
            reason: result.statusReason,
            message: result.statusDetails,
          },
        })
      );
    } else if (result.type === "request" && result.status === "approved") {
      waitUntil(
        sendEmail({
          to: [result.email],
          subject:
            "Catalog Access Approved – Jimenez Produce Food Distribution",
          template: CatalogRequestUpdate,
          variables: {
            name: result.firstName,
            status: result.status,
            company: result.companyName,
            link:
              result.status === "approved"
                ? `${process.env.BETTER_AUTH_URL}/products?email=${result.email}`
                : undefined,
          },
        })
      );
    }

    return result;
  }
);

/**
 * delete invite
 * @param id
 * @returns
 */
export const deleteInvite = handleAction(async (id: number) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");

  const existing = await db.query.customerInvite.findFirst({
    where: eq(customerInvite.id, id),
  });

  if (!existing) throw new Error("Invitation not found.");

  const [result] = await db
    .delete(customerInvite)
    .where(eq(customerInvite.id, id))
    .returning();

  revalidatePath("/admin/invites");

  return result;
});
