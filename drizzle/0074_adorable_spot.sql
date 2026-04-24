ALTER TABLE "user" DROP CONSTRAINT "user_phone_number_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "account_type" text;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "role";