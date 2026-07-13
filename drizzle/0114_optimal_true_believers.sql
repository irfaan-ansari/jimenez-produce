ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'processing';--> statement-breakpoint
ALTER TABLE "message_recipients" ADD COLUMN "content" text NOT NULL DEFAULT '';