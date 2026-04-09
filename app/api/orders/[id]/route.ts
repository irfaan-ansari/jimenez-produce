import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { order } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { getCustomer } from "@/server/customer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isCustomer = session.user.role === "customer";
    const { data: customer } = await getCustomer();

    const { id } = await params;

    const filters = and(
      isCustomer ? eq(order.customerId, customer?.id!) : undefined,
      eq(order.id, Number(id))
    );

    const response = await db.query.order.findFirst({
      where: filters,
      with: { lineItems: true, location: true, customer: true },
    });

    if (!response)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.error("Customers API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
};
