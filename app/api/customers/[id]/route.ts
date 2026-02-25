import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { customer } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const data = await db.query.customer.findFirst({
      where: eq(customer.id, Number(id)),
    });

    if (!data)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Customers API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
};
