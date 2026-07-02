"use server";

import {
  startOfDay,
  endOfDay,
  nextFriday,
  previousSaturday,
  isSaturday,
} from "date-fns";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { del, put } from "@vercel/blob";
import { catalog } from "@/lib/db/schema";
import { waitUntil } from "@vercel/functions";
import { renderToBuffer } from "@react-pdf/renderer";
import { CatalogPDF } from "@/components/pdf/catalog";
import { handleAction } from "@/lib/helper/error-handler";

export const updateCatalog = async () => {
  const session = await getSession();
  const { activeOrganizationId } = session?.session!;

  const now = new Date();
  const validFrom = isSaturday(now)
    ? startOfDay(now)
    : startOfDay(previousSaturday(now));

  const validUntil = endOfDay(nextFriday(now));

  let cat = await db.query.catalog.findFirst({
    where: (c, { eq }) => eq(c.organizationId, activeOrganizationId!),
  });

  if (!cat) {
    [cat] = await db
      .insert(catalog)
      .values({
        name: "catalog",
        organizationId: activeOrganizationId!,
        effectiveFrom: validFrom,
        effectiveTo: validUntil,
        pdfUrl: "",
      })
      .returning();
  }

  waitUntil(
    Promise.all([
      generatePDF({
        productIds: cat.featuredProductIds ?? [],
        effectiveFrom: validFrom,
        effectiveTo: validUntil,
      }).then((pdfUrl) =>
        db
          .update(catalog)
          .set({ pdfUrl, effectiveFrom: validFrom, effectiveTo: validUntil })
          .where(eq(catalog.id, cat.id)),
      ),
      del(cat.pdfUrl),
    ]),
  );
  return true;
};
/**
 * send brochure link to email
 */
export const emailBrochure = handleAction(
  async (
    id: number,
    { viewType, email }: { viewType: "web" | "pdf"; email: string },
  ) => {
    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const response = await db.query.catalog.findFirst({
      where: (catalog, { eq }) => eq(catalog.id, id),
    });

    //   send email
    return true;
  },
);

/**
 * generate and upload brochure pdf to vercel blob storage
 * @param productIds
 * @returns
 */
const generatePDF = async ({
  productIds,
  effectiveFrom,
  effectiveTo,
}: {
  productIds: number[];
  effectiveFrom: string | Date;
  effectiveTo: string | Date;
}) => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");
  const { activeOrganizationId } = session.session;

  const [org, allProducts] = await Promise.all([
    db.query.organization.findFirst({
      where: (organization, { eq }) =>
        eq(organization.id, activeOrganizationId!),
    }),
    db.query.product.findMany({
      where: (product, { eq, and }) =>
        and(
          eq(product.organizationId, activeOrganizationId!),
          eq(product.status, "active"),
        ),
    }),
  ]);

  const productIdSet = new Set(productIds);

  const featured = allProducts.filter((product) =>
    productIdSet.has(product.id),
  );

  const groupedProducts = allProducts.reduce<
    Record<string, typeof allProducts>
  >((acc, product) => {
    for (const category of product.categories ?? []) {
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(product);
    }

    return acc;
  }, {});
  const buffer = await renderToBuffer(
    <CatalogPDF
      orgName={org?.name ?? ""}
      effectiveFrom={effectiveFrom}
      effectiveTo={effectiveTo}
      featured={featured}
      products={groupedProducts}
    />,
  );

  const blob = await put(`brochure/brochure.pdf`, buffer, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
};
