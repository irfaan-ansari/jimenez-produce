import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { eq, and, or, exists } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { promotion, promotionTarget } from "@/lib/db/schema";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.session.activeOrganizationId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { activeTeamId, activeOrganizationId } = session.session || {};

    if (!activeTeamId || !activeOrganizationId) {
      return NextResponse.json(
        { message: "Missing account content" },
        { status: 400 },
      );
    }

    const response = await db.query.promotion.findMany({
      where: (p, { eq, and, or, exists }) =>
        and(
          eq(p.organizationId, activeOrganizationId),
          or(
            eq(p.target, "all"),
            exists(
              db
                .select()
                .from(promotionTarget)
                .where(
                  and(
                    eq(promotionTarget.promotionId, p.id),
                    eq(promotionTarget.teamId, activeTeamId),
                  ),
                ),
            ),
          ),
        ),
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });

    const total = await db.$count(
      promotion,
      and(
        eq(promotion.organizationId, activeOrganizationId),
        or(
          eq(promotion.target, "all"),
          exists(
            db
              .select()
              .from(promotionTarget)
              .where(
                and(
                  eq(promotionTarget.promotionId, promotion.id),
                  eq(promotionTarget.teamId, activeTeamId),
                ),
              ),
          ),
        ),
      ),
    );

    return NextResponse.json(
      {
        data: response,
        pagination: {
          page: 1,
          limit: 100,
          total: total,
          totalPages: Math.ceil(total / (100 as number)),
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
