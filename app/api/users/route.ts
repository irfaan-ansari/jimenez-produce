import { db } from "@/lib/db";
import { getSession } from "@/services/auth";
import { getQueryObject } from "@/lib/helper/query";
import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";
import { member, session, user } from "@/lib/db/auth-schema";
import { eq, max, asc, and, ilike, or, isNotNull, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json(
        { message: ERROR_MESSAGE.UNAUTHORIZED },
        { status: 401 },
      );
    }
    const { activeOrganizationId } = auth.session;

    if (!activeOrganizationId) {
      return NextResponse.json(
        { message: ERROR_MESSAGE.FORBIDDEN },
        { status: 403 },
      );
    }

    const {
      q,
      page = 1,
      limit = 24,
      accountType,
    } = getQueryObject(req.nextUrl.searchParams);

    const offset = (Number(page) - 1) * Number(limit);

    const conditions = [];

    if (accountType === "customer") {
      conditions.push(eq(user.accountType, "customer"), isNotNull(member.id));
    }

    if (q) {
      conditions.push(
        or(
          ilike(user.name, `%${q}%`),
          ilike(user.email, `%${q}%`),
          ilike(user.phoneNumber, `%${q}%`),
        ),
      );
    }

    const lastSession = db
      .select({
        userId: session.userId,
        lastLogin: max(session.updatedAt).as("lastLogin"),
      })
      .from(session)
      .groupBy(session.userId)
      .as("lastSession");

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,
        phoneNumberVerified: user.phoneNumberVerified,
        isSuperAdmin: user.isSuperAdmin,
        isCurrentUser: eq(user.id, auth.session.userId),
        member: {
          id: member.id,
          role: member.role,
        },
        lastLogin: lastSession.lastLogin,
      })
      .from(user)
      .leftJoin(
        member,
        and(
          eq(member.userId, user.id),
          eq(member.organizationId, activeOrganizationId),
        ),
      )
      .leftJoin(lastSession, eq(user.id, lastSession.userId))
      .where(and(...conditions))
      .limit(Number(limit))
      .offset(offset)
      .orderBy(asc(lastSession.lastLogin));

    const [{ total }] = await db
      .select({ total: count() })
      .from(user)
      .leftJoin(
        member,
        and(
          eq(member.userId, user.id),
          eq(member.organizationId, activeOrganizationId),
        ),
      )
      .where(and(...conditions));

    return NextResponse.json(
      {
        data: users,
        pagination: {
          page,
          limit,
          total: total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
