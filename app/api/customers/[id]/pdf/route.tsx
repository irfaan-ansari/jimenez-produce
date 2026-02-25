import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { customer } from "@/lib/db/schema";
import { renderToStream } from "@react-pdf/renderer";
import { statusMap } from "@/lib/constants/customer";
import { NextRequest, NextResponse } from "next/server";
import { CustomerPDF } from "@/components/pdf/customer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data = await db.query.customer.findFirst({
    where: eq(customer.id, Number(id)),
  });

  if (!data) return NextResponse.json({ message: "Failed" }, { status: 400 });

  const status = statusMap[data.status as keyof typeof statusMap];

  const stream = await renderToStream(
    <CustomerPDF
      data={data}
      statusLabel={status.label}
      statusColor={status.color}
    />
  );

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="customer-${id}.pdf"`,
    },
  });
}
