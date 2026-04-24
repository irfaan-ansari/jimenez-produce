ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invitation" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "member" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "invitation" CASCADE;--> statement-breakpoint
DROP TABLE "member" CASCADE;--> statement-breakpoint
DROP TABLE "organization" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "verification" CASCADE;--> statement-breakpoint
ALTER TABLE "customer" DROP CONSTRAINT "customer_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_invite" DROP CONSTRAINT "customer_invite_reviewed_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_invite" DROP CONSTRAINT "customer_invite_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_reviewed_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "line_item" DROP CONSTRAINT "line_item_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "order_guide_item" DROP CONSTRAINT "order_guide_item_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_super_admin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_reason";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_expires";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "manager_name";