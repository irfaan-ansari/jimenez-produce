import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { product } from "@/lib/db/schema";
import { getSession } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await getSession();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { activeOrganizationId } = auth.session;
  if (!activeOrganizationId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await db.query.product.findMany({
    where: eq(product.organizationId, activeOrganizationId),
  });

  const formatted = data.map((product) => ({
    Code: product.identifier ?? "",
    Title: product.title ?? "",
    Unit: product.unit ?? "",
    Description: product.description ?? "",
    Categories: (product.categories as string[])?.join(",") ?? "",
    Price: product.basePrice ?? "",
    Taxable: product.isTaxable ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=products.xlsx",
    },
  });
}
