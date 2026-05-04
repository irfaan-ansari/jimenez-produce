import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { order } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { sortLineItems } from "@/lib/utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { activeTeamId, activeOrganizationId, userId } = session.session;

    const { id } = await params;

    const filters = and(
      eq(order.organizationId, activeOrganizationId!),
      eq(order.id, Number(id)),
    );

    const response = await db.query.order.findFirst({
      where: filters,
      with: {
        lineItems: true,
      },
    });

    if (!response)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    const lineItems = sortLineItems(response.lineItems);

    return NextResponse.json(
      { data: { ...response, lineItems } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
};
