import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { messages } from "@/lib/db/schema";
import { eq, ilike, and, or, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, status, q } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const conditions = [
      eq(messages.organizationId, session.session.activeOrganizationId),
    ];

    if (q) conditions.push(or(ilike(messages.name, `%${q}%`)) as SQL<unknown>);

    if (status) {
      conditions.push(eq(messages.status, status));
    }

    const filters = and(...conditions);

    const [response, total] = await Promise.all([
      db.query.messages.findMany({
        where: filters,

        limit: Number(limit),
        offset,
        orderBy: (m, { desc }) => [desc(m.createdAt)],
      }),
      db.$count(messages, filters),
    ]);

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
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
