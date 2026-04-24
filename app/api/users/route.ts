import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { eq, getTableColumns, max, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { member, session, user } from "@/lib/db/auth-schema";

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

    const latestSession = db
      .select({
        userId: session.userId,
        lastLogin: max(session.updatedAt).as("lastLogin"),
      })
      .from(session)
      .groupBy(session.userId)
      .as("latestSession");

    const members = await db
      .select({
        ...getTableColumns(member),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          image: user.image,
        },
        lastLogin: latestSession.lastLogin,
      })
      .from(member)
      .where(eq(member.organizationId, activeOrganizationId))
      .innerJoin(user, eq(member.userId, user.id))
      .leftJoin(latestSession, eq(member.userId, latestSession.userId))
      .orderBy(asc(latestSession.lastLogin));

    return NextResponse.json({ data: members }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch product." },
      { status: 500 },
    );
  }
}
