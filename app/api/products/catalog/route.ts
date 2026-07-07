import { db } from "@/lib/db";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { activeOrganizationId } = session.session;

    if (!activeOrganizationId) {
      return NextResponse.json(
        { message: "No active organization." },
        { status: 403 },
      );
    }

    const response = await db.query.catalog.findFirst({
      where: (c, { eq }) => eq(c.organizationId, activeOrganizationId),
      with: {
        views: true,
      },
    });

    if (!response)
      return NextResponse.json(
        { message: "No active organization." },
        { status: 403 },
      );

    const productIds = response.featuredProductIds?.map((item) => item) ?? [];

    const products = await db.query.product.findMany({
      where: (p, { inArray }) => inArray(p.id, productIds),
    });

    return NextResponse.json(
      {
        data: {
          ...response,
          ...products,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to generate invoice." },
      { status: 400 },
    );
  }
}
