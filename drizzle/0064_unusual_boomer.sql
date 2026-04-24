ALTER TABLE "order_guide_item" DROP CONSTRAINT "order_guide_item_user_product_unique";--> statement-breakpoint
DROP INDEX "lineItem_locationId_idx";--> statement-breakpoint
DROP INDEX "lineItem_userId_idx";--> statement-breakpoint
DROP INDEX "order_locationId_idx";--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "price_level" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "organization_id" text;--> statement-breakpoint
CREATE INDEX "lineItem_organizationId_idx" ON "line_item" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "lineItem_teamId_idx" ON "line_item" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "order_organizationId_idx" ON "order" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "order_teamId_idx" ON "order" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "order" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_userId_idx" ON "order" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "order_guide_item" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD CONSTRAINT "order_guide_item_team_product_unique" UNIQUE("team_id","product_id");