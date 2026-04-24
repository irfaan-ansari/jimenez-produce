ALTER TABLE "order" DROP CONSTRAINT "order_location_id_location_id_fk";--> statement-breakpoint
ALTER TABLE "location" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "location" CASCADE;--> statement-breakpoint
