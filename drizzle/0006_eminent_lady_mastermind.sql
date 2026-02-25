ALTER TABLE "job_applications" ALTER COLUMN "current_license" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_applications" ADD COLUMN "licenses" jsonb DEFAULT '[]'::jsonb;