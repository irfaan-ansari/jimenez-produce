CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"locationId" integer,
	"productId" integer,
	"price" text,
	"offerPrice" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"address" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "product_locationId_idx" ON "inventory" USING btree ("locationId");--> statement-breakpoint
CREATE INDEX "product_productId_idx" ON "inventory" USING btree ("productId");--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "offer_price";