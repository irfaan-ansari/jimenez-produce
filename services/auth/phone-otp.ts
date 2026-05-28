"use server";
import { auth } from "./auth";
import { db } from "@/services/db";
import { handleAction } from "@/lib/helper/error-handler";

/**
 * send otp to user
 * @param phoneNumber
 */
export const sendOtp = handleAction(
  async ({ phoneNumber }: { phoneNumber: string }) => {
    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    });

    if (!account) throw new Error("Invalid phone number");

    return await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber,
      },
    });
  },
);

export const verifyOtp = handleAction(
  async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    });

    if (!account) throw new Error("Invalid phone number");

    return await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
      },
    });
  },
);
