ALTER TABLE "inventory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "inventory" CASCADE;--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_identifier_unique";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit" text;