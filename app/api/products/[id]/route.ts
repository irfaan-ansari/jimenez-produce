import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { product } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // const session = await getSession();

  // if (!session)
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const data = await db.query.product.findFirst({
    where: eq(product.id, Number(id)),
  });

  if (!data)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ data }, { status: 200 });
}
