import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { eq, max, asc, and, ne, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { member, session, user } from "@/lib/db/auth-schema";
import { getQueryObject } from "@/lib/helper/query";

export async function GET(req: NextRequest) {
  try {
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = auth.session;

    if (!activeOrganizationId) {
      return NextResponse.json(
        { message: "No active organization." },
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
    if (accountType) conditions.push(eq(user.accountType, accountType));
    else conditions.push(ne(user.accountType, "customer"));

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
      .where(ne(user.accountType, accountType))
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
