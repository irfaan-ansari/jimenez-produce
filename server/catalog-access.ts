"use server";
import { db } from "@/lib/db";
import {
  catalogAccess,
  CatalogAccessInsertType,
  CatalogAccessSelectType,
} from "@/lib/db/schema";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { getSession } from "./auth";
import { ActionResult } from "@/lib/types";

/**
 * create request
 * @param data
 * @returns
 */
export const createRequest = async (
  data: CatalogAccessInsertType
): Promise<ActionResult<CatalogAccessSelectType>> => {
  try {
    const res = await db.insert(catalogAccess).values(data).returning();

    return { success: true, error: null, data: res[0] };
  } catch (error) {
    const err =
      error instanceof DrizzleQueryError
        ? { message: "Unexpected error occurred, Please try again" }
        : (error as Error);
    return {
      success: false,
      error: err,
      data: null,
    };
  }
};

export const updateRequest = async (
  id: number,
  data: Partial<CatalogAccessInsertType>
) => {
  try {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const existing = await db.query.catalogAccess.findFirst({
      where: eq(catalogAccess.id, id),
    });

    if (!existing) throw new Error("Resource not found.");

    const nextStatus = data.status;

    const res = await db
      .update(catalogAccess)
      .set(data)
      .where(eq(catalogAccess.id, id))
      .returning();

    // schedule email
    if (existing.status !== nextStatus) {
    }
    return { success: true, error: null, data: res[0] };
  } catch (error) {
    return { success: false, error: error, data: null };
  }
};
