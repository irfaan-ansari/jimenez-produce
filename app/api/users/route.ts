import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { eq, max, asc, and, ne, ilike, or, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { member, session, user } from "@/lib/db/auth-schema";
import { getQueryObject } from "@/lib/helper/query";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

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
      offset = 0,
      accountType,
    } = getQueryObject(req.nextUrl.searchParams);

    const conditions = [];

    if (accountType === "customer") {
      conditions.push(eq(user.accountType, "customer"), isNotNull(member.id));
    } else {
      conditions.push(ne(user.accountType, "customer"));
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
      .orderBy(asc(lastSession.lastLogin));

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch product." },
      { status: 500 },
    );
  }
}
