CREATE TABLE "order_guide_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_guide_item_customer_product_unique" UNIQUE("customer_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "price_level" ADD COLUMN "scope" text DEFAULT 'all' NOT NULL;--> statement-breakpoint
CREATE INDEX "order_guide_item_customerId_idx" ON "order_guide_item" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "order_guide_item_productId_idx" ON "order_guide_item" USING btree ("product_id");