ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "order_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "order_userId_idx";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN IF EXISTS "user_id";