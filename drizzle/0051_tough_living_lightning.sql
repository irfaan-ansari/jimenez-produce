ALTER TABLE "order_guide_item" DROP CONSTRAINT "order_guide_item_customer_product_unique";--> statement-breakpoint
DROP INDEX "order_guide_item_customerId_idx";--> statement-breakpoint
ALTER TABLE "order_guide_item" DROP COLUMN "customer_id";