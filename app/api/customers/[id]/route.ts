import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { team } from "@/lib/db/auth-schema";
import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json(
        { error: ERROR_MESSAGE.UNAUTHORIZED },
        { status: 401 },
      );
    }

    const conditions = [eq(team.id, id)];

    const [customer, recentOrders, stats] = await Promise.all([
      db.query.team.findFirst({
        where: and(...conditions),
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  name: true,
                  phoneNumber: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          taxRuleItems: {
            with: {
              taxRule: true,
            },
          },
          products: {
            columns: {
              id: true,
              // @ts-ignore
              title: true,
              identifier: true,
              image: true,
              categories: true,
              status: true,
            },
          },
        },
      }),

      db.query.order.findMany({
        where: (order, { eq }) => eq(order.teamId, id),
        orderBy: (order, { desc }) => [desc(order.createdAt)],
        limit: 8,
      }),
      db
        .select({
          activeCount: sql<number>`count(*) filter (where status = 'in_progress')`,
          completedCount: sql<number>`count(*) filter (where status = 'completed')`,
          activeValue: sql<number>`coalesce(sum(total::numeric) filter (where status = 'in_progress'), 0)`,
          completedValue: sql<number>`coalesce(sum(total::numeric) filter (where status = 'completed'), 0)`,
        })
        .from(order)
        .where(eq(order.teamId, id)),
    ]);

    if (!customer) {
      return NextResponse.json(
        { error: ERROR_MESSAGE.NOT_FOUND },
        { status: 404 },
      );
    }
    // transform data
    const transformed = {
      id: customer.id,
      name: customer.name,
      organizationId: customer.organizationId,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      managerName: customer.managerName,
      phone: customer.phone,
      email: customer.email,
      logo: customer.logo,
      priceLevelId: customer.priceLevelId,
      // @ts-ignore
      members: customer?.teamMembers?.map((tm) => {
        return {
          id: tm.userId,
          name: tm.user.name,
          email: tm.user.email,
          phoneNumber: tm.user.phoneNumber,
          image: tm.user.image,
        };
      }),
      // @ts-ignore
      taxRules: customer?.taxRuleItems?.map((tri) => {
        return {
          id: tri.taxRuleId,
          name: tri.taxRule.name,
          rate: tri.taxRule.rate,
        };
      }),
      // @ts-ignore
      ...customer.products,
    };

    return NextResponse.json(
      { data: { ...transformed, recentOrders, stats: stats?.[0] || {} } },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
