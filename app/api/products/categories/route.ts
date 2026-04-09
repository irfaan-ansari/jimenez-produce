import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { product } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const { page = 1, limit = 500, q } = query;

    const { rows } = await db.execute(sql`
        SELECT DISTINCT jsonb_array_elements_text(categories) AS label
        FROM ${product}
        WHERE categories IS NOT NULL
      `);
    const categories = rows.map((row) => row.label as string);

    return NextResponse.json(
      {
        data: categories,
        pagination: {
          page,
          limit,
          total: categories.length,
          totalPages: Math.ceil(categories.length / (limit as number)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
