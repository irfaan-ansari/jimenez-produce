ALTER TABLE "order" ADD COLUMN "taxable_subtotal" text DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "non_taxable_subtotal" text DEFAULT '0' NOT NULL;