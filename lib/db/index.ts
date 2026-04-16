import * as schema from "./schema";
import * as relations from "./relations";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...relations },
});

export const findFirst = <T>(values: T[]): T => {
  return values[0]!;
};
