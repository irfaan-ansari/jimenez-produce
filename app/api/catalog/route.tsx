import { db } from "@/lib/db";
import { catalogView } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const query = Object.fromEntries(searchParams.entries());
    const { source = "direct", viewType, email = "", id } = query;

    const response = await db.query.catalog.findFirst({
      where: (c, { and, eq }) => and(eq(c.id, Number(id))),
    });

    if (!response) {
      return NextResponse.json({}, { status: 404 });
    }

    // track
    await db.insert(catalogView).values({
      catalogId: Number(id),
      source,
      viewType,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
      // sessionId: cookies().get("catalog_session")?.value,
    });

    if (viewType === "pdf") {
      return NextResponse.redirect(response.pdfUrl);
    }
    return NextResponse.redirect(new URL(`/catalog/${id}/viewer`, req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to generate invoice." },
      { status: 400 },
    );
  }
}
