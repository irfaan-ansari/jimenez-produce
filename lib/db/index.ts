import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export const findFirst = <T>(values: T[]): T => {
  return values[0]!;
};
