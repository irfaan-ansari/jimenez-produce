import { db } from "@/lib/db";
import { customer, product, ProductSelectType } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { eq, or, and, ilike, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type PublicProduct = Omit<ProductSelectType, "price" | "offerPrice">;

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    const cookieStore = await cookies();
    const email: string = cookieStore.get("customer-email") as any;

    const customerResponse = await db.query.customer.findFirst({
      where: and(
        or(eq(customer.companyEmail, email), eq(customer.officerEmail, email)),
        eq(customer.status, "approved")
      ),
    });

    const isPublicUser = !session && !customerResponse;

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const { page = 1, limit = 10, status, q } = query;
    const offset = ((page as number) - 1) * Number(limit);

    const statusFilter = isPublicUser
      ? eq(product.status, "active")
      : status
      ? eq(product.status, status)
      : undefined;

    const filters = and(
      statusFilter,
      q
        ? or(
            ilike(product.title, `%${q}%`),
            ilike(product.description, `%${q}%`),
            ilike(product.identifier, `%${q}%`)
          )
        : undefined
    );

    const products = await db
      .select()
      .from(product)
      .where(filters)
      .limit(Number(limit))
      .offset(offset)
      .orderBy(desc(product.createdAt));

    const total = await db.$count(product, filters);

    const data: ProductSelectType[] | PublicProduct[] = !session
      ? products.map(({ price, offerPrice, ...rest }) => rest)
      : products;

    return NextResponse.json(
      {
        data,
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
    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
