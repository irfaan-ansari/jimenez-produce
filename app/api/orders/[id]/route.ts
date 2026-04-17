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

    const sortOrder = ["9", "8", "7", "2", "1", "3", "4", "5", "6"];
    const orderMap = Object.fromEntries(sortOrder.map((v, i) => [v, i]));

    const { lineItems } = response;
    lineItems.sort((a, b) => {
      const aKey = a.identifier?.[0]!;
      const bKey = b.identifier?.[0]!;
      return (orderMap[aKey] ?? Infinity) - (orderMap[bKey] ?? Infinity);
    });

    return NextResponse.json(
      { data: { ...response, lineItems } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
};
