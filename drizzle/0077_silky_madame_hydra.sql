ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'in_progress';--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivered_at" timestamp;