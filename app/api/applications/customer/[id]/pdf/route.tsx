import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { customer } from "@/lib/db/schema";
import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { CustomerPDF } from "@/components/pdf/customer";
import { getSession } from "@/server/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const data = await db.query.customer.findFirst({
    where: eq(customer.id, Number(id)),
  });

  if (!data) return NextResponse.json({ message: "Failed" }, { status: 400 });

  const stream = await renderToStream(<CustomerPDF data={data} />);

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="customer-${id}.pdf"`,
    },
  });
}
