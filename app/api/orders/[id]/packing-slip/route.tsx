import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { order } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { PackingSlip } from "@/components/pdf/packing-slip";
import { sortLineItems } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const data = await db.query.order.findFirst({
    where: eq(order.id, Number(id)),
    with: {
      lineItems: true,
      organization: true,
      team: true,
    },
  });

  if (!data) return NextResponse.json({ message: "Failed" }, { status: 400 });

  const lineItems = sortLineItems(data.lineItems);
  const stream = await renderToStream(
    <PackingSlip
      data={{
        ...data,
        lineItems,
        organization: data.organization!,
        team: data.team!,
      }}
    />,
  );

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="order-${id}.pdf"`,
    },
  });
}
