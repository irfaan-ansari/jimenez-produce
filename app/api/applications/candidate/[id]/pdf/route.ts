import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/server/auth";
import { jobApplications } from "@/lib/db/schema";
import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { JobApplicationPDF } from "@/components/pdf/job-application";
import { ERROR_MESSAGE } from "@/lib/helper/error-message";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { role } = session.session;

  if (role !== "admin" && role !== "owner") {
    return NextResponse.json(
      { message: ERROR_MESSAGE.FORBIDDEN },
      { status: 403 },
    );
  }

  const { id } = await params;

  const data = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.id, Number(id)),
  });

  if (!data) return NextResponse.json({ message: "Failed" }, { status: 400 });

  const stream = await renderToStream(JobApplicationPDF({ data }));

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="customer-${id}.pdf"`,
    },
  });
}
