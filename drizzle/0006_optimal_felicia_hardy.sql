ALTER TABLE "customer_invite" RENAME COLUMN "status_updated_by" TO "reviewed_at";--> statement-breakpoint
ALTER TABLE "customer_invite" DROP CONSTRAINT "customer_invite_status_updated_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_invite" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD COLUMN "status_reason" text;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD COLUMN "status_details" text;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;