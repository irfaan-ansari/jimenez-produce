ALTER TABLE "line_item" ALTER COLUMN "total" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "subtotal" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "is_taxable" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "tax_amount" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "offer_price";