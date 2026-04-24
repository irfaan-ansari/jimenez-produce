ALTER TABLE "price_level" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "receiver_name";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "receiver_phone";