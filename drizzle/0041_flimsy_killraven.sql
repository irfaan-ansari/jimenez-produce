ALTER TABLE "user" ALTER COLUMN "location_id" SET DATA TYPE integer USING location_id::integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "manager_name" text;