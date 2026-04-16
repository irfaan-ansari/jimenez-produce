CREATE TABLE "price_level" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"value" integer,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_level_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_level_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "price_level_product_unique" UNIQUE("price_level_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "price_level_id" integer;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "charges" jsonb;--> statement-breakpoint
CREATE INDEX "price_level_item_priceLevelId_idx" ON "price_level_item" USING btree ("price_level_id");--> statement-breakpoint
CREATE INDEX "price_level_item_productId_idx" ON "price_level_item" USING btree ("product_id");