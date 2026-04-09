ALTER TABLE "inventory" RENAME COLUMN "locationId" TO "location_id";--> statement-breakpoint
ALTER TABLE "inventory" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "inventory" RENAME COLUMN "offerPrice" TO "offer_price";--> statement-breakpoint
DROP INDEX "product_locationId_idx";--> statement-breakpoint
DROP INDEX "product_productId_idx";--> statement-breakpoint
CREATE INDEX "product_locationId_idx" ON "inventory" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "product_productId_idx" ON "inventory" USING btree ("product_id");