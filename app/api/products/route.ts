import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, or, and, ilike, arrayContains } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 24, status, q, cat } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const filters = and(
      status ? eq(product.status, status) : undefined,
      cat ? arrayContains(product.categories, [cat]) : undefined,
      q
        ? or(
            ilike(product.title, `%${q}%`),
            ilike(product.description, `%${q}%`),
            ilike(product.identifier, `%${q}%`),
          )
        : undefined,
    );

    const products = await db.query.product.findMany({
      where: filters,
      limit: Number(limit),
      offset,
      orderBy: (product, { desc }) => [desc(product.createdAt)],
      with: {
        inventory: {
          with: {
            location: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const total = await db.$count(product, filters);

    return NextResponse.json(
      {
        data: products,
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
