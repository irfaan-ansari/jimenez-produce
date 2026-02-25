import { and, eq, ilike, or } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { findFirst } from "../db";

type PaginationParams = {
  page?: number;
  limit?: number;
  q?: string;
  filters?: Record<string, string | number | undefined>;
};

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function paginate<T extends {}>(
  db: NeonHttpDatabase,
  table: any,
  params: PaginationParams,
  searchFields: (keyof T)[] = []
): Promise<PaginatedResult<T>> {
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const offset = (page - 1) * limit;

  // Build filter conditions
  const filters = params.filters || {};
  const filterConditions = Object.entries(filters).map(([key, value]) =>
    value !== undefined ? eq(table[key as keyof T], value) : undefined
  );

  // Build search conditions
  let searchCondition;
  if (params.q && searchFields.length > 0) {
    searchCondition = or(
      ...searchFields.map((field) =>
        ilike(table[field as keyof T], `%${params.q}%`)
      )
    );
  }

  const whereCondition = and(...filterConditions, searchCondition);

  const data = await db
    .select()
    .from(table)
    .where(whereCondition)
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: table.id.count() })
    .from(table)
    .where(whereCondition)
    .then(findFirst);

  const total = Number(totalResult.count);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
