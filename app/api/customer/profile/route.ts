import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { team } from "@/lib/db/auth-schema";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export const GET = async () => {
  try {
    const auth = await getSession();

    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { role, activeOrganizationId, activeTeamId } = auth.session;

    if (!activeOrganizationId || !activeTeamId)
      return NextResponse.json(
        { message: ERROR_MESSAGE.BAD_REQUEST },
        { status: 400 },
      );

    if (role !== "customer") {
      return NextResponse.json(
        { message: ERROR_MESSAGE.FORBIDDEN },
        { status: 403 },
      );
    }

    const response = await db.query.team.findFirst({
      where: and(
        eq(team.organizationId, activeOrganizationId),
        eq(team.id, activeTeamId),
      ),
    });

    if (!response)
      return NextResponse.json(
        { message: ERROR_MESSAGE.BAD_REQUEST },
        { status: 400 },
      );

    const { priceLevelId, ...rest } = response;

    return NextResponse.json({ data: rest }, { status: 200 });
  } catch (error: any) {
    console.log("API error:", error);
    return NextResponse.json(
      {
        message: "Failed to get data",
      },
      { status: 500 },
    );
  }
};
