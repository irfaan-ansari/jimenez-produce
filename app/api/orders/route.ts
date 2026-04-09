import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { getCustomer } from "@/server/customer";
import { or, and, ilike, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isCustomer = session.user.role === "customer";
    const { data: customer } = await getCustomer();

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 10, q, status } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      isCustomer ? eq(order.customerId, customer?.id!) : undefined,
      status ? eq(order.status, status) : undefined,
      q
        ? or(
            ilike(order.receiverName, `%${q}%`),
            ilike(order.receiverPhone, `%${q}%`),
            ilike(order.notes, `%${q}%`)
          )
        : undefined
    );

    const response = await db.query.order.findMany({
      where: filters,
      with: { lineItems: true, location: true, customer: true },
      limit: Number(limit),
      offset,
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(order, filters);

    return NextResponse.json(
      {
        data: response,
        pagination: {
          page,
          limit,
          total: total,
          totalPages: Math.ceil(total / (limit as number)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
