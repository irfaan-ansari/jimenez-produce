import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { order } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { PackingSlip } from "@/components/pdf/packing-slip";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const data = await db.query.order.findFirst({
    where: eq(order.id, Number(id)),
    with: {
      lineItems: true,
      location: true,
    },
  });

  if (!data) return NextResponse.json({ message: "Failed" }, { status: 400 });

  const stream = await renderToStream(<PackingSlip data={data} />);

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="order-${id}.pdf"`,
    },
  });
}
