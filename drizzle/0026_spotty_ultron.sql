ALTER TABLE "order" RENAME COLUMN "shippingAddress" TO "shipping_address";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "receiverName" TO "receiver_name";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "receiverPhone" TO "receiver_phone";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "lineItemCount" TO "line_item_count";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "lineItemQuantity" TO "line_item_quantity";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "lineItemTotal" TO "line_item_total";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "deliveryDate" TO "delivery_date";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "deliveryWindow" TO "delivery_window";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "deliveryInstruction" TO "delivery_instruction";--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_status" text;