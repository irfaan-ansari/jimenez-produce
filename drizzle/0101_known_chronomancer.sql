ALTER TABLE "promotion" ADD COLUMN "action" text;--> statement-breakpoint
ALTER TABLE "promotion" ADD COLUMN "trigger_product_ids" jsonb DEFAULT '[]'::jsonb;