import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { jobApplications } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const data = await db.query.jobApplications.findFirst({
      where: eq(jobApplications.id, Number(id)),
    });

    if (!data)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("jobApplications API Error:", error);

    return NextResponse.json(
      { message: "Failed to load data" },
      { status: 500 }
    );
  }
};
