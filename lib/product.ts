import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const FILE_PATH = path.resolve("lib/data/products.json");

type ProductType = {
  item: string;
  title: string;
  image: string;
};

type ProductResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

const getActiveItems = () => {
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  const items: ProductType[] = JSON.parse(raw);
  return items.filter((i) => i.image);
};

const hasCatalogAccess = async () => {
  const cookieStore = await cookies();
  return cookieStore.has("catalog");
};

export async function getProducts(page = 1, limit = 18) {
  const hasAccess = await hasCatalogAccess();

  const currentPage = hasAccess ? Math.max(1, page) : 1;

  const filtered = getActiveItems();

  const totalItems = filtered.length;

  const totalPages = hasAccess ? Math.ceil(totalItems / limit) : 1;

  const start = (currentPage - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    pagination: {
      page: currentPage,
      limit,
      totalItems,
      totalPages,
    },
    hasAccess,
  };
}
