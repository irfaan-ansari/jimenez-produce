import { db } from "@/lib/db";
import { catalogView } from "@/lib/db/schema";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = req.nextUrl;

    const query = Object.fromEntries(searchParams.entries());

    const { source = "direct", view, email = "" } = query;

    const response = await db.query.catalog.findFirst({
      where: (c, { and, eq }) => and(eq(c.id, Number(id))),
    });

    if (!response) {
      return NextResponse.json({}, { status: 404 });
    }

    await db.insert(catalogView).values({
      catalogId: Number(id),
      source,
      email,
      viewType: view,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    if (view === "pdf") {
      return NextResponse.redirect(response.pdfUrl);
    }

    return NextResponse.redirect(new URL(`/brochures/${id}`, req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to generate invoice." },
      { status: 400 },
    );

    // return NextResponse.redirect(new URL(`/`, req.url));
  }
}
