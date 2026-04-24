ALTER TABLE "price_level" ADD COLUMN "adjustment_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "price_level" ADD COLUMN "applies_to" text DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "price_level" ADD COLUMN "adjustment_value" text;--> statement-breakpoint
ALTER TABLE "price_level" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "price_level" DROP COLUMN "scope";--> statement-breakpoint
ALTER TABLE "price_level" DROP COLUMN "value";