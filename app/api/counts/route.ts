import { db } from "@/lib/db";
import { count } from "drizzle-orm";
import {
  customer,
  customerInvite,
  jobApplications,
  jobPost,
  product,
} from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

const map = {
  customers: () =>
    db
      .select({
        status: customer.status,
        value: count(),
      })
      .from(customer)
      .groupBy(customer.status),
  invites: () =>
    db
      .select({
        status: customerInvite.status,
        value: count(),
      })
      .from(customerInvite)
      .groupBy(customerInvite.status),
  products: () =>
    db
      .select({
        status: product.status,
        value: count(),
      })
      .from(product)
      .groupBy(product.status),
  "job-applications": () =>
    db
      .select({
        status: jobApplications.status,
        value: count(),
      })
      .from(jobApplications)
      .groupBy(jobApplications.status),
  "job-posts": () =>
    db
      .select({
        status: jobPost.status,
        value: count(),
      })
      .from(jobPost)
      .groupBy(jobPost.status),
};
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    const key = searchParams.get("key") as keyof typeof map;

    if (!key || !(key in map)) {
      return NextResponse.json({ message: "Invalid key" }, { status: 400 });
    }

    const handler = map[key];

    const grouped = await handler();

    const dbCountsMap = grouped.reduce((acc, curr) => {
      acc[curr.status!] = Number(curr.value);
      return acc;
    }, {} as Record<string, number>);

    const totalAll = Object.values(dbCountsMap).reduce((a, b) => a + b, 0);

    const counts: Record<string, number> = {
      all: totalAll,
      ...dbCountsMap,
    };

    return NextResponse.json({ data: counts }, { status: 200 });
  } catch (error) {
    console.error("Customers API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
}
