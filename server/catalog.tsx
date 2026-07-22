"use server";
import { toZonedTime } from "date-fns-tz";
import {
  startOfDay,
  endOfDay,
  nextFriday,
  previousSaturday,
  isSaturday,
  isFriday,
  format,
} from "date-fns";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { del, put } from "@vercel/blob";
import { catalog, ProductSelectType } from "@/lib/db/schema";
import { waitUntil } from "@vercel/functions";
import { renderToBuffer } from "@react-pdf/renderer";
import { CatalogPDF } from "@/components/pdf/catalog";
import { handleAction } from "@/lib/helper/error-handler";
import { sendEmail } from "@/lib/email";
import CatalogTemplate from "@/components/email/catalog-template";

const GROUP_MAP: Record<string, string> = {
  "9": "Produce",
  "1": "Tortilla",
  "2": "Dairy",
  "3": "Dry Goods",
  "4": "Disposable",
  "5": "Janitorial",
  "6": "Beverages",
  "7": "Frozen",
  "8": "Meat",
};

const GROUP_ORDER = ["9", "1", "2", "3", "4", "5", "6", "7", "8"];

export const updateCatalog = async (timeZone: string = "America/Chicago") => {
  const session = await getSession();
  const { activeOrganizationId } = session?.session!;

  console.log(timeZone);

  const now = toZonedTime(new Date(), timeZone);

  const validFrom = isSaturday(now)
    ? startOfDay(now)
    : startOfDay(previousSaturday(now));

  const validUntil = isFriday(now) ? endOfDay(now) : endOfDay(nextFriday(now));

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
    if (!email) throw new Error("Email id required.");

    const session = await getSession();
    if (!session) throw new Error("Authentication required.");

    const response = await db.query.catalog.findFirst({
      where: (catalog, { eq }) => eq(catalog.id, id),
    });

    if (!response) throw new Error("Resource not found.");

    const pdfUrl = `https://jimenezproduce.com/api/products/catalog/${response.id}?view=${viewType}&source=email&email=${email}&share=true`;

    waitUntil(
      sendEmail({
        to: [email],
        subject: "Weekly Product Catalog – Jimenez Produce Food Distribution",
        template: CatalogTemplate,
        variables: {
          pdfUrl: pdfUrl,
        },
      }),
    );

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

  console.log("creating pdf...");

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

  const groupedProducts = groupProducts(allProducts);

  const buffer = await renderToBuffer(
    <CatalogPDF
      org={org!}
      effectiveFrom={effectiveFrom}
      effectiveTo={effectiveTo}
      featured={featured}
      products={groupedProducts}
    />,
  );

  const startDate = format(effectiveFrom, "MMMM dd");
  const endDate = format(effectiveTo, "MMMM dd");

  const fileName = `Week of ${startDate} - ${endDate} - Jimenez Produce ${org?.name} Price List`;

  const blob = await put(`catalog/${fileName}.pdf`, buffer, {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: true,
  });

  console.log(blob.url);
  console.log("created pdf...");

  return blob.url;
};

// group products utility
const groupProducts = (products: ProductSelectType[]) => {
  const seen = new Set<number>();

  const sortedProducts = [...products].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: "base",
    }),
  );

  const groupedProducts: Record<string, ProductSelectType[]> = {};

  for (const product of sortedProducts) {
    if (seen.has(product.id)) continue;

    const prefix = String(product.identifier ?? "").charAt(0);
    const groupName = GROUP_MAP[prefix] ?? product.categories?.[0] ?? "Other";

    (groupedProducts[groupName] ??= []).push(product);
    seen.add(product.id);
  }

  const orderedGroupedProducts: Record<string, ProductSelectType[]> = {};

  for (const key of GROUP_ORDER) {
    const groupName = GROUP_MAP[key];

    if (groupedProducts[groupName]) {
      orderedGroupedProducts[groupName] = groupedProducts[groupName];
    }
  }

  for (const [groupName, products] of Object.entries(groupedProducts)) {
    if (!(groupName in orderedGroupedProducts)) {
      orderedGroupedProducts[groupName] = products;
    }
  }

  return orderedGroupedProducts;
};
