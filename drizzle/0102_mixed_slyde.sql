CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "search_text" text;--> statement-breakpoint
CREATE INDEX "products_name_trgm_idx" ON "product" USING gin ("search_text" gin_trgm_ops);