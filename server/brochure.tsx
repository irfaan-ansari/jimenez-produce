"use server";

import { CatalogPDF } from "@/components/pdf/catalog";
import { catalog } from "@/lib/db/schema";
import { getSession } from "./auth";
import { db } from "@/lib/db";
import { handleAction } from "@/lib/helper/error-handler";
import { eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";
import { put } from "@vercel/blob";
import { renderToBuffer } from "@react-pdf/renderer";

type CreateBrochureInput = {
  name: string;
  effectiveTo: string;
  productIds: number[];
};

/**
 * create brochure
 * @param data {CreateBrochureInput} brochure data
 * @returns
 */
export const createBrochure = handleAction(
  async (data: CreateBrochureInput) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");

    const { activeOrganizationId } = session.session;

    const { name, productIds, effectiveTo } = data;

    const [result] = await db
      .insert(catalog)
      .values({
        name,
        pdfUrl: "",
        featuredProductIds: productIds,
        effectiveFrom: new Date(),
        effectiveTo: new Date(effectiveTo),
        organizationId: activeOrganizationId!,
      })
      .returning();

    waitUntil(
      generatePDF({
        productIds,
        effectiveFrom: result.effectiveFrom,
        effectiveTo: result.effectiveTo,
      }).then((pdfUrl) =>
        db.update(catalog).set({ pdfUrl }).where(eq(catalog.id, result.id)),
      ),
    );

    return result;
  },
);

/**
 * update brochure
 * @param id {number} brochure id
 * @param data {CreateBrochureInput} brochure data
 * @returns
 */
export const updateBrochure = handleAction(
  async (id: number, data: CreateBrochureInput) => {
    const session = await getSession();

    if (!session) throw new Error("Authentication required.");
    const { activeOrganizationId } = session.session;

    const { name, productIds, effectiveTo } = data;

    const existing = await db.query.catalog.findFirst({
      where: (catalog, { eq, and }) =>
        and(
          eq(catalog.id, id),
          eq(catalog.organizationId, activeOrganizationId!),
        ),
    });

    if (!existing) throw new Error("Resource not found");

    const [result] = await db
      .update(catalog)
      .set({
        name,
        featuredProductIds: productIds,
        effectiveTo: new Date(effectiveTo),
      })
      .where(eq(catalog.id, id))
      .returning();

    waitUntil(
      generatePDF({
        productIds,
        effectiveFrom: result.effectiveFrom,
        effectiveTo: result.effectiveTo,
      }).then((pdfUrl) =>
        db.update(catalog).set({ pdfUrl }).where(eq(catalog.id, id)),
      ),
    );

    return result;
  },
);

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
