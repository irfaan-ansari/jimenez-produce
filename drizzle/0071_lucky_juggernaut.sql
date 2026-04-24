ALTER TABLE "price_level_item" ADD COLUMN "override_value" text ;--> statement-breakpoint
ALTER TABLE "price_level_item" ADD COLUMN "final_price" text ;--> statement-breakpoint
ALTER TABLE "price_level_item" DROP COLUMN "value";