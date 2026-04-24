ALTER TABLE "price_level_item" ADD COLUMN "price" text;--> statement-breakpoint
ALTER TABLE "price_level_item" DROP COLUMN "override_value";--> statement-breakpoint
ALTER TABLE "price_level_item" DROP COLUMN "final_price";