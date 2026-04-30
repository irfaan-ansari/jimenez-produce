import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { product } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({ message: "products status updated successfully" });
};
