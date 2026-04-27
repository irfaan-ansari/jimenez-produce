ALTER TABLE "tax_rule_item" ALTER COLUMN "tax_rule_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "tax_name" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "tax_rate" text;