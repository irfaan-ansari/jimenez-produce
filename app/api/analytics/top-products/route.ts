import { db } from "@/lib/db";
import { sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { lineItem } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { getCustomer } from "@/server/customer";

export async function GET() {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data: customer } = await getCustomer();
    const isCustomer = session.user.role === "customer";

    const data = await db
      .select({
        title: lineItem.title,
        totalQuantity: sql<number>`
          SUM(CAST(${lineItem.quantity} AS NUMERIC))
        `,
        totalRevenue: sql<number>`
        SUM(CAST(${lineItem.total} AS NUMERIC))
      `,

        lastPurchasedAt: sql<Date>`
          MAX(${lineItem.createdAt})
        `,
      })

      .from(lineItem)
      .where(
        isCustomer
          ? customer
            ? eq(lineItem.customerId, customer.id)
            : undefined
          : undefined
      )
      .groupBy(lineItem.id)
      .orderBy(
        sql`
        SUM(CAST(${lineItem.quantity} AS NUMERIC)) DESC
      `
      )
      .limit(5);

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Top items error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load data",
      },
      { status: 500 }
    );
  }
}
