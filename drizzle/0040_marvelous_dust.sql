ALTER TABLE "product" ADD COLUMN "location_id" integer;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "base_price" text DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "price_level_id";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "account_id";