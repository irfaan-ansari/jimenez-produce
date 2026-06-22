ALTER TABLE "team" ADD COLUMN "is_credit_enabled" boolean;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "credit_days" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "credit_limit" text;