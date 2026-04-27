import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { getQueryObject } from "@/lib/helper/query";
import { getSession } from "@/server/auth";
import { or, and, ilike, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await getSession();

    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { userId, activeOrganizationId, activeTeamId } = auth.session;

    if (!activeOrganizationId)
      return NextResponse.json(
        { message: "Not authorized to perform this action" },
        { status: 403 },
      );

    const {
      page = 1,
      limit = 24,
      q,
      status,
      offset = 0,
    } = getQueryObject(req.nextUrl.searchParams);

    const filters = and(
      eq(order.organizationId, activeOrganizationId),
      status ? eq(order.status, status) : undefined,
      q ? or(ilike(order.deliveryInstruction, `%${q}%`)) : undefined,
    );

    const response = await db.query.order.findMany({
      where: filters,
      with: {
        lineItems: true,
        team: true,
      },
      limit: Number(limit),
      offset,
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(order, filters);
    console.log(total, response);

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
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 },
    );
  }
}
