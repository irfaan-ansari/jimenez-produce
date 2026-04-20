"use server";
import { del } from "@vercel/blob";

export const deleteBlob = async (url: string) => {
  return await del(url);
};
