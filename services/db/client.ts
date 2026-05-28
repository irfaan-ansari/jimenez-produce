import * as schema from "./schemas/schema";
import * as authSchema from "./schemas/auth";
import { drizzle } from "drizzle-orm/neon-http";
import * as relations from "./schemas/relations";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...authSchema, ...relations },
});
