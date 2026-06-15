DROP INDEX "products_name_trgm_idx";--> statement-breakpoint
CREATE INDEX "products_name_trgm_idx" ON "product" USING gin ("search_text" gin_trgm_ops);