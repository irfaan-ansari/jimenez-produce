import * as schema from "./schema";
import * as relations from "./relations";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...authSchema, ...relations },
});

export const findFirst = <T>(values: T[]): T => {
  return values[0]!;
};
